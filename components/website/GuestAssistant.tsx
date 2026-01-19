
import React, { useState, useEffect } from 'react';
import { SparklesIcon, XIcon, PaperAirplaneIcon, MicrophoneIcon } from '../icons/AllIcons';
import { generateText } from '../../services/geminiService';
import { useLanguage } from '../../contexts/LanguageContext';
import Loader from '../Loader';

const GuestAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const { t, selectedLanguage } = useLanguage();

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ sender: 'ai', text: t('guest_ai_greet', 'नमस्ते! मैं आपका सार्थी हूँ। मैं आपकी क्या मदद कर सकता हूँ?') }]);
        }
    }, [isOpen, t]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        
        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setLoading(true);

        try {
            const prompt = `You are 'Guest Sarthi', an automated helpful guide for the website 'Suryanshu Sarthi Edu-Hub'.
            The user is not logged in. Answer their question about the app's features (AI Tutor, Video Generator, Admissions).
            
            Current Language/Dialect: ${selectedLanguage.nativeName} (${selectedLanguage.name}).
            IMPORTANT: If the dialect is Haryanvi or Punjabi, respond in that specific tone/style using Hindi script.
            
            Question: "${userText}"
            Limit answer to 2 short sentences.`;

            const response = await generateText(prompt);
            setMessages(prev => [...prev, { sender: 'ai', text: response }]);
        } catch (e) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Service busy. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[200] no-print">
            {isOpen ? (
                <div className="bg-white w-80 sm:w-96 h-[500px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-primary/20 flex flex-col overflow-hidden animate-pop-in">
                    {/* Header */}
                    <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-xl"><SparklesIcon className="h-5 w-5 text-white"/></div>
                            <span className="font-black text-sm uppercase tracking-tighter">Guest Sarthi</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><XIcon className="h-5 w-5"/></button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-hindi leading-relaxed ${m.sender === 'user' ? 'bg-primary text-white rounded-tr-none shadow-md' : 'bg-white border border-slate-200 rounded-tl-none shadow-sm text-slate-700'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="flex justify-start"><Loader message="..." /></div>}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
                        <input 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type a question..."
                            className="flex-1 bg-slate-100 p-3 rounded-2xl text-xs font-bold outline-none focus:bg-white border-2 border-transparent focus:border-primary/30 transition-all"
                        />
                        <button onClick={handleSend} className="p-3 bg-primary text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                            <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-primary/30"
                >
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping group-hover:hidden"></div>
                    <SparklesIcon className="h-8 w-8 text-primary animate-pulse" />
                    <span className="absolute -top-10 right-0 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">AI Assistant</span>
                </button>
            )}
        </div>
    );
};

export default GuestAssistant;
