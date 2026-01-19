
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    BanknotesIcon, CalculatorIcon, DocumentTextIcon, 
    ArrowRightIcon, MicrophoneIcon, SparklesIcon,
    ArrowDownTrayIcon, ChartBarIcon, ArrowPathIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';
import { useAppConfig } from '../contexts/AppConfigContext';

// Types for Accounting
interface Transaction {
    id: string;
    date: string;
    type: 'Income' | 'Expense';
    category: string;
    amount: number;
    description: string;
    partyName: string; // Customer or Vendor
}

interface InvoiceItem {
    item: string;
    qty: number;
    rate: number;
    total: number;
}

const AIBusinessManager: React.FC = () => {
    const toast = useToast();
    const { institutionName, primaryColor } = useAppConfig();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'invoice'>('dashboard');
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: 'TXN001', date: '2024-08-01', type: 'Income', category: 'Fees', amount: 45000, description: 'Class 10 Fees', partyName: 'Students Batch A' },
        { id: 'TXN002', date: '2024-08-02', type: 'Expense', category: 'Utilities', amount: 5000, description: 'Electricity Bill', partyName: 'Power Dept' },
        { id: 'TXN003', date: '2024-08-05', type: 'Expense', category: 'Inventory', amount: 12000, description: 'Books Purchase', partyName: 'Stationery Vendor' },
    ]);

    // AI Invoice Generation State
    const [invoicePrompt, setInvoicePrompt] = useState('');
    const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // AI Assistant State
    const [assistantQuery, setAssistantQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const { playAudio, stopAudio, isSpeaking, isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ initialLanguage: 'Hindi' });

    useEffect(() => {
        if (speechInput && !isListening) {
            // Determine if input is for invoice or general query
            if (activeTab === 'invoice') {
                setInvoicePrompt(speechInput);
                handleGenerateInvoice(speechInput);
            } else {
                setAssistantQuery(speechInput);
                handleAskAssistant(speechInput);
            }
            setSpeechInput('');
        }
    }, [speechInput, isListening, activeTab]);

    const getStats = () => {
        const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
        const profit = income - expense;
        return { income, expense, profit };
    };

    const stats = getStats();

    const handleAskAssistant = async (textOverride?: string) => {
        const query = textOverride || assistantQuery;
        if (!query.trim()) return;

        setIsAnalyzing(true);
        setAiResponse('');
        stopAudio();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Act as a smart Chartered Accountant (CA) for "${institutionName}".
                Data: 
                - Total Income: ₹${stats.income}
                - Total Expense: ₹${stats.expense}
                - Net Profit: ₹${stats.profit}
                - Recent Transactions: ${JSON.stringify(transactions.slice(-3))}

                User Question: "${query}"

                Answer in simple Hindi (Hinglish). If the user asks to add a transaction (e.g., "Added 500 for tea"), return a JSON object with the transaction details along with a 'message' field. Otherwise, return just a text response in 'message' field.
                
                Format JSON: { "message": "...", "transaction": { "type": "Income/Expense", "amount": 0, "category": "...", "partyName": "..." } } (Transaction is optional)
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const data = JSON.parse(response.text || '{}');
            setAiResponse(data.message);
            playAudio(data.message, 0);

            if (data.transaction) {
                const newTxn: Transaction = {
                    id: `TXN${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    type: data.transaction.type,
                    amount: data.transaction.amount,
                    category: data.transaction.category || 'Misc',
                    description: 'AI Added',
                    partyName: data.transaction.partyName || 'Cash'
                };
                setTransactions(prev => [newTxn, ...prev]);
                toast.success("Transaction Added by AI!");
            }
        } catch (e) {
            toast.error("AI Accountant is busy.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerateInvoice = async (textOverride?: string) => {
        const input = textOverride || invoicePrompt;
        if (!input.trim()) return;

        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Generate a structured Invoice based on this instruction: "${input}".
                Company: ${institutionName}
                Date: Today
                
                Return JSON:
                {
                    "customerName": "String",
                    "items": [{ "item": "Name", "qty": 0, "rate": 0, "total": 0 }],
                    "subTotal": 0,
                    "tax": 0,
                    "grandTotal": 0
                }
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const invoice = JSON.parse(response.text || '{}');
            setGeneratedInvoice(invoice);
            toast.success("Invoice Drafted!");
        } catch (e) {
            toast.error("Failed to generate invoice.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-[3rem] shadow-soft h-full flex flex-col min-h-[700px] border-4 border-slate-50 animate-pop-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b pb-6">
                <div className="flex items-center gap-5">
                    <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl rotate-3">
                        <BanknotesIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">AI Vyapar Sarthi</h2>
                        <p className="text-sm font-hindi font-bold text-slate-500 tracking-widest mt-1">आपका स्मार्ट मुनीम (Business Manager)</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
                    <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('ledger')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'ledger' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}>Khata Book</button>
                    <button onClick={() => setActiveTab('invoice')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'invoice' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}>Billing</button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        {/* Stats Panel */}
                        <div className="lg:col-span-8 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
                                    <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Income</p>
                                    <p className="text-3xl font-black text-slate-900 mt-2">₹{stats.income.toLocaleString()}</p>
                                </div>
                                <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                                    <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">Expense</p>
                                    <p className="text-3xl font-black text-slate-900 mt-2">₹{stats.expense.toLocaleString()}</p>
                                </div>
                                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Net Profit</p>
                                    <p className={`text-3xl font-black mt-2 ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{stats.profit.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border-4 border-white/5">
                                <div className="absolute top-0 right-0 p-24 bg-indigo-500/20 rounded-full blur-[100px] -mr-10 -mt-10"></div>
                                <h3 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-3 relative z-10">
                                    <SparklesIcon className="h-6 w-6 text-yellow-400"/> Ask AI Accountant
                                </h3>
                                
                                <div className="relative z-10 space-y-4">
                                    {aiResponse && (
                                        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                                            <p className="font-hindi text-lg leading-relaxed italic">"{aiResponse}"</p>
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 bg-white/10 p-2 rounded-2xl flex items-center gap-3 border border-white/10">
                                            <button onClick={toggleListening} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}>
                                                <MicrophoneIcon className="h-6 w-6"/>
                                            </button>
                                            <input 
                                                value={assistantQuery}
                                                onChange={e => setAssistantQuery(e.target.value)}
                                                onKeyPress={e => e.key === 'Enter' && handleAskAssistant()}
                                                placeholder="Ask 'What is my profit?' or 'Added 500 for Taxi'..." 
                                                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 outline-none font-hindi"
                                            />
                                        </div>
                                        <button onClick={() => handleAskAssistant()} className="p-4 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition-all shadow-lg active:scale-95">
                                            <ArrowRightIcon className="h-6 w-6"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Tips */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Actions</h4>
                                <div className="space-y-3">
                                    <button onClick={() => { setActiveTab('invoice'); toast.info("Say: Create bill for..."); }} className="w-full p-4 bg-white rounded-2xl shadow-sm hover:shadow-md flex items-center gap-4 transition-all text-left group">
                                        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 group-hover:scale-110 transition-transform"><DocumentTextIcon className="h-6 w-6"/></div>
                                        <span className="font-bold text-slate-700">Create Bill</span>
                                    </button>
                                    <button className="w-full p-4 bg-white rounded-2xl shadow-sm hover:shadow-md flex items-center gap-4 transition-all text-left group">
                                        <div className="bg-green-50 p-2 rounded-xl text-green-600 group-hover:scale-110 transition-transform"><ChartBarIcon className="h-6 w-6"/></div>
                                        <span className="font-bold text-slate-700">Download GST Report</span>
                                    </button>
                                    <button className="w-full p-4 bg-white rounded-2xl shadow-sm hover:shadow-md flex items-center gap-4 transition-all text-left group">
                                        <div className="bg-orange-50 p-2 rounded-xl text-orange-600 group-hover:scale-110 transition-transform"><ArrowPathIcon className="h-6 w-6"/></div>
                                        <span className="font-bold text-slate-700">Sync with Bank</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ledger' && (
                    <div className="bg-white h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Party / Details</th>
                                        <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Income</th>
                                        <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Expense</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-slate-700">
                                    {transactions.map(t => (
                                        <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-slate-500">{t.date}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900">{t.partyName}</div>
                                                <div className="text-xs text-slate-500">{t.description}</div>
                                            </td>
                                            <td className="p-4 text-right text-green-600 font-bold">{t.type === 'Income' ? `₹${t.amount}` : '-'}</td>
                                            <td className="p-4 text-right text-red-600 font-bold">{t.type === 'Expense' ? `₹${t.amount}` : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'invoice' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
                        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 flex flex-col justify-center space-y-6">
                            <div className="text-center space-y-2">
                                <CalculatorIcon className="h-16 w-16 mx-auto text-slate-300" />
                                <h3 className="text-2xl font-black text-slate-800">Smart Billing</h3>
                                <p className="text-slate-500 font-hindi">बस बोलें या लिखें: "Create bill for Rahul 2 Books 500 rupees"</p>
                            </div>
                            
                            <div className="relative">
                                <textarea 
                                    value={invoicePrompt}
                                    onChange={e => setInvoicePrompt(e.target.value)}
                                    placeholder="Describe the bill..." 
                                    className="w-full h-32 p-6 rounded-3xl border-2 border-slate-200 focus:border-indigo-600 outline-none text-lg font-hindi resize-none shadow-inner bg-white"
                                />
                                <button onClick={toggleListening} className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600'}`}>
                                    <MicrophoneIcon className="h-6 w-6"/>
                                </button>
                            </div>
                            <button 
                                onClick={() => handleGenerateInvoice()} 
                                disabled={isGenerating}
                                className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl hover:bg-slate-900 transition-all active:scale-95"
                            >
                                {isGenerating ? <Loader message="Creating Invoice..." /> : "GENERATE INVOICE"}
                            </button>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col">
                            {generatedInvoice ? (
                                <div className="animate-pop-in flex flex-col h-full bg-white text-slate-900 rounded-[2rem] p-8 overflow-y-auto custom-scrollbar">
                                    <div className="border-b-2 border-slate-100 pb-4 mb-4 flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-xl uppercase tracking-tighter">{institutionName}</h4>
                                            <p className="text-xs text-slate-500">Official Invoice</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Billed To</p>
                                            <p className="font-bold">{generatedInvoice.customerName}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-100">
                                                    <th className="py-2">Item</th>
                                                    <th className="py-2 text-right">Qty</th>
                                                    <th className="py-2 text-right">Rate</th>
                                                    <th className="py-2 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {generatedInvoice.items?.map((item: any, i: number) => (
                                                    <tr key={i} className="border-b border-slate-50">
                                                        <td className="py-2 font-medium">{item.item}</td>
                                                        <td className="py-2 text-right text-slate-500">{item.qty}</td>
                                                        <td className="py-2 text-right text-slate-500">{item.rate}</td>
                                                        <td className="py-2 text-right font-bold">{item.total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-6 pt-4 border-t-2 border-slate-100 space-y-2">
                                        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{generatedInvoice.subTotal}</span></div>
                                        <div className="flex justify-between text-sm"><span>Tax</span><span>{generatedInvoice.tax}</span></div>
                                        <div className="flex justify-between text-xl font-black text-indigo-600 mt-2 pt-2 border-t border-slate-100">
                                            <span>Grand Total</span>
                                            <span>₹{generatedInvoice.grandTotal}</span>
                                        </div>
                                    </div>

                                    <button onClick={() => window.print()} className="mt-6 w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-slate-950 transition-all">
                                        <ArrowDownTrayIcon className="h-5 w-5"/> Print / Save PDF
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
                                    <DocumentTextIcon className="h-24 w-24 mb-4" />
                                    <p className="font-black text-2xl uppercase tracking-widest">Preview Mode</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIBusinessManager;
