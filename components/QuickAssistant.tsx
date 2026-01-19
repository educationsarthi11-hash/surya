
import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PaperAirplaneIcon, XIcon, ChatBubbleIcon } from './icons/AllIcons';
import { generateText } from '../services/geminiService';
import { User } from '../types';
import Loader from './Loader';

interface QuickAssistantProps {
    user: User;
}

const QuickAssistant: React.FC<QuickAssistantProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResponse('');
        try {
            const prompt = `You are a helpful, concise AI assistant for ${user.name} in the Education Sarthi app. Answer this query briefly (max 3 sentences): "${query}"`;
            const result = await generateText(prompt);
            setResponse(result);
        } catch (error) {
            setResponse("Sorry, I couldn't fetch an answer right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans no-print">
            {/* Chat Window */}
            <div 
                className={`mb-4 w-80 sm:w-96 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl transform transition-all duration-300 origin-bottom-right overflow-hidden ${
                    isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
                }`}
            >
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                        <SparklesIcon className="h-5 w-5" />
                        <h3 className="font-bold text-sm">Quick Assistant</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="p-4 max-h-64 overflow-y-auto">
                    {response ? (
                        <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 border border-slate-100 animate-fade-in-up">
                            <div className="prose prose-sm" dangerouslySetInnerHTML={{__html: response}} />
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 text-xs py-4">
                            Ask me anything about your studies, schedule, or the app!
                        </div>
                    )}
                    {loading && <div className="flex justify-center py-4"><Loader message="Thinking..." /></div>}
                </div>

                <form onSubmit={handleSearch} className="p-3 border-t border-slate-100 bg-white">
                    <div className="relative">
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask a quick question..." 
                            className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-orange-300 focus:ring-0 rounded-full text-sm transition-all"
                        />
                        <button 
                            type="submit" 
                            disabled={!query.trim() || loading}
                            className="absolute right-1 top-1 p-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:bg-slate-300 transition-colors"
                        >
                            <PaperAirplaneIcon className="h-4 w-4" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Floating Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center justify-center h-14 w-14 rounded-full shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-br from-orange-500 to-pink-600'}`}
            >
                {isOpen ? (
                    <XIcon className="h-6 w-6 text-white transition-transform duration-300" />
                ) : (
                    <ChatBubbleIcon className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" />
                )}
            </button>
        </div>
    );
};

export default QuickAssistant;
