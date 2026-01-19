
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { 
    WrenchScrewdriverIcon, SparklesIcon, ArrowPathIcon, 
    SpeakerWaveIcon, StopCircleIcon, Cog6ToothIcon, 
    PlayIcon, BoltIcon, CheckCircleIcon, AcademicCapIcon,
    ExclamationTriangleIcon, ChatBubbleIcon,
    XCircleIcon, MicrophoneIcon, PaperAirplaneIcon,
    FaceSmileIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';

interface MotorPart {
    id: string;
    name: string;
    hindi: string;
    info: string;
    order: number;
    top: string;
    left: string;
    color: string;
}

const MOTOR_PARTS: MotorPart[] = [
    { id: 'stator', name: 'Stator', hindi: 'स्टेटर (बाहरी हिस्सा)', info: 'बेटा, स्टेटर मोटर का वह हिस्सा है जो स्थिर रहता है और चुंबकीय क्षेत्र (Magnetic Field) पैदा करता है।', order: 1, top: '15%', left: '42%', color: 'bg-slate-700' },
    { id: 'rotor', name: 'Rotor', hindi: 'रोटर (घूमने वाला भाग)', info: 'शाबाश! रोटर मुख्य घूमने वाला हिस्सा है। चुंबकीय बल इसे तेजी से घुमाता है।', order: 2, top: '40%', left: '42%', color: 'bg-orange-400' },
    { id: 'commutator', name: 'Commutator', hindi: 'कम्यूटेटर', info: 'यह करंट की दिशा बदलता है ताकि मोटर एक ही दिशा में घूमती रहे।', order: 3, top: '55%', left: '46%', color: 'bg-amber-600' },
    { id: 'brushes', name: 'Carbon Brushes', hindi: 'कार्बन ब्रश', info: 'ब्रश बिजली को बाहरी सर्किट से घूमते हुए रोटर तक पहुँचाते हैं।', order: 4, top: '65%', left: '46%', color: 'bg-black' },
];

const AIMachineWorkshop: React.FC = () => {
    const toast = useToast();
    const [selected, setSelected] = useState<MotorPart | null>(null);
    const [assembled, setAssembled] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [advice, setAdvice] = useState('');
    const [isEngineOn, setIsEngineOn] = useState(false);
    
    // Help Assistant State
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [helpInput, setHelpInput] = useState('');
    const [helpMessages, setHelpMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
    const [helpLoading, setHelpLoading] = useState(false);

    const { playAudio, stopAudio, isSpeaking, isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ initialLanguage: 'Hindi' });

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({ 
            model: 'gemini-3-flash-preview',
            config: { systemInstruction: "आप वर्कशॉप में बैठे एक उस्ताद हैं। छात्र को मोटर असेंबली में मदद करें। आसान हिंदी/हरियाणवी का प्रयोग करें।" }
        });
        setChat(chatInstance);
    }, []);

    useEffect(() => {
        if (speechInput && !isListening && isHelpOpen) {
            handleAskAI(speechInput);
            setSpeechInput('');
        }
    }, [speechInput, isListening, isHelpOpen]);

    const handleAskAI = async (textOverride?: string) => {
        const text = textOverride || helpInput;
        if (!text.trim() || !chat) return;
        setHelpInput('');
        setHelpMessages(prev => [...prev, { sender: 'user', text }]);
        setHelpLoading(true);
        try {
            const response = await chat.sendMessage({ message: text });
            const aiResponse = response.text || "बेटा, समझ नहीं आया, दोबारा पूछो।";
            setHelpMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
            playAudio(aiResponse, helpMessages.length + 1);
        } catch (e) {
            toast.error("AI सर्वर व्यस्त है।");
        } finally {
            setLoading(false);
        }
    };

    const handlePick = (part: MotorPart) => {
        if (assembled.includes(part.id)) return;
        setSelected(part);
        toast.info(`${part.hindi} उठा लिया। अब सही जगह फिट करो।`);
    };

    const handleFit = async (partId: string) => {
        if (!selected || selected.id !== partId) {
            toast.error("गलत जगह! पार्ट्स को ध्यान से देखें।"); 
            return;
        }
        setAssembled(prev => [...prev, partId]);
        setAdvice(selected.info);
        playAudio(selected.info, 0);
        setSelected(null);
    };

    return (
        <div className="bg-slate-950 p-4 sm:p-8 rounded-[3.5rem] shadow-2xl h-full flex flex-col min-h-[850px] border-8 border-slate-900 text-white font-sans overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:25px_25px] pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 z-10 px-4 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-600 p-4 rounded-[1.5rem] shadow-xl shadow-orange-600/20 border-2 border-orange-400/30">
                        <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Smart Workshop</h2>
                        <p className="text-[10px] text-orange-400 font-hindi mt-1 tracking-widest uppercase font-black">Interactive Motor Lab</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setIsHelpOpen(true)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center gap-3 shadow-xl hover:bg-indigo-500 transition-all animate-bounce"
                     >
                        <ChatBubbleIcon className="h-5 w-5"/> उस्ताद जी से पूछें (Ask AI)
                     </button>
                     <button onClick={() => { setAssembled([]); setIsEngineOn(false); setAdvice(''); stopAudio(); }} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 text-orange-400 border border-white/5 shadow-inner">
                        <ArrowPathIcon className="h-6 w-6"/>
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 overflow-hidden">
                {/* 1. Tray */}
                <div className="lg:col-span-3 space-y-3 overflow-y-auto pr-2 custom-scrollbar bg-white/5 p-6 rounded-[3rem] border border-white/5">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Parts Tray</p>
                     {MOTOR_PARTS.map(p => {
                         const isDone = assembled.includes(p.id);
                         return (
                             <button 
                                key={p.id} 
                                onClick={() => handlePick(p)} 
                                disabled={isDone} 
                                className={`w-full p-4 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 ${selected?.id === p.id ? 'border-orange-500 bg-orange-500/20 shadow-lg scale-[1.02]' : isDone ? 'border-green-500/30 bg-green-500/10 opacity-40' : 'bg-slate-800/50 border-transparent hover:bg-slate-800'}`}
                             >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.color} ${isDone ? 'grayscale' : 'shadow-lg shadow-black/20'}`}>
                                    {isDone ? <CheckCircleIcon className="h-6 w-6 text-white" /> : <BoltIcon className="h-6 w-6 text-white" />}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <span className="block font-black text-[10px] uppercase tracking-wider truncate">{p.hindi}</span>
                                    <span className={`text-[8px] font-bold uppercase ${isDone ? 'text-green-400' : 'text-slate-500'}`}>{isDone ? 'Fitted' : 'Ready'}</span>
                                </div>
                             </button>
                         );
                     })}
                </div>

                {/* 2. Workbench */}
                <div className="lg:col-span-6 bg-black/60 rounded-[4rem] border-2 border-white/5 relative flex items-center justify-center overflow-hidden shadow-inner group">
                     <div className="w-80 h-[550px] border-4 border-slate-700/50 rounded-[4rem] relative bg-slate-900/40 backdrop-blur-md shadow-2xl flex flex-col items-center py-10">
                        {MOTOR_PARTS.map(p => {
                            const isDone = assembled.includes(p.id);
                            const isTarget = selected?.id === p.id;
                            return (
                                <div 
                                    key={p.id} 
                                    onClick={() => isTarget && handleFit(p.id)} 
                                    className={`absolute flex items-center justify-center transition-all duration-700 ${isDone ? 'opacity-100 scale-110 translate-y-0' : isTarget ? 'opacity-100 scale-100 ring-4 ring-orange-500 animate-bounce cursor-pointer' : 'opacity-20 translate-y-4 border-2 border-dashed border-slate-600 rounded-[2rem] bg-slate-700/10'}`} 
                                    style={{ top: p.top, left: p.left, width: '100px', height: '100px' }}
                                >
                                    {isDone ? (
                                        <div className={`p-4 rounded-3xl shadow-2xl ${p.color} border-2 border-white/10 flex flex-col items-center justify-center ${isEngineOn && p.id === 'rotor' ? 'animate-[spin_0.2s_linear_infinite]' : ''}`}>
                                            <WrenchScrewdriverIcon className="h-8 w-8 text-white/50" />
                                            <span className="text-[8px] font-black text-white/80 mt-1 uppercase">{p.name}</span>
                                        </div>
                                    ) : (
                                        <div className="text-center"><span className="text-[8px] font-black opacity-30 text-white uppercase tracking-tighter">{isTarget ? 'Click to Fit' : 'Slot ' + p.order}</span></div>
                                    )}
                                </div>
                            );
                        })}
                     </div>
                     <div className="absolute bottom-10 flex flex-col items-center gap-4 z-20">
                        {assembled.length === MOTOR_PARTS.length && (
                            <button onClick={() => setIsEngineOn(!isEngineOn)} className={`px-12 py-5 rounded-[2.5rem] font-black text-lg flex items-center gap-4 transition-all transform active:scale-95 shadow-2xl ${isEngineOn ? 'bg-red-600' : 'bg-green-600'}`}>{isEngineOn ? 'STOP MOTOR' : 'TEST MOTOR'}</button>
                        )}
                        {selected && <div className="bg-orange-600 text-white px-8 py-3 rounded-full text-[10px] font-black shadow-2xl animate-bounce border-2 border-white/20 uppercase">⬇️ नीले स्लॉट (Slot) में फिट करें</div>}
                     </div>
                </div>

                {/* 3. AI Sidebar */}
                <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 p-8 bg-slate-900 border border-white/10 rounded-[3.5rem] h-full flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-lg">
                        <h3 className="font-black mb-6 flex items-center gap-3 text-indigo-400 uppercase tracking-tighter text-lg border-b border-white/5 pb-4 relative z-10"><SparklesIcon className="h-6 w-6"/> AI उस्ताद रिपोर्ट</h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                            {advice ? (
                                <div className="animate-pop-in space-y-6">
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] shadow-inner"><p className="text-xl font-hindi text-slate-100 leading-relaxed font-medium italic">"{advice}"</p></div>
                                    <button onClick={() => playAudio(advice, 0)} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-xl transform active:scale-95 transition-all">{isSpeaking ? <StopCircleIcon className="h-6 w-6 animate-pulse"/> : <SpeakerWaveIcon className="h-6 w-6"/>} दोबारा सुनें</button>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-20 h-full text-center px-6"><AcademicCapIcon className="h-10 w-10 text-slate-400 mb-4" /><p className="text-[10px] font-black uppercase tracking-[0.3em] font-hindi text-slate-400">असेंबली शुरू करें। <br/> उस्ताद हर स्टेप पर समझाएंगे।</p></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Help Drawer */}
            {isHelpOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-end justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg h-[80vh] rounded-t-[3rem] overflow-hidden flex flex-col shadow-2xl border-x-4 border-t-4 border-indigo-600 animate-slide-in-up text-slate-900">
                        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FaceSmileIcon className="h-8 w-8" />
                                <h3 className="font-black text-lg uppercase">Workplace Assistant</h3>
                            </div>
                            <button onClick={() => {setIsHelpOpen(false); stopAudio();}} className="p-2 hover:bg-white/10 rounded-full"><XCircleIcon className="h-8 w-8"/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 custom-scrollbar">
                            {helpMessages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-hindi leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'}`}>
                                        {m.text}
                                        {m.sender === 'ai' && <button onClick={() => playAudio(m.text, i)} className="ml-2 inline-block"><SpeakerWaveIcon className="h-4 w-4 text-indigo-600"/></button>}
                                    </div>
                                </div>
                            ))}
                            {helpLoading && <Loader message="उस्ताद जी विचार कर रहे हैं..." />}
                        </div>

                        <div className="p-4 border-t bg-white flex gap-2 items-center">
                             <button onClick={toggleListening} className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}><MicrophoneIcon className="h-6 w-6"/></button>
                             <input 
                                value={helpInput}
                                onChange={e => setHelpInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleAskAI()}
                                placeholder="अपनी भाषा में सवाल पूछें..." 
                                className="flex-1 p-4 bg-slate-100 rounded-full font-hindi text-sm border-none focus:ring-2 focus:ring-indigo-600"
                             />
                             <button onClick={() => handleAskAI()} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg"><PaperAirplaneIcon className="h-6 w-6"/></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIMachineWorkshop;
