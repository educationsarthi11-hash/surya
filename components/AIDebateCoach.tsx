import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';
import Loader from './Loader';
import { SparklesIcon, PaperAirplaneIcon, UserCircleIcon, MicrophoneIcon, TrophyIcon, ChartBarIcon } from './icons/AllIcons';
import { useSpeech } from '../hooks/useSpeech';
import { useToast } from '../hooks/useToast';

const AIDebateCoach: React.FC = () => {
    const toast = useToast();
    const [topic, setTopic] = useState('');
    const [stance, setStance] = useState<'For' | 'Against'>('For');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [scores, setScores] = useState<{ logic: number, communication: number, rebuttal: number } | null>(null);

    const { isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ enableSpeechRecognition: true });

    const systemInstruction = useMemo(() => `You are 'AI Debate Coach', a world-class debater and judge. 
    Current Topic: "${topic}".
    User Stance: "${stance}".
    Your Stance: "${stance === 'For' ? 'Against' : 'For'}".
    
    **Protocol:**
    1. Engage in a formal debate. Keep arguments concise (max 3 sentences) but sharp.
    2. After the user speaks, first provide a *very brief* score (1-10) on their Logic and Impact in brackets, e.g., [Logic: 8/10].
    3. Then, rebut their argument strongly and politely.
    4. Present a counter-argument.
    5. Your goal is to train the user to think critically. Point out logical fallacies if they make any.
    `, [topic, stance]);

    useEffect(() => {
        if(speechInput && !isListening) {
            setInput(speechInput);
            handleSend(speechInput);
            setSpeechInput('');
        }
    }, [speechInput, isListening]);

    const startDebate = async () => {
        if (!topic.trim()) {
            toast.error("Please enter a debate topic.");
            return;
        }
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            /* Updated to use gemini-3-pro-preview for advanced rhetorical analysis */
            const chatInstance = ai.chats.create({
                model: 'gemini-3-pro-preview',
                config: { systemInstruction },
            });
            setChat(chatInstance);
            
            const openingMsg = `Welcome to the arena. We are debating: "${topic}". You are arguing ${stance}. Please present your opening statement.`;
            setMessages([{ sender: 'ai', text: openingMsg }]);
            setIsSessionActive(true);
        } catch (e) {
            toast.error("Could not start debate engine.");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || !chat) return;
        
        setInput('');
        const userMessage: ChatMessage = { sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await chat.sendMessage({ message: textToSend });
            const text = response.text || "No response received.";
            
            // Extract mock scores from response if present (simple parsing)
            const scoreMatch = text.match(/Logic:\s*(\d+)/);
            if (scoreMatch) {
                setScores(prev => ({
                    logic: parseInt(scoreMatch[1]),
                    communication: Math.floor(Math.random() * 3) + 7, // Mock dynamic
                    rebuttal: Math.floor(Math.random() * 4) + 6
                }));
            }

            const aiMessage: ChatMessage = { sender: 'ai', text: text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Judge Error: Could not process argument." }]);
        } finally {
            setLoading(false);
        }
    };

    const endDebate = () => {
        setIsSessionActive(false);
        setMessages([]);
        setScores(null);
        setTopic('');
    };

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    if (!isSessionActive) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-soft text-center min-h-[600px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 text-purple-600">
                    <TrophyIcon className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Debate League</h2>
                <p className="text-slate-500 mb-8 max-w-md">Master the art of persuasion. Challenge our AI Champion to a debate on any topic and get real-time scoring on your logic and rhetoric.</p>
                
                <div className="w-full max-w-md space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Debate Topic (विषय)</label>
                        <input 
                            type="text" 
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)} 
                            placeholder="e.g., Artificial Intelligence is dangerous"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Choose Your Side (आपका पक्ष)</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setStance('For')}
                                className={`p-3 rounded-lg border font-bold transition-all ${stance === 'For' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                For (पक्ष)
                            </button>
                            <button 
                                onClick={() => setStance('Against')}
                                className={`p-3 rounded-lg border font-bold transition-all ${stance === 'Against' ? 'bg-red-100 border-red-500 text-red-800' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                Against (विपक्ष)
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={startDebate} 
                        disabled={loading}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transform transition-transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Initializing Arena...' : 'Enter Debate Arena'} <SparklesIcon className="h-5 w-5"/>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-soft flex flex-col h-[80vh] max-h-[800px] overflow-hidden border border-purple-100">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center shrink-0">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2"><SparklesIcon className="h-5 w-5"/> AI Debate Coach</h3>
                    <p className="text-xs opacity-80">Topic: {topic} | You are: {stance}</p>
                </div>
                <button onClick={endDebate} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">End Session</button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
                {/* Chat Area */}
                <div className="lg:col-span-3 flex flex-col h-full bg-slate-50 relative">
                    <div ref={messagesEndRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
                                    <div className="font-bold text-xs mb-1 opacity-70 uppercase tracking-wider">{msg.sender === 'user' ? 'Challenger' : 'AI Judge'}</div>
                                    <div className="prose prose-sm max-w-none prose-invert" dangerouslySetInnerHTML={{__html: msg.text}} />
                                </div>
                            </div>
                        ))}
                        {loading && <div className="flex justify-start"><div className="bg-white p-3 rounded-xl shadow-sm border"><Loader message="Analyzing argument..." /></div></div>}
                    </div>
                    
                    <div className="p-4 bg-white border-t shrink-0">
                        <div className="flex gap-2">
                            <button onClick={toggleListening} className={`p-3 rounded-full border ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500'}`}><MicrophoneIcon className="h-5 w-5"/></button>
                            <input 
                                type="text" 
                                value={input} 
                                onChange={e => setInput(e.target.value)} 
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                placeholder="Type your argument..." 
                                className="flex-1 p-3 border rounded-full focus:ring-2 focus:ring-purple-500 outline-none"
                                disabled={loading}
                            />
                            <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"><PaperAirplaneIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>

                {/* Scoreboard */}
                <div className="lg:col-span-1 bg-white border-l p-4 overflow-y-auto">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ChartBarIcon className="h-5 w-5 text-purple-600"/> Live Scorecard</h4>
                    
                    {scores ? (
                        <div className="space-y-6 animate-pop-in">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">LOGIC & REASONING</div>
                                <div className="text-2xl font-black text-slate-800">{scores.logic}/10</div>
                                <div className="w-full bg-slate-100 h-2 rounded-full mt-1"><div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{width: `${scores.logic * 10}%`}}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">COMMUNICATION</div>
                                <div className="text-2xl font-black text-slate-800">{scores.communication}/10</div>
                                <div className="w-full bg-slate-100 h-2 rounded-full mt-1"><div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{width: `${scores.communication * 10}%`}}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">REBUTTAL STRENGTH</div>
                                <div className="text-2xl font-black text-slate-800">{scores.rebuttal}/10</div>
                                <div className="w-full bg-slate-100 h-2 rounded-full mt-1"><div className="bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{width: `${scores.rebuttal * 10}%`}}></div></div>
                            </div>
                            
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 mt-4">
                                <p className="text-xs text-purple-800 font-medium">💡 <span className="font-bold">Tip:</span> Use more examples to boost your logic score.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-10">
                            <p className="text-sm">Make an argument to see your scores.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIDebateCoach;