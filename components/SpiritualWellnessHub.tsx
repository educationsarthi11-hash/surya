
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';
import { HeartIcon, SparklesIcon, PaperAirplaneIcon, SpeakerWaveIcon, StopCircleIcon } from './icons/AllIcons';
import { useSpeech } from '../hooks/useSpeech';
import Loader from './Loader';

const SpiritualWellnessHub: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({ 
            model: 'gemini-3-flash-preview', 
            config: { 
                systemInstruction: "You are 'AI Gita Guru'. Act as Lord Krishna guiding Arjuna. Respond only in pure Hindi. Use relevant Shlokas. Be encouraging and provide life values." 
            } 
        });
        setChat(chatInstance);
        setMessages([{ sender: 'ai', text: "वत्स, तुम्हारे मन में क्या दुविधा है? पूछो, मैं तुम्हारा सारथी हूँ।" }]);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || !chat) return;
        const txt = input; setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: txt }]);
        setLoading(true);
        try {
            const response = await chat.sendMessage({ message: txt });
            const aiText = response.text || "मौन ही उत्तर है।";
            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
            playAudio(aiText, messages.length + 1);
        } catch (e) { 
            setMessages(prev => [...prev, { sender: 'ai', text: "क्षमा करें, अभी मैं ध्यान में हूँ।" }]); 
        } finally { setLoading(false); }
    };

    return (
        <div className="h-full flex flex-col bg-[#FFFBEB] rounded-3xl overflow-hidden border-4 border-orange-200">
            <div className="bg-orange-600 p-4 text-white flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <HeartIcon className="h-8 w-8" />
                    <h2 className="text-xl font-bold">AI गीता और संस्कार गुरु</h2>
                </div>
                <button onClick={stopAudio} className={`p-2 rounded-full ${isSpeaking ? 'bg-red-500' : 'hidden'}`}><StopCircleIcon className="h-6 w-6"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-hindi">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[85%] shadow-md ${m.sender === 'user' ? 'bg-orange-100 text-orange-900 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-orange-100'}`}>
                            {m.text}
                            {m.sender === 'ai' && (
                                <button onClick={() => playAudio(m.text, i)} className="ml-2 inline-block"><SpeakerWaveIcon className="h-4 w-4 text-orange-600"/></button>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <Loader message="गुरु जी विचार कर रहे हैं..." />}
            </div>
            <div className="p-4 bg-white border-t-2 border-orange-100 flex gap-2">
                <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="अपनी दुविधा बताएं..." 
                    className="flex-1 p-4 border-2 border-orange-100 rounded-full font-hindi outline-none focus:border-orange-500" 
                />
                <button onClick={handleSend} className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"><PaperAirplaneIcon className="h-6 w-6"/></button>
            </div>
        </div>
    );
};

export default SpiritualWellnessHub;
