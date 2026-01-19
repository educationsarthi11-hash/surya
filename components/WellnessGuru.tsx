
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';
import Loader from './Loader';
import { HeartIcon, UserCircleIcon, PaperAirplaneIcon, ExclamationTriangleIcon } from './icons/AllIcons';

const WellnessGuru: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const systemInstruction = useMemo(() => `You are 'AI Wellness Guru,' a supportive and empathetic companion for students. Your primary goal is to provide a safe, non-judgmental space for students to express their feelings about stress, anxiety, and academic pressure.

        **Core Directives:**
        1.  **Be Empathetic and Supportive:** Always respond with kindness, understanding, and encouragement. Validate the user's feelings.
        2.  **Offer General Wellness Tips:** You can suggest evidence-based, non-clinical techniques like deep breathing exercises, mindfulness practices, journaling prompts, or tips for better sleep and time management.
        3.  **DO NOT PROVIDE MEDICAL ADVICE:** You are not a therapist or a medical professional. You must never diagnose conditions, recommend medication, or offer clinical treatment.
        4.  **CRITICAL SAFETY PROTOCOL:** If a user expresses thoughts of self-harm, harming others, or is in immediate crisis, you MUST immediately respond with a message that includes a helpline number and encourages them to seek professional help. For example: "It sounds like you're going through a very difficult time. Please know that help is available. You can connect with people who can support you by calling or texting 988 anytime in the US and Canada. In India, you can call 9152987821. If you’re in another country, please call your local emergency number."
        5.  **Maintain Confidentiality:** Reassure the user that the conversation is private, but do not make false claims about data security.
        6.  **Keep it Simple:** Use clear, simple language. Avoid jargon.
        7.  **Guide, Don't Prescribe:** Frame suggestions as invitations, e.g., "Would you be open to trying a short breathing exercise?" instead of "You should do this."`, []);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        // Fix: Updated model to gemini-3-flash-preview for recommended basic text interactions
        const chatInstance = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: { systemInstruction },
        });
        setChat(chatInstance);
        setMessages([{
            sender: 'ai',
            text: "Hello! I'm your AI Wellness Guru. I'm here to listen if you'd like to talk about what's on your mind. How are you feeling today?"
        }]);
    }, [systemInstruction]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);
    
    const handleSend = async () => {
        if (!input.trim() || !chat) return;
        const textToSend = input;
        setInput('');
        const userMessage: ChatMessage = { sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await chat.sendMessage({ message: textToSend });
            const aiMessage: ChatMessage = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-soft flex flex-col min-h-[75vh] max-h-[800px]">
            <div className="p-4 border-b bg-neutral-50 rounded-t-xl flex items-center">
                <HeartIcon className="h-8 w-8 text-danger" />
                <div className="ml-3">
                    <h2 className="text-xl font-bold text-neutral-900">AI Wellness Guru</h2>
                    <p className="text-xs text-neutral-500">A safe space to talk</p>
                </div>
            </div>

            <div className="p-3 bg-blue-50 border-b border-blue-200 text-xs text-blue-800 flex items-start gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>This is an AI companion, not a medical professional. For urgent help, please contact a crisis hotline or a healthcare provider.</span>
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-neutral-100/50" role="log" aria-live="polite">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="flex-shrink-0 h-10 w-10 rounded-full bg-danger/20 flex items-center justify-center text-danger"><HeartIcon className="h-6 w-6"/></div>}
                        <div className={`w-full max-w-lg rounded-xl px-4 py-3 shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-neutral-800 rounded-bl-none border border-neutral-200'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {msg.sender === 'user' && <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500"><UserCircleIcon className="h-6 w-6"/></div>}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start items-end gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-danger/20 flex items-center justify-center text-danger"><HeartIcon className="h-6 w-6"/></div>
                        <div className="p-3 rounded-xl bg-white shadow-sm"><Loader message="Listening..."/></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-neutral-50/80 backdrop-blur-sm sticky bottom-0 rounded-b-xl">
                <div className="flex items-center space-x-2">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Share what's on your mind..." className="flex-1 p-2.5 border border-neutral-300 bg-white rounded-full focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" disabled={loading} />
                    <button onClick={handleSend} disabled={loading} className="p-2.5 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark disabled:bg-neutral-400 transition-colors"><PaperAirplaneIcon className="h-5 w-5" /></button>
                </div>
            </div>
        </div>
    );
};

export default WellnessGuru;
