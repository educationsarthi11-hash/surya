
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { 
    HeartIcon, SparklesIcon, SpeakerWaveIcon, 
    StopCircleIcon, EyeIcon, ChatBubbleIcon,
    XCircleIcon, MicrophoneIcon, PaperAirplaneIcon,
    UserCircleIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';

const BODY_PARTS = [
    { id: 'brain', name: 'Brain', hindi: 'मस्तिष्क (दिमाग)', top: '5%', left: '47%', color: 'bg-pink-400' },
    { id: 'heart', name: 'Heart', hindi: 'हृदय (दिल)', top: '35%', left: '49%', color: 'bg-red-500' },
    { id: 'lungs', name: 'Lungs', hindi: 'फेफड़े', top: '32%', left: '38%', color: 'bg-blue-400' },
    { id: 'stomach', name: 'Stomach', hindi: 'पेट', top: '55%', left: '48%', color: 'bg-orange-500' },
];

const AIAnatomyLab: React.FC = () => {
    const toast = useToast();
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState('');
    
    // Doctor Chat State
    const [isDoctorOpen, setIsDoctorOpen] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    const { playAudio, stopAudio, isSpeaking, isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ 
        enableSpeechRecognition: true, 
        initialLanguage: 'Hindi' 
    });

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({ 
            model: 'gemini-3-flash-preview', 
            config: { systemInstruction: "You are 'Dr. AI', a friendly Anatomy Professor for kids. Explain human body functions in simple HINDI (Hinglish). Be medically accurate but easy to understand." } 
        });
        setChat(chatInstance);
    }, []);

    // Handle Voice Input
    useEffect(() => {
        if (speechInput && !isListening) {
            if (isDoctorOpen) {
                handleChatSend(speechInput);
            } else {
                setChatInput(speechInput);
                setIsDoctorOpen(true);
            }
            setSpeechInput('');
        }
    }, [speechInput, isListening, isDoctorOpen]);

    const handlePartClick = async (part: any) => {
        setSelected(part);
        setLoading(true);
        setInsight('');
        stopAudio();
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Tell a 10-year old Indian kid the 'magic superpower' of the ${part.name} in 2 short Hindi sentences. Hinglish is fine. Focus on how it keeps us alive.`;
            const response = await ai.models.generateContent({ 
                model: 'gemini-3-flash-preview', 
                contents: prompt 
            });
            const text = response.text || "यह शरीर का बहुत महत्वपूर्ण हिस्सा है।";
            setInsight(text);
            playAudio(text, 0);
        } catch (e) { 
            toast.error("AI गुरु अभी व्यस्त हैं, कृपया दोबारा कोशिश करें।"); 
            setSelected(null);
        } finally { 
            setLoading(false); 
        }
    };

    const handleChatSend = async (textOverride?: string) => {
        const text = textOverride || chatInput;
        if (!text.trim() || !chat) return;
        
        setChatInput('');
        setMessages(prev => [...prev, { sender: 'user', text }]);
        setChatLoading(true);
        stopAudio();

        try {
            const response = await chat.sendMessage({ message: text });
            const aiText = response.text || "डॉक्टर AI व्यस्त हैं।";
            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
            playAudio(aiText, messages.length + 1);
        } catch (e) {
            toast.error("संपर्क टूट गया।");
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 p-6 rounded-[3rem] shadow-2xl h-full flex flex-col min-h-[700px] border-8 border-slate-800 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:30px_30px]"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-10 z-10 p-2">
                <div className="flex items-center gap-4">
                    <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg animate-pulse"><HeartIcon className="h-10 w-10" /></div>
                    <div><h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">आभासी शरीर विज्ञान</h2><p className="text-sm text-red-400 font-hindi font-bold mt-1 tracking-widest uppercase">मानव शरीर की जादुई यात्रा</p></div>
                </div>
                <button onClick={() => setIsDoctorOpen(true)} className="bg-white text-red-600 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-red-50 transition-all">
                    <UserCircleIcon className="h-5 w-5"/> Ask Doctor AI
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 overflow-hidden">
                <div className="lg:col-span-7 bg-black/50 rounded-[4rem] border-2 border-white/5 relative flex items-center justify-center overflow-hidden shadow-inner group">
                    <div className="relative w-60 h-[500px] border-4 border-white/5 rounded-full opacity-40">
                         <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-64 rounded-full border-2 border-white/10"></div>
                    </div>
                    {BODY_PARTS.map(part => (
                        <button 
                            key={part.id} 
                            onClick={() => handlePartClick(part)} 
                            className={`absolute w-14 h-14 rounded-full ${part.color} shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-125 hover:z-20 ring-4 ring-white/10 flex items-center justify-center group/part overflow-hidden`} 
                            style={{ top: part.top, left: part.left }}
                        >
                             <div className="absolute inset-0 bg-white/20 animate-ping opacity-0 group-hover/part:opacity-100"></div>
                             <SparklesIcon className="h-6 w-6 text-white m-auto relative z-10" />
                        </button>
                    ))}
                    <div className="absolute bottom-8 left-8 bg-green-500/10 p-4 rounded-2xl border border-green-500/20 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <p className="text-green-400 font-mono text-[10px] font-black uppercase tracking-widest">Vital Signs: Optimal</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col h-full">
                    <div className="p-8 bg-white rounded-[3rem] h-full flex flex-col shadow-2xl relative overflow-hidden border border-white/20">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl tracking-tight uppercase"><EyeIcon className="h-7 w-7 text-red-600"/> AI डॉक्टर विश्लेषण</h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                                    <Loader message="शरीर के अंगों की जांच जारी है..." />
                                </div>
                            ) : selected ? (
                                <div className="animate-pop-in space-y-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] ml-1">Organ in Focus</span>
                                        <h4 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{selected.hindi}</h4>
                                    </div>
                                    <div className="p-8 bg-red-50 border-2 border-red-100 rounded-[2.5rem] shadow-inner relative">
                                        <div className="absolute -top-3 -left-3 bg-red-600 text-white p-2 rounded-xl shadow-lg rotate-[-12deg]"><SparklesIcon className="h-5 w-5"/></div>
                                        <p className="text-2xl font-hindi text-slate-800 leading-relaxed font-medium italic">"{insight}"</p>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                         <button onClick={() => playAudio(insight, 0)} className="flex-1 py-5 bg-slate-950 text-white font-black rounded-3xl shadow-xl flex items-center justify-center gap-3 transform active:scale-95 transition-all">
                                            <SpeakerWaveIcon className="h-6 w-6"/> फिर से सुनें
                                        </button>
                                         <button onClick={() => stopAudio()} className={`p-5 rounded-3xl transition-all shadow-md ${isSpeaking ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                                            <StopCircleIcon className="h-7 w-7"/>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 border border-slate-100">
                                        <SparklesIcon className="h-12 w-12 text-slate-200 animate-spin-slow" />
                                    </div>
                                    <p className="font-hindi font-black text-slate-400 text-2xl leading-snug">शरीर के किसी भी हिस्से पर क्लिक करें और उसकी जादुई शक्ति जानें!</p>
                                    <div className="mt-6 flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-200"></div>
                                        <div className="w-2 h-2 rounded-full bg-red-200"></div>
                                        <div className="w-2 h-2 rounded-full bg-red-200"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                            <span>Virtual Anatomy Lab v2.2</span>
                            <span className="text-red-400">Education Sarthi Smart OS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dr. AI Chat Overlay */}
            {isDoctorOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg h-[80vh] rounded-[2.5rem] border-4 border-red-500 shadow-2xl flex flex-col overflow-hidden animate-slide-in-up">
                        <div className="p-4 bg-red-600 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <UserCircleIcon className="h-6 w-6 text-white"/>
                                <div>
                                    <h3 className="font-bold">Dr. AI</h3>
                                    <p className="text-[10px] text-red-200 uppercase tracking-widest">Medical Guide</p>
                                </div>
                            </div>
                            <button onClick={() => {setIsDoctorOpen(false); stopAudio();}} className="p-2 hover:bg-white/10 rounded-full"><XCircleIcon className="h-6 w-6"/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-red-50 custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="text-center text-red-300 mt-20">
                                    <HeartIcon className="h-16 w-16 mx-auto mb-4"/>
                                    <p className="font-hindi text-red-400 font-bold">शरीर या सेहत के बारे में कुछ भी पूछें...</p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-hindi leading-relaxed border shadow-sm ${msg.sender === 'user' ? 'bg-red-600 text-white border-red-600 rounded-tr-none' : 'bg-white text-slate-800 border-red-100 rounded-tl-none'}`}>
                                        {msg.text}
                                        {msg.sender === 'ai' && <button onClick={() => playAudio(msg.text, i)} className="ml-2 inline-block"><SpeakerWaveIcon className="h-3 w-3 text-red-400"/></button>}
                                    </div>
                                </div>
                            ))}
                            {chatLoading && <Loader message="डॉक्टर साहब सोच रहे हैं..." />}
                        </div>

                        <div className="p-4 border-t border-red-100 bg-white flex gap-2 items-center">
                             <button onClick={toggleListening} className={`p-3 rounded-full transition-all border border-red-100 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-red-400 hover:text-red-600'}`}><MicrophoneIcon className="h-5 w-5"/></button>
                             <input 
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleChatSend()}
                                placeholder="जैसे: बुखार क्यों आता है?" 
                                className="flex-1 p-3 bg-red-50 rounded-full font-hindi text-sm border-none focus:ring-2 focus:ring-red-500 text-slate-800 outline-none"
                             />
                             <button onClick={() => handleChatSend()} className="p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-500"><PaperAirplaneIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAnatomyLab;
