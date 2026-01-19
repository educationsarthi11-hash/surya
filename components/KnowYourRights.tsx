
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, User } from '../types';
import Loader from './Loader';
import { ShieldCheckIcon, SparklesIcon, UserCircleIcon, PaperAirplaneIcon, ExclamationTriangleIcon, PhoneIcon, BookOpenIcon, ScaleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useSpeech } from '../hooks/useSpeech';

interface KnowYourRightsProps {
    user?: User;
    setActiveService?: (s: any) => void;
}

const rightsCategories = [
    { id: 'school', title: 'School Rights', icon: <BookOpenIcon className="h-6 w-6"/>, desc: 'Right to Education, No Punishment' },
    { id: 'cyber', title: 'Cyber Safety', icon: <ShieldCheckIcon className="h-6 w-6"/>, desc: 'Online Bullying, Privacy' },
    { id: 'police', title: 'Police & Safety', icon: <ScaleIcon className="h-6 w-6"/>, desc: 'FIR, Child Protection Laws' },
    { id: 'basic', title: 'Basic Rights', icon: <UserCircleIcon className="h-6 w-6"/>, desc: 'Equality, Freedom of Speech' },
];

const KnowYourRights: React.FC<KnowYourRightsProps> = ({ user }) => {
    const toast = useToast();
    const [chat, setChat] = useState<any>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    const systemInstruction = useMemo(() => `You are 'Adhikar Sarathi,' a friendly, knowledgeable, and patient legal guide for children and students in India.
        
        **Mission:** Explain fundamental rights, safety laws (POCSO, RTE), and cyber rules in simple Hindi/Hinglish.
        
        **Directives:**
        1. **Simplify:** Use stories or examples (e.g., comparing rights to game rules).
        2. **Safety First:** If a user mentions abuse, violence, or danger, IMMEDIATELY provide the Childline 1098 number and advise telling a trusted adult.
        3. **Tone:** Protective, encouraging, and authoritative yet friendly.
        4. **Format:** Use HTML tags (<b>, <ul>, <p>) for readability.
        
        **Emergency Response (Hindi):**
        "यह गंभीर बात है। कृपया तुरंत 1098 (Childline) पर कॉल करें या अपने माता-पिता/शिक्षक को बताएं। आप अकेले नहीं हैं, कानून आपके साथ है।"`, []);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { systemInstruction },
        });
        setChat(chatInstance);
        setMessages([{
            sender: 'ai',
            text: "नमस्ते! मैं आपका 'अधिकार सार्थी' हूँ। क्या आप अपने अधिकारों या सुरक्षा के बारे में कुछ जानना चाहते हैं? (जैसे: 'अगर कोई मुझे परेशान करे तो क्या करूं?')"
        }]);
    }, [systemInstruction]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || !chat) return;
        
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
        setLoading(true);
        stopAudio();

        try {
            const response = await chat.sendMessage({ message: textToSend });
            const text = response.text || "मैं अभी समझ नहीं पाया।";
            setMessages(prev => [...prev, { sender: 'ai', text }]);
            playAudio(text, messages.length + 1);
        } catch (error) {
            toast.error("AI connection failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category: string) => {
        const prompts: {[key: string]: string} = {
            'school': "स्कूल में मेरे क्या अधिकार हैं? (Right to Education के बारे में बताओ)",
            'cyber': "इंटरनेट पर अगर कोई मुझे डराए या फोटो मांगे तो क्या करूँ?",
            'police': "पुलिस से बच्चों को कैसे मदद मिल सकती है? क्या पुलिस बच्चों को गिरफ्तार कर सकती है?",
            'basic': "भारत के संविधान में बच्चों के लिए कौन से मुख्य अधिकार हैं?"
        };
        handleSend(prompts[category]);
    };

    return (
        <div className="bg-white p-6 rounded-[3rem] shadow-soft h-full min-h-[600px] flex flex-col border border-slate-100 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                        <ScaleIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Know Your Rights</h2>
                        <p className="text-sm text-slate-500 font-hindi font-bold">कानूनी सार्थी (Legal Awareness)</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
                    <ExclamationTriangleIcon className="h-4 w-4"/>
                    <span className="text-xs font-black uppercase">Emergency: 1098</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden z-10">
                {/* Left Panel: Topics */}
                <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <SparklesIcon className="h-5 w-5 text-primary"/> Topics
                        </h3>
                        <div className="space-y-3">
                            {rightsCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className="w-full text-left p-4 bg-white rounded-2xl border border-slate-100 hover:border-orange-400 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="text-slate-400 group-hover:text-orange-500 transition-colors">{cat.icon}</div>
                                        <span className="font-bold text-slate-800">{cat.title}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-9">{cat.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-red-600 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 opacity-20"><ShieldCheckIcon className="h-32 w-32"/></div>
                        <h4 className="font-black text-lg uppercase tracking-wider mb-2">Safe Zone</h4>
                        <p className="text-sm opacity-90 font-hindi leading-relaxed mb-4">
                            अगर आपको कोई परेशान कर रहा है, तो डरें नहीं। चाइल्डलाइन (1098) आपकी दोस्त है।
                        </p>
                        <a href="tel:1098" className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-colors">
                            <PhoneIcon className="h-4 w-4"/> Call 1098 Now
                        </a>
                    </div>
                </div>

                {/* Right Panel: Chat */}
                <div className="lg:col-span-2 flex flex-col bg-slate-50 rounded-[2.5rem] border border-slate-200 overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                </div>
                            </div>
                        ))}
                        {loading && <div className="flex justify-start"><Loader message="AI सार्थी सोच रहा है..." /></div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="अपना सवाल यहाँ लिखें..." 
                            className="flex-1 p-3 bg-slate-50 rounded-full font-hindi text-sm border-none focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <button onClick={() => handleSend()} className="p-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all">
                            <PaperAirplaneIcon className="h-5 w-5"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowYourRights;
