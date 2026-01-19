import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';
import Loader from './Loader';
import { BriefcaseIcon, SparklesIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon, PaperAirplaneIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const careers = [
    { id: 'doctor', name: 'Doctor (MBBS)', icon: '🩺', description: 'Diagnose patients in a busy ER.' },
    { id: 'engineer', name: 'Software Engineer', icon: '💻', description: 'Fix a critical bug before launch.' },
    { id: 'pilot', name: 'Airline Pilot', icon: '✈️', description: 'Handle an emergency landing.' },
    { id: 'farmer', name: 'Modern Farmer', icon: '🌾', description: 'Manage crops during a drought.' },
    { id: 'entrepreneur', name: 'Startup Founder', icon: '🚀', description: 'Pitch to investors and manage cash flow.' },
    { id: 'police', name: 'Police Officer', icon: '👮', description: 'Investigate a crime scene.' },
];

const CareerSimulator: React.FC = () => {
    const toast = useToast();
    const [selectedCareer, setSelectedCareer] = useState<typeof careers[0] | null>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [score, setScore] = useState(50); // Start at neutral

    const systemInstruction = useMemo(() => `You are the 'AI Career Simulator Engine'. The user has chosen to simulate a day in the life of a "${selectedCareer?.name}".
    
    **Protocol:**
    1.  **Immersion:** Start by describing a high-stakes, realistic scenario relevant to the job. Use sensory details.
    2.  **Choices:** Present 2-3 clear options for the user to react to the situation.
    3.  **Consequence:** Based on their choice, describe the outcome immediately. If they make a mistake, show the real-world consequence (e.g., patient gets worse, server crashes).
    4.  **Scoring:** In every response, include a hidden score update in brackets like [Score: +5] or [Score: -10] based on their decision.
    5.  **Tone:** Professional, urgent, and immersive.
    6.  **Language:** Mix of English and Hindi (Hinglish) to make it relatable for Indian students.
    `, [selectedCareer]);

    const startGame = async (career: typeof careers[0]) => {
        setSelectedCareer(career);
        setLoading(true);
        setMessages([]);
        setScore(50);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            /* Updated to use gemini-3-pro-preview for complex reasoning and scenario generation */
            const chatInstance = ai.chats.create({
                model: 'gemini-3-pro-preview',
                config: { systemInstruction },
            });
            setChat(chatInstance);
            
            const startMsg = await chatInstance.sendMessage({ message: "Start the simulation." });
            setMessages([{ sender: 'ai', text: startMsg.text }]);
            setIsSessionActive(true);
        } catch (e) {
            toast.error("Could not start simulation.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = async (optionText: string) => {
        if (!chat) return;
        
        const userMessage: ChatMessage = { sender: 'user', text: optionText };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await chat.sendMessage({ message: optionText });
            const text = response.text;
            
            // Parse score update
            const scoreMatch = text?.match(/\[Score:\s*([+-]?\d+)\]/);
            if (scoreMatch) {
                const delta = parseInt(scoreMatch[1]);
                setScore(prev => Math.min(100, Math.max(0, prev + delta)));
            }
            
            // Clean text for display (remove score tag)
            const cleanText = text?.replace(/\[Score:\s*[+-]?\d+\]/g, '').trim() || "No response received.";

            const aiMessage: ChatMessage = { sender: 'ai', text: cleanText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            toast.error("Simulation error.");
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    if (!isSessionActive) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-soft text-center min-h-[600px] flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Career Test Drive</h2>
                <p className="text-slate-500 mb-8">Don't just guess your future. Live it. <span className="font-hindi">(अपना भविष्य सिर्फ सोचो मत, उसे जीकर देखो)</span></p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {careers.map(career => (
                        <button 
                            key={career.id}
                            onClick={() => startGame(career)}
                            className="p-6 rounded-xl border-2 border-slate-100 hover:border-primary/50 hover:shadow-lg transition-all group text-left bg-slate-50 hover:bg-white"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{career.icon}</div>
                            <h3 className="font-bold text-lg text-slate-800">{career.name}</h3>
                            <p className="text-xs text-slate-500 mt-2">{career.description}</p>
                        </button>
                    ))}
                </div>
                {loading && <div className="mt-8"><Loader message="Preparing simulation environment..." /></div>}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-soft flex flex-col h-[80vh] max-h-[800px] overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="text-2xl">{selectedCareer?.icon}</div>
                    <div>
                        <h3 className="font-bold text-lg">{selectedCareer?.name}</h3>
                        <p className="text-xs opacity-80">Day 1 on the job</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs opacity-70">Performance</p>
                        <div className="w-32 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${score > 70 ? 'bg-green-500' : score > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{width: `${score}%`}}
                            ></div>
                        </div>
                    </div>
                    <button onClick={() => setIsSessionActive(false)} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full">Quit Job</button>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
                <div ref={messagesEndRef} className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white mr-2 shrink-0"><BriefcaseIcon className="h-4 w-4"/></div>}
                            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
                                <div className="font-bold text-xs mb-1 opacity-70 uppercase tracking-wider">{msg.sender === 'user' ? 'Action' : 'Situation'}</div>
                                <div className="prose prose-sm max-w-none prose-p:my-1" dangerouslySetInnerHTML={{__html: msg.text}} />
                            </div>
                        </div>
                    ))}
                    {loading && <div className="flex items-center gap-2 p-4 text-slate-500 text-xs"><SparklesIcon className="h-4 w-4 animate-spin"/> AI is simulating consequences...</div>}
                </div>

                {/* Interaction Area */}
                <div className="p-4 bg-white border-t shrink-0">
                    {!loading && messages.length > 0 && messages[messages.length - 1].sender === 'ai' && (
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Your Decision</p>
                            <div className="mt-3 relative">
                                <input 
                                    type="text" 
                                    placeholder="Type your action here..." 
                                    className="w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleOptionClick((e.target as HTMLInputElement).value);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }}
                                />
                                <button className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-md"><PaperAirplaneIcon className="h-5 w-5"/></button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">Example: "I will check the patient's vitals first" or "Call the lead developer for backup"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerSimulator;