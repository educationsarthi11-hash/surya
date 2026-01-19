
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { ChatMessage } from '../types';
import Loader from './Loader';
import { fileToBase64 } from '../services/geminiService';
import { SparklesIcon, PaperClipIcon, XCircleIcon, PaperAirplaneIcon, PhoneIcon, CpuChipIcon, MicrophoneIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import LiveClass from './LiveClass';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useSpeech } from '../hooks/useSpeech';

const AiAssistant: React.FC = () => {
  const { institutionName } = useAppConfig();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLiveClassActive, setIsLiveClassActive] = useState(false);

  const { isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ enableSpeechRecognition: true, initialLanguage: 'English' });

  const systemInstruction = useMemo(() => `You are 'CORE', the central AI intelligence for "${institutionName}" (Year 2035 Edition). Be extremely concise, precise, and helpful. Use a slightly robotic but polite tone.`, [institutionName]);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chatInstance = ai.chats.create({ model: 'gemini-3-pro-preview', config: { systemInstruction } });
    setChat(chatInstance);
    setMessages([{ sender: 'ai', text: `Neural Core Online. Directing resources for ${institutionName}. Awaiting command.` }]);
  }, [systemInstruction]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);
  
  const handleSend = useCallback(async (textOverride?: string) => {
    const textToSend = (textOverride || input).trim();
    if ((!textToSend && !file) || !chat) return;
    setInput(''); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setMessages(prev => [...prev, { sender: 'user', text: textToSend, filePreview: file ? URL.createObjectURL(file) : undefined }]);
    setLoading(true);
    try {
      const messageParts: Part[] = [{ text: textToSend }];
      if (file) {
        const base64Data = await fileToBase64(file);
        messageParts.push({ inlineData: { data: base64Data, mimeType: file.type } });
      }
      const response = await chat.sendMessage({ message: messageParts });
      setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Signal disruption detected." }]);
    } finally { setLoading(false); }
  }, [chat, input, file]);
  
  useEffect(() => {
    if (speechInput && !isListening) {
      setInput(speechInput);
      handleSend(speechInput);
      setSpeechInput('');
    }
  }, [speechInput, isListening, handleSend, setSpeechInput]);

  if (isLiveClassActive) return <div className="h-full w-full bg-black"><LiveClass systemInstruction={systemInstruction} onEnd={() => setIsLiveClassActive(false)} sessionTitle="VOICE LINK" visualAidPromptGenerator={() => ''} /></div>;

  return (
    <div className="flex flex-col h-[80vh] min-h-[500px] bg-slate-900/80 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 relative">
        {/* Holographic Header */}
        <div className="bg-black/50 p-6 flex items-center justify-between border-b border-white/10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center animate-pulse-slow shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <CpuChipIcon className="h-6 w-6 text-cyan-400"/>
                </div>
                <div>
                    <h3 className="font-black text-lg text-white tracking-widest uppercase font-mono">NEURAL CORE</h3>
                    <p className="text-[10px] text-cyan-500 font-mono">v10.0 • ONLINE</p>
                </div>
            </div>
            <button onClick={() => setIsLiveClassActive(true)} className="p-3 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 rounded-full transition-all text-cyan-300">
                <PhoneIcon className="h-5 w-5"/>
            </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl border backdrop-blur-md ${msg.sender === 'user' ? 'bg-cyan-600/20 border-cyan-500/50 text-cyan-100 rounded-br-none' : 'bg-slate-800/40 border-white/5 text-slate-300 rounded-bl-none'}`}>
                        {msg.filePreview && <img src={msg.filePreview} className="mb-3 rounded-lg max-h-48 border border-white/10" />}
                        <div className="prose prose-invert prose-sm font-mono" dangerouslySetInnerHTML={{ __html: msg.text }} />
                    </div>
                </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-slate-800/40 p-4 rounded-2xl rounded-bl-none border border-white/5"><Loader message="Processing Logic..." /></div></div>}
            <div ref={messagesEndRef} />
        </div>

        {/* Command Input */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-end gap-3 backdrop-blur-xl">
            <button onClick={() => fileInputRef.current?.click()} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400"><PaperClipIcon className="h-5 w-5"/></button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />

            <div className="flex-1 bg-slate-800/50 rounded-2xl flex items-center px-2 border border-white/10 focus-within:border-cyan-500/50 transition-all">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Enter Command..." className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 px-4 py-4 font-mono text-sm focus:ring-0" />
                <button onClick={toggleListening} className={`p-2 rounded-xl ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-white'}`}><MicrophoneIcon className="h-5 w-5"/></button>
            </div>
            
            <button onClick={() => handleSend()} className="p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95">
                <PaperAirplaneIcon className="h-5 w-5"/>
            </button>
        </div>
    </div>
  );
};

export default AiAssistant;
