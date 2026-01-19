
import React, { useState } from 'react';
import { generateText, sanitizeHtml } from '../services/geminiService';
import { 
    ChartBarIcon, CurrencyRupeeIcon, SparklesIcon, 
    ArrowTrendingUpIcon, BuildingOfficeIcon, BriefcaseIcon,
    SignalIcon, BoltIcon, DocumentTextIcon, CheckCircleIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useAppConfig } from '../contexts/AppConfigContext';

interface ForecastResult {
    totalTurnover: string;
    monthlyBreakdown: { month: string, revenue: number }[];
    incomeStreams: { name: string, percentage: number, amt: string }[];
    executiveSummary: string;
    strategicTips: string[];
}

const AIProfitForecaster: React.FC = () => {
    const toast = useToast();
    const { institutionName } = useAppConfig();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ForecastResult | null>(null);

    // Form State
    const [students, setStudents] = useState(500);
    const [avgFee, setAvgFee] = useState(1000);
    const [franchises, setFranchises] = useState(5);
    const [region, setRegion] = useState('Rural (मंगमत क्षेत्र)');

    const handlePredict = async () => {
        setLoading(true);
        setResult(null);

        try {
            const prompt = `
                Act as a Senior Business Consultant for an Indian EdTech company.
                Target: 1-Year Turnover Prediction for "${institutionName}".
                
                Input Data:
                - Region: ${region}
                - Current Students: ${students}
                - Average Monthly Fee: ₹${avgFee}
                - Target New Franchises: ${franchises}
                
                Calculate:
                1. Monthly Revenue from Students.
                2. Yearly Revenue from Students.
                3. Yearly Revenue from Franchise Setup Fees (Avg ₹1 Lakh/Hub).
                4. Added Revenue from 'Corporate Hiring Fees' (Avg 5k per hire).
                5. Added Revenue from 'Global Bazaar' (10% student sales).
                
                Output MUST be in Hindi (Hinglish mix) and return ONLY JSON:
                {
                    "totalTurnover": "Total Cr/Lakhs string",
                    "monthlyBreakdown": [{"month": "MonthName", "revenue": number}],
                    "incomeStreams": [{"name": "Stream Name", "percentage": number, "amt": "₹ string"}],
                    "executiveSummary": "3-sentence Hindi summary of success path.",
                    "strategicTips": ["Tip 1 in Hindi", "Tip 2 in Hindi", "Tip 3 in Hindi"]
                }
            `;

            const response = await generateText(prompt, 'gemini-3-flash-preview');
            const data = JSON.parse(response.replace(/```json|```/g, '').trim());
            setResult(data);
            toast.success("AI बिजनेस फॉरकास्ट तैयार है!");
        } catch (e) {
            toast.error("AI फॉरकास्ट विफल रहा।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-pop-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b-2 pb-10 border-slate-100">
                <div className="flex items-center gap-8">
                    <div className="bg-primary p-6 rounded-3xl text-slate-950 shadow-2xl shadow-primary/30 rotate-3">
                        <ChartBarIcon className="h-12 w-12" />
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">TURNOVER <span className="text-primary">PREDICTOR</span></h2>
                        <p className="text-xl font-hindi font-bold text-slate-400 mt-1">अगले 1 साल की सफलता का डेटा-आधारित मानचित्र</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Input Sidebar */}
                <div className="lg:col-span-4 bg-slate-50 p-10 rounded-[4rem] border-4 border-slate-100 shadow-inner space-y-8">
                    <h3 className="font-black text-xl uppercase tracking-widest text-slate-800 border-b pb-4">Success Parameters</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Location Strategy</label>
                            <select value={region} onChange={e => setRegion(e.target.value)} className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold">
                                <option>Rural (मंगमत क्षेत्र)</option>
                                <option>Urban (Metro City)</option>
                                <option>Semi-Urban (District Hub)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Target Student Base: {students}</label>
                            <input type="range" min="100" max="5000" step="100" value={students} onChange={e => setStudents(Number(e.target.value))} className="w-full accent-primary" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Monthly Fee (₹): {avgFee}</label>
                            <input type="range" min="200" max="10000" step="100" value={avgFee} onChange={e => setAvgFee(Number(e.target.value))} className="w-full accent-green-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">New Franchises Target: {franchises}</label>
                            <input type="range" min="1" max="50" step="1" value={franchises} onChange={e => setFranchises(Number(e.target.value))} className="w-full accent-blue-500" />
                        </div>
                    </div>

                    <button 
                        onClick={handlePredict} 
                        disabled={loading}
                        className="w-full py-6 bg-slate-950 text-white font-black rounded-3xl shadow-3xl hover:bg-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 text-xl transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader message="" /> : <><SparklesIcon className="h-6 w-6 text-yellow-300"/> RUN FORECAST</>}
                    </button>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-8">
                    {!result && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20 opacity-20 bg-slate-50 rounded-[4rem] border-8 border-dashed border-white">
                            <BoltIcon className="h-40 w-40 mb-8" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Awaiting Input Stream...</h3>
                            <p className="text-lg font-hindi mt-4">अपना टारगेट भरें और देखें कि AI आपकी कंपनी को कहाँ ले जा सकता है।</p>
                        </div>
                    )}

                    {result && (
                        <div className="animate-pop-in space-y-10">
                            {/* Main Highlighting Card */}
                            <div className="bg-slate-900 p-12 rounded-[5rem] text-white shadow-3xl relative overflow-hidden border-b-[20px] border-primary">
                                <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[120px] -mr-16 -mt-16"></div>
                                <div className="relative z-10 flex justify-between items-start mb-12">
                                     <div>
                                         <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Estimated 1-Year Turnover</p>
                                         <h4 className="text-8xl lg:text-[10rem] font-black tracking-tighter leading-none italic">{result.totalTurnover}</h4>
                                     </div>
                                     <div className="p-8 bg-white/5 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-inner">
                                         <ArrowTrendingUpIcon className="h-12 w-12 text-green-400" />
                                     </div>
                                </div>
                                
                                <div className="relative z-10 bg-white/5 p-8 rounded-[3rem] border border-white/10 shadow-inner">
                                     <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2"><SparklesIcon className="h-4 w-4"/> AI Executive Analysis</h5>
                                     <p className="text-2xl font-hindi leading-relaxed text-slate-200 italic font-medium">"{result.executiveSummary}"</p>
                                </div>
                            </div>

                            {/* Revenue Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-10 rounded-[3.5rem] border-4 border-slate-50 shadow-xl space-y-8">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                        <SignalIcon className="h-5 w-5 text-indigo-500"/> Revenue Streams
                                    </h4>
                                    <div className="space-y-6">
                                        {result.incomeStreams.map((s, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-end mb-2">
                                                     <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">{s.name}</span>
                                                     <span className="text-lg font-black text-indigo-600">{s.amt}</span>
                                                </div>
                                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                                                     <div className="h-full bg-indigo-500 rounded-full transition-all duration-[1500ms]" style={{width: `${s.percentage}%`}}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[3.5rem] border-4 border-slate-50 shadow-xl space-y-8">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                                        <BoltIcon className="h-5 w-5 text-primary"/> Strategic Tips (MGM Vision)
                                    </h4>
                                    <div className="space-y-4">
                                        {result.strategicTips.map((tip, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start group hover:bg-primary/5 transition-all">
                                                 <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-primary transition-all"><CheckCircleIcon className="h-4 w-4 text-green-500 group-hover:text-slate-950"/></div>
                                                 <p className="text-sm font-hindi font-bold text-slate-700 leading-relaxed">{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-10 bg-indigo-600 rounded-[4rem] shadow-3xl text-white flex flex-col md:flex-row items-center justify-between gap-10 border-b-[15px] border-white/20">
                <div className="flex-1 text-center md:text-left space-y-4">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Ready to Scale?</h3>
                    <p className="text-lg font-hindi opacity-90 leading-relaxed max-w-xl">
                        "एआई सार्थी के साथ आपका टर्नओवर केवल एक संख्या नहीं, बल्कि मंगमत के हजारों बच्चों की सफलता की गूँज है।"
                    </p>
                </div>
                <button onClick={() => window.print()} className="px-12 py-5 bg-white text-indigo-600 font-black rounded-3xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-sm active:scale-95 flex items-center gap-3">
                    <DocumentTextIcon className="h-6 w-6"/> Download Growth Strategy
                </button>
            </div>
        </div>
    );
};

export default AIProfitForecaster;
