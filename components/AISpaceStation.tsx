
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { 
    GlobeAltIcon, SparklesIcon, MoonIcon, 
    RocketLaunchIcon, StarIcon, ArrowRightIcon,
    SpeakerWaveIcon, StopCircleIcon, ChatBubbleIcon,
    MicrophoneIcon, PaperAirplaneIcon, XCircleIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { generateImageForTopic } from '../services/geminiService';
import { useSpeech } from '../hooks/useSpeech';

const BODIES = [
    { id: 'moon', name: 'Moon (चांद)', type: 'Satellite' },
    { id: 'mars', name: 'Mars (मंगल)', type: 'Planet' },
    { id: 'isro', name: 'Chandrayaan-3', type: 'Mission' },
    { id: 'blackhole', name: 'Black Hole', type: 'Phenomenon' },
    { id: 'sun', name: 'Sun (सूर्य)', type: 'Star' }
];

const AISpaceStation: React.FC = () => {
    const toast = useToast();
    const [selectedBody, setSelectedBody] = useState<any>(null);
    const [info, setInfo] = useState<any>(null);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // AI Chat State
    const [isCommsOpen, setIsCommsOpen] = useState(false);
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
            config: { systemInstruction: "You are an AI Astronaut on a Space Station. Answer questions about space, planets, and the universe in simple HINDI (Hinglish). Be scientific but fun for students." } 
        });
        setChat(chatInstance);
    }, []);

    // Handle Voice Input
    useEffect(() => {
        if (speechInput && !isListening) {
            if (isCommsOpen) {
                handleChatSend(speechInput);
            } else {
                setChatInput(speechInput);
                setIsCommsOpen(true);
            }
            setSpeechInput('');
        }
    }, [speechInput, isListening, isCommsOpen]);

    const handleExplore = async (body: any) => {
        setSelectedBody(body);
        setLoading(true);
        setImage(null);
        setInfo(null);
        stopAudio();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Parallel requests for Speed
            const textPromise = ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Explain "${body.name}" to an Indian student in simple Hindi. 
                If it's ISRO mission, praise India. 
                Return JSON: { "fact": "Amazing one line fact", "details": "3 sentence explanation in Hindi", "distance": "Distance from Earth" }`,
                config: { responseMimeType: 'application/json' }
            });

            const imagePromise = generateImageForTopic(`Realistic cinematic photo of ${body.name} in space, high quality, 8k resolution, educational.`);

            const [textRes, imgRes] = await Promise.all([textPromise, imagePromise]);
            
            const data = JSON.parse(textRes.text || '{}');
            setInfo(data);
            setImage(imgRes);
            playAudio(data.details, 0);

        } catch (e) {
            toast.error("Communication with Satellite Failed.");
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
            const aiText = response.text || "संपर्क टूट गया।";
            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
            playAudio(aiText, messages.length + 1);
        } catch (e) {
            toast.error("सैटेलाइट सिग्नल कमजोर है।");
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="bg-black p-4 sm:p-8 rounded-[3.5rem] shadow-2xl h-full flex flex-col min-h-[750px] border-4 border-slate-800 relative overflow-hidden text-white font-sans">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
             
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative z-10 p-4 gap-4">
                 <div className="flex items-center gap-4">
                     <div className="bg-purple-600 p-4 rounded-full shadow-[0_0_50px_rgba(147,51,234,0.5)] animate-spin-slow">
                         <GlobeAltIcon className="h-10 w-10 text-white"/>
                     </div>
                     <div>
                         <h2 className="text-4xl font-black uppercase tracking-tighter">Space Station</h2>
                         <p className="text-sm text-purple-400 font-bold uppercase tracking-widest">ISRO & NASA Data Feed</p>
                     </div>
                 </div>
                 <button onClick={() => setIsCommsOpen(true)} className="bg-purple-500/20 border border-purple-500 text-purple-300 px-6 py-3 rounded-full flex items-center gap-3 hover:bg-purple-500 hover:text-white transition-all shadow-lg animate-pulse">
                     <ChatBubbleIcon className="h-5 w-5"/> Open Cosmic Comms
                 </button>
             </div>

             <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                 {/* Navigation Deck */}
                 <div className="lg:col-span-3 space-y-3">
                     {BODIES.map(body => (
                         <button 
                            key={body.id}
                            onClick={() => handleExplore(body)}
                            className={`w-full p-4 rounded-2xl border flex items-center justify-between group transition-all ${selectedBody?.id === body.id ? 'bg-purple-600 border-purple-500 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                         >
                             <div className="flex items-center gap-3">
                                 {body.type === 'Mission' ? <RocketLaunchIcon className="h-5 w-5"/> : <MoonIcon className="h-5 w-5"/>}
                                 <span className="font-bold text-sm">{body.name}</span>
                             </div>
                             <ArrowRightIcon className={`h-4 w-4 transition-transform ${selectedBody?.id === body.id ? 'rotate-0' : '-rotate-45 opacity-0 group-hover:opacity-100'}`} />
                         </button>
                     ))}
                     
                     <div className="mt-8 p-6 bg-slate-900 rounded-3xl border border-slate-800 text-center">
                         <StarIcon className="h-12 w-12 text-yellow-400 mx-auto mb-2 animate-pulse"/>
                         <p className="text-[10px] uppercase font-black text-slate-500">Live Star Count</p>
                         <p className="text-2xl font-mono text-white">400 Billion+</p>
                     </div>
                 </div>

                 {/* Main Viewport */}
                 <div className="lg:col-span-9 bg-slate-900 rounded-[3rem] border border-white/10 relative overflow-hidden flex flex-col">
                     {loading ? (
                         <div className="flex-1 flex flex-col items-center justify-center">
                             <Loader message="Telescope aligning..." />
                             <p className="text-xs text-purple-400 mt-4 uppercase tracking-widest animate-pulse">Receiving Data...</p>
                         </div>
                     ) : selectedBody && info ? (
                         <div className="flex-1 flex flex-col lg:flex-row h-full">
                             {/* Image Side */}
                             <div className="lg:w-1/2 relative bg-black">
                                 {image ? (
                                     <img src={image} className="w-full h-full object-cover opacity-90" alt="Space" />
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center bg-slate-800"><SparklesIcon className="h-20 w-20 text-white/20"/></div>
                                 )}
                                 <div className="absolute bottom-6 left-6">
                                     <h3 className="text-4xl font-black uppercase tracking-tighter drop-shadow-lg">{selectedBody.name}</h3>
                                     <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{selectedBody.type}</span>
                                 </div>
                             </div>
                             
                             {/* Info Side */}
                             <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-slate-900/90 backdrop-blur-xl">
                                 <div className="mb-8">
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Distance from Earth</p>
                                     <p className="text-2xl font-mono text-yellow-400">{info.distance}</p>
                                 </div>
                                 
                                 <div className="space-y-6">
                                     <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                                         <p className="text-sm font-hindi leading-relaxed text-purple-200">"{info.fact}"</p>
                                     </div>
                                     <p className="text-lg font-hindi text-slate-300 leading-relaxed font-medium">{info.details}</p>
                                 </div>

                                 <button onClick={() => isSpeaking ? stopAudio() : playAudio(info.details, 0)} className="mt-10 w-full py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-purple-400 hover:text-white transition-all flex items-center justify-center gap-3">
                                     {isSpeaking ? <StopCircleIcon className="h-5 w-5"/> : <SpeakerWaveIcon className="h-5 w-5"/>} Audio Guide
                                 </button>
                             </div>
                         </div>
                     ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                             <RocketLaunchIcon className="h-32 w-32 mb-6 opacity-20"/>
                             <p className="text-xl font-black uppercase tracking-widest">Select a destination</p>
                         </div>
                     )}
                 </div>
             </div>

             {/* Cosmic Comms Chat Overlay */}
             {isCommsOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-fade-in backdrop-blur-md">
                    <div className="bg-black w-full max-w-lg h-[80vh] rounded-[2rem] border border-purple-500/50 shadow-2xl shadow-purple-900/50 flex flex-col overflow-hidden animate-slide-in-up">
                        <div className="p-4 bg-purple-900/50 flex justify-between items-center text-white border-b border-purple-500/30">
                            <div className="flex items-center gap-3">
                                <RocketLaunchIcon className="h-6 w-6 text-purple-300"/>
                                <div>
                                    <h3 className="font-bold">Cosmic Comms</h3>
                                    <p className="text-[10px] text-purple-300 uppercase tracking-widest">Live with AI Astronaut</p>
                                </div>
                            </div>
                            <button onClick={() => {setIsCommsOpen(false); stopAudio();}} className="p-2 hover:bg-white/10 rounded-full"><XCircleIcon className="h-6 w-6 text-purple-300"/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/90 custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="text-center text-purple-400/50 mt-20">
                                    <GlobeAltIcon className="h-16 w-16 mx-auto mb-4"/>
                                    <p>ब्रह्मांड के बारे में कुछ भी पूछें...</p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-hindi leading-relaxed border ${msg.sender === 'user' ? 'bg-purple-600 text-white border-purple-500 rounded-tr-none' : 'bg-slate-900 text-slate-300 border-slate-700 rounded-tl-none'}`}>
                                        {msg.text}
                                        {msg.sender === 'ai' && <button onClick={() => playAudio(msg.text, i)} className="ml-2 inline-block"><SpeakerWaveIcon className="h-3 w-3 text-purple-400"/></button>}
                                    </div>
                                </div>
                            ))}
                            {chatLoading && <Loader message="Transmission incoming..." />}
                        </div>

                        <div className="p-4 border-t border-purple-500/30 bg-black flex gap-2 items-center">
                             <button onClick={toggleListening} className={`p-3 rounded-full transition-all border border-purple-500/50 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-purple-400 hover:text-white'}`}><MicrophoneIcon className="h-5 w-5"/></button>
                             <input 
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleChatSend()}
                                placeholder="Type your cosmic question..." 
                                className="flex-1 p-3 bg-slate-900 rounded-full font-hindi text-sm border border-purple-500/30 focus:border-purple-500 text-white outline-none"
                             />
                             <button onClick={() => handleChatSend()} className="p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-500"><PaperAirplaneIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISpaceStation;
