
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { ChatMessage } from '../types';
import Loader from './Loader';
import { fileToBase64 } from '../services/geminiService';
import { 
    WrenchScrewdriverIcon, SparklesIcon, PaperClipIcon, 
    PaperAirplaneIcon, MicrophoneIcon, SpeakerWaveIcon, 
    PlayIcon, BoltIcon, StopCircleIcon, AcademicCapIcon,
    CameraIcon, FaceSmileIcon, XCircleIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useSpeech } from '../hooks/useSpeech';

const ITIGuru: React.FC<{ setActiveService: (s: any) => void }> = ({ setActiveService }) => {
    const toast = useToast();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    
    const { playAudio, stopAudio, isListening, speechInput, setSpeechInput, toggleListening, isSpeaking, playingMessageIndex } = useSpeech({ 
        initialVoice: 'Puck', 
        enableSpeechRecognition: true,
        initialLanguage: 'Hindi'
    });

    const systemInstruction = `आप 'मंगमत ITI उस्ताद' हैं। 
    आपकी सबसे बड़ी खूबी यह है कि आप छात्र की भाषा (हिंदी, हरियाणवी, पंजाबी या इंग्लिश) को तुरंत समझ लेते हैं।
    
    नियम:
    1. अगर छात्र अपनी देसी बोली (जैसे हरियाणवी) में पूछे, तो आप भी उसी अपनेपन के साथ जवाब दें।
    2. कठिन तकनीकी शब्दों को 'देसी उदाहरणों' से समझाएं।
    3. छात्र को मशीन की फोटो दिखाने या बोलकर सवाल पूछने के लिए प्रोत्साहित करें।
    4. हर जवाब के अंत में 'बेटा' या 'लाडले' का प्रयोग करें।
    5. HTML टैग्स (<b>, <ul>) का उपयोग करें ताकि जानकारी साफ़ दिखे।`;

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({ 
            model: 'gemini-3-pro-preview', 
            config: { systemInstruction } 
        });
        setChat(chatInstance);
        setMessages([{ sender: 'ai', text: `राम-राम लाडले! मैं हूँ थारा अपना ITI उस्ताद। <br/> तू बोल के पूछ या लिख के, मैं तन्ने हर मशीन का राज समझा दूँगा। कोई औजार समझ ना आवे तो उसकी फोटो खींच के भेज दे। बता, आज के सीखना सै?` }]);
    }, []);

    const handleSend = useCallback(async (textOverride?: string) => {
        const text = textOverride || input.trim();
        if ((!text && !attachedFile) || !chat || loading) return;
        
        setInput(''); 
        const currentFile = attachedFile;
        const currentPreview = filePreview;
        setAttachedFile(null); 
        setFilePreview(null);

        setMessages(prev => [...prev, { 
            sender: 'user', 
            text: text || "इस फोटो के बारे में बताओ उस्ताद जी",
            filePreview: currentPreview || undefined 
        }]);
        setLoading(true);
        stopAudio();

        try {
             const parts: Part[] = [];
             if (text) parts.push({ text });
             if (currentFile) {
                 const b64 = await fileToBase64(currentFile);
                 parts.push({ inlineData: { data: b64, mimeType: currentFile.type } });
             }
             const response = await chat.sendMessage({ message: parts });
             const aiText = response.text || "बेटा, एक बार फिर बोल, समझ नहीं आया।";
             setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
             playAudio(aiText, messages.length + 1);
        } catch(e) { 
            toast.error("नेटवर्क धीमा है, फिर कोशिश करें।");
        } finally { 
            setLoading(false); 
        }
    }, [input, attachedFile, filePreview, chat, messages, playAudio, stopAudio, toast]);

    useEffect(() => {
        if (speechInput && !isListening) {
            handleSend(speechInput);
            setSpeechInput('');
        }
    }, [speechInput, isListening, handleSend, setSpeechInput]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setAttachedFile(e.target.files[0]);
            setFilePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative font-sans">
            {/* Tech Header */}
            <div className="bg-slate-900 p-5 flex items-center justify-between text-white z-20 shadow-xl border-b border-orange-500/30">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg animate-pulse">
                        <FaceSmileIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl tracking-tight uppercase leading-none">Smart ITI उस्ताद</h3>
                        <p className="text-[10px] uppercase font-bold text-orange-400 mt-1 tracking-widest">हर भाषा, हर बोली का सपोर्ट</p>
                    </div>
                </div>
                <button onClick={() => setActiveService('AI Machine Workshop')} className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all">
                    <PlayIcon className="h-4 w-4" /> Workshop Mode
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}>
                        <div className={`relative max-w-[85%] p-5 rounded-[2.5rem] shadow-xl ${msg.sender === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                             {msg.filePreview && <img src={msg.filePreview} className="mb-4 rounded-2xl max-h-64 w-full object-cover border-4 border-white/20 shadow-lg" />}
                             <div className="prose prose-sm leading-relaxed font-hindi font-medium text-lg" dangerouslySetInnerHTML={{ __html: msg.text }} />
                             {msg.sender === 'ai' && (
                                 <button 
                                    onClick={() => playingMessageIndex === i ? stopAudio() : playAudio(msg.text, i)} 
                                    className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${playingMessageIndex === i ? 'bg-red-500 text-white' : 'bg-slate-100 text-orange-600 hover:bg-orange-50'}`}
                                 >
                                     {playingMessageIndex === i ? <StopCircleIcon className="h-4 w-4"/> : <SpeakerWaveIcon className="h-4 w-4"/>} 
                                     {playingMessageIndex === i ? 'रुकें' : 'सुनें (Listen)'}
                                 </button>
                             )}
                        </div>
                    </div>
                ))}
                {loading && <div className="flex justify-start"><div className="bg-white p-4 rounded-2xl shadow-sm border animate-pulse"><Loader message="उस्ताद जी सुन रहे हैं..." /></div></div>}
                <div ref={messagesEndRef} />
            </div>

            {/* Interaction Bar */}
            <div className="p-5 bg-white border-t border-slate-200 flex items-center gap-3 z-30">
                {filePreview && (
                    <div className="absolute bottom-24 left-6 p-2 bg-white rounded-2xl shadow-2xl border-2 border-orange-500 animate-bounce">
                        <img src={filePreview} className="w-20 h-20 object-cover rounded-xl" />
                        <button onClick={() => {setAttachedFile(null); setFilePreview(null);}} className="absolute -top-2 -right-2 bg-red-50 text-white rounded-full p-1"><XCircleIcon className="h-4 w-4"/></button>
                    </div>
                )}
                
                <div className="flex-1 bg-slate-100 rounded-[2.5rem] flex items-center px-4 py-1 border-2 border-transparent focus-within:border-orange-500 transition-all shadow-inner">
                    <button onClick={toggleListening} className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-bounce' : 'text-slate-400 hover:text-orange-500'}`}>
                        <MicrophoneIcon className="h-7 w-7" />
                    </button>
                    <input 
                        type="text" 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' && handleSend()} 
                        placeholder={isListening ? "मैं सुन रहा हूँ, बोलिये..." : "लिखें या पूछें (जैसे: मोटर क्या है?)"} 
                        className="flex-1 p-4 bg-transparent border-none focus:ring-0 font-bold font-hindi text-lg text-slate-700" 
                    />
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-orange-500 transition-colors">
                        <CameraIcon className="h-6 w-6" />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />
                </div>
                <button onClick={() => handleSend()} className="p-5 bg-orange-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    <PaperAirplaneIcon className="h-8 w-8"/>
                </button>
            </div>
        </div>
    );
};

export default ITIGuru;
