
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { 
    CpuChipIcon, BoltIcon, WifiIcon, 
    LightBulbIcon, PlayIcon, StopCircleIcon, 
    SpeakerWaveIcon, WrenchScrewdriverIcon,
    ChatBubbleIcon, XCircleIcon, MicrophoneIcon,
    PaperAirplaneIcon, SparklesIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';

interface Component {
    id: string;
    name: string;
    type: 'sensor' | 'actuator' | 'controller';
    icon: React.ReactNode;
}

const COMPONENTS: Component[] = [
    { id: 'arduino', name: 'Arduino (Brain)', type: 'controller', icon: <CpuChipIcon className="h-10 w-10 text-teal-600"/> },
    { id: 'ultrasonic', name: 'Distance Sensor', type: 'sensor', icon: <WifiIcon className="h-8 w-8 text-blue-500"/> },
    { id: 'servo', name: 'Servo Motor', type: 'actuator', icon: <WrenchScrewdriverIcon className="h-8 w-8 text-orange-500"/> },
    { id: 'led', name: 'Smart LED', type: 'actuator', icon: <LightBulbIcon className="h-8 w-8 text-red-500"/> },
];

const AIRoboticsLab: React.FC = () => {
    const toast = useToast();
    const [workspace, setWorkspace] = useState<Component[]>([]);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    
    // AI Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
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
            config: { systemInstruction: "You are a friendly Robotics Expert for kids. Explain electronics, coding, and circuits in simple HINDI (Hinglish). Be encouraging and fun." } 
        });
        setChat(chatInstance);
    }, []);

    // Handle Voice Input
    useEffect(() => {
        if (speechInput && !isListening) {
            if (isChatOpen) {
                handleChatSend(speechInput);
            } else {
                setChatInput(speechInput); // Pre-fill if chat closed
                setIsChatOpen(true);
            }
            setSpeechInput('');
        }
    }, [speechInput, isListening, isChatOpen]);

    const addToWorkspace = (comp: Component) => {
        if (workspace.find(c => c.id === comp.id)) {
            toast.info(`${comp.name} पहले से वर्कस्पेस में है।`);
            return;
        }
        setWorkspace([...workspace, comp]);
    };

    const runSimulation = async () => {
        if (workspace.length < 2) {
            toast.error("कम से कम 2 पार्ट्स जोड़ें (जैसे: Arduino + LED)");
            return;
        }

        setLoading(true);
        stopAudio();
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const partsList = workspace.map(w => w.name).join(' + ');
            
            const prompt = `
                Act as a Robotics Teacher for kids.
                The student has connected these parts: ${partsList}.
                
                Task:
                1. Explain what this circuit will do in VERY SIMPLE HINDI. (e.g. "If you connect distance sensor to light, the light will turn on when someone comes close.")
                2. Explain the logic simply.
                3. Be encouraging.
                
                Format as HTML.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });

            const text = response.text || "सिस्टम एरर।";
            setAnalysis(text);
            playAudio(text, 0);
            toast.success("Simulation Running!");

        } catch (e) {
            toast.error("AI Engineer व्यस्त है।");
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
            const aiText = response.text || "कनेक्शन में समस्या है।";
            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
            playAudio(aiText, messages.length + 1);
        } catch (e) {
            toast.error("AI जवाब नहीं दे पा रहा।");
        } finally {
            setChatLoading(false);
        }
    };

    const clearWorkspace = () => {
        setWorkspace([]);
        setAnalysis('');
        stopAudio();
    };

    return (
        <div className="bg-slate-900 p-6 rounded-[3rem] shadow-2xl h-full flex flex-col min-h-[700px] border-8 border-slate-800 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-teal-500 p-4 rounded-2xl shadow-lg shadow-teal-500/20">
                        <CpuChipIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-white">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Robotics Lab</h2>
                        <p className="text-xs font-mono text-teal-400">v2.0 // BUILD & LEARN</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsChatOpen(true)} className="bg-teal-600 text-white px-6 py-2 rounded-full font-bold text-xs hover:bg-teal-500 shadow-lg flex items-center gap-2 animate-pulse">
                        <ChatBubbleIcon className="h-4 w-4"/> Ask Robo-Guide
                    </button>
                    <button onClick={clearWorkspace} className="text-red-400 font-bold text-xs uppercase tracking-widest hover:text-white border border-red-400/30 px-4 py-2 rounded-full">Reset</button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* Component Shelf */}
                <div className="lg:col-span-3 bg-white/5 rounded-3xl p-6 border border-white/10 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Components Bin</h3>
                    <div className="space-y-4">
                        {COMPONENTS.map(comp => (
                            <button 
                                key={comp.id}
                                onClick={() => addToWorkspace(comp)}
                                className="w-full flex items-center gap-4 p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-teal-500 hover:bg-slate-700 transition-all group"
                            >
                                <div className="p-2 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform">{comp.icon}</div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">{comp.name}</p>
                                    <p className="text-[10px] text-slate-400 uppercase">{comp.type}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Workbench */}
                <div className="lg:col-span-6 flex flex-col">
                    <div className="flex-1 bg-black/40 rounded-[3rem] border-2 border-dashed border-slate-600 relative flex items-center justify-center p-8 transition-all hover:border-teal-500/50">
                        {workspace.length === 0 ? (
                            <div className="text-center opacity-30">
                                <BoltIcon className="h-20 w-20 text-teal-500 mx-auto mb-4"/>
                                <p className="text-white font-hindi text-xl">पार्ट्स को यहाँ जोड़ें</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-8 justify-center items-center">
                                {workspace.map((item, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <div className="bg-slate-800 p-6 rounded-3xl border-2 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)] animate-pop-in text-center">
                                            <div className="mb-2 flex justify-center">{item.icon}</div>
                                            <span className="text-xs font-bold text-white">{item.name}</span>
                                        </div>
                                        {idx < workspace.length - 1 && (
                                            <div className="w-12 h-1 bg-teal-500/50 mx-2 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={runSimulation}
                        disabled={loading}
                        className="mt-6 w-full py-5 bg-teal-600 text-white font-black rounded-3xl shadow-xl hover:bg-teal-500 transition-all flex items-center justify-center gap-3 text-lg active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader message="Compiling Code..." /> : <><PlayIcon className="h-6 w-6"/> RUN SIMULATION</>}
                    </button>
                </div>

                {/* Output Console */}
                <div className="lg:col-span-3 bg-black rounded-3xl border border-green-500/30 p-6 font-mono text-xs text-green-400 overflow-y-auto custom-scrollbar shadow-inner relative">
                    <div className="absolute top-0 left-0 right-0 bg-green-900/20 p-2 text-center text-[10px] font-bold border-b border-green-500/20">SYSTEM LOG</div>
                    <div className="mt-8 space-y-4">
                        {analysis ? (
                            <div className="animate-fade-in space-y-4">
                                <div className="font-hindi text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: analysis }} />
                                <button onClick={() => isSpeaking ? stopAudio() : playAudio(analysis, 0)} className="flex items-center gap-2 text-white bg-green-600/20 px-3 py-1 rounded hover:bg-green-600/40 w-fit">
                                    {isSpeaking ? <StopCircleIcon className="h-4 w-4"/> : <SpeakerWaveIcon className="h-4 w-4"/>} Voice Output
                                </button>
                            </div>
                        ) : (
                            <p className="opacity-50">> Waiting for circuit...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Interactive Chat Overlay */}
            {isChatOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-slate-900 w-full max-w-lg h-[80vh] rounded-[2rem] border-2 border-teal-500/50 shadow-2xl flex flex-col overflow-hidden animate-slide-in-up">
                        <div className="p-4 bg-teal-600 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="h-5 w-5 text-yellow-300"/>
                                <h3 className="font-bold">Robo-Guide Assistant</h3>
                            </div>
                            <button onClick={() => setIsChatOpen(false)}><XCircleIcon className="h-6 w-6 hover:text-red-300"/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 custom-scrollbar">
                            {messages.length === 0 && <p className="text-slate-500 text-center text-sm mt-10">Ask me about sensors, motors, or code!</p>}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-hindi leading-relaxed ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-300 border border-slate-700 rounded-tl-none'}`}>
                                        {msg.text}
                                        {msg.sender === 'ai' && <button onClick={() => playAudio(msg.text, i)} className="ml-2 inline-block"><SpeakerWaveIcon className="h-3 w-3 text-teal-400"/></button>}
                                    </div>
                                </div>
                            ))}
                            {chatLoading && <Loader message="Thinking..." />}
                        </div>

                        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                             <button onClick={toggleListening} className={`p-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                                <MicrophoneIcon className="h-5 w-5"/>
                             </button>
                             <input 
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleChatSend()}
                                placeholder="Type or speak (e.g. Servo kaise kaam karta hai?)..."
                                className="flex-1 bg-slate-800 border-none rounded-xl px-4 text-white focus:ring-1 focus:ring-teal-500 outline-none"
                             />
                             <button onClick={() => handleChatSend()} className="p-3 bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-500">
                                <PaperAirplaneIcon className="h-5 w-5"/>
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIRoboticsLab;
