
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { ChatMessage } from '../types';
import Loader from './Loader';
import { fileToBase64 } from '../services/geminiService';
import { HeartIcon, SparklesIcon, PaperClipIcon, XCircleIcon, CameraIcon, PaperAirplaneIcon, SpeakerWaveIcon, MicrophoneIcon, FaceSmileIcon, DocumentTextIcon, StopCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useClassroom } from '../contexts/ClassroomContext';
import { useSpeech } from '../hooks/useSpeech';
import UnifiedScanner from './UnifiedScanner';

const MedicalGuru: React.FC = () => {
    const { selectedClass } = useClassroom();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    
    const [language, setLanguage] = useState('English');
    const { playAudio, stopAudio, playingMessageIndex, isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ initialVoice: 'Kore', initialLanguage: language, enableSpeechRecognition: true });

    const systemInstruction = `You are 'AI Medical Guru'. Language: ${language}. Context: ${selectedClass}. Explain medical concepts, diagrams, and case studies clearly. Format with HTML.`;

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({ model: 'gemini-3-pro-preview', config: { systemInstruction } });
        setChat(chatInstance);
        setMessages([{ sender: 'ai', text: `Welcome to AI Medical Guru. How can I assist with your studies in ${selectedClass}?` }]);
    }, [selectedClass, language]);

    const handleSend = useCallback(async (textOverride?: string, fileOverride?: File) => {
        const textToSend = textOverride || input.trim();
        const fileToSend = fileOverride || attachedFile;
        
        if ((!textToSend && !fileToSend) || !chat) return;
        
        setInput(''); setAttachedFile(null); setFilePreview(null);
        const userMsg: ChatMessage = { sender: 'user', text: textToSend || "Scanning document...", filePreview: fileToSend ? URL.createObjectURL(fileToSend) : undefined };
        setMessages(prev => [...prev, userMsg]);
        setLoadingChat(true);

        try {
             const parts: Part[] = [];
             if (textToSend) parts.push({ text: textToSend });
             if (fileToSend) {
                 const b64 = await fileToBase64(fileToSend);
                 parts.push({ inlineData: { data: b64, mimeType: fileToSend.type } });
             }
             const response = await chat.sendMessage({ message: parts });
             setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
        } catch(e) { setMessages(prev => [...prev, { sender: 'ai', text: "Error sending message." }]); }
        finally { setLoadingChat(false); }
    }, [input, attachedFile, chat]);

    const handleScanComplete = (data: any, file: File) => {
        handleSend("Explain this medical document/diagram in detail.", file);
    };

    return (
        <div className="flex flex-col h-[80vh] min-h-[600px] bg-[#efe7dd] rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-white">
             <div className="bg-[#075e54] p-5 flex items-center justify-between text-white z-10 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md"><HeartIcon className="h-7 w-7"/></div>
                    <div><h3 className="font-black text-lg uppercase tracking-tight leading-none">AI Medical Guru</h3><p className="text-[10px] uppercase font-bold opacity-70 mt-1">Specialized Lab Assistant</p></div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-[85%] p-4 rounded-[1.5rem] shadow-lg ${msg.sender === 'user' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                             {msg.filePreview && <img src={msg.filePreview} className="mb-3 rounded-xl max-h-64 object-cover border border-black/5" />}
                             <div className="prose prose-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }} />
                             {msg.sender === 'ai' && <button onClick={() => playAudio(msg.text, i)} className="mt-3 text-emerald-600"><SpeakerWaveIcon className="h-5 w-5"/></button>}
                        </div>
                    </div>
                ))}
                {loadingChat && <Loader message="Analyzing medical data..."/>}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#f0f2f5] flex items-end gap-3 z-10 relative">
                 <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 shadow-inner">
                    <button onClick={() => setIsScannerOpen(true)} className="p-2 text-emerald-600 hover:scale-110 transition-transform" title="Smart Medical Scan"><CameraIcon className="h-6 w-6"/></button>
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask anything about Medicine..." className="flex-1 p-2 border-none focus:ring-0 bg-transparent text-sm font-bold" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 -rotate-45"><PaperClipIcon className="h-6 w-6"/></button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={e => e.target.files && setAttachedFile(e.target.files[0])} accept="image/*,application/pdf" />
                </div>
                <button onClick={() => handleSend()} className="p-4 rounded-full text-white bg-[#00a884] shadow-xl hover:scale-105 active:scale-95 transition-all"><PaperAirplaneIcon className="h-6 w-6"/></button>
            </div>

            <UnifiedScanner 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScanComplete={handleScanComplete}
                title="Medical Page / Prescription Scanner"
            />
        </div>
    );
};

export default MedicalGuru;
