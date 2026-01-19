
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { WrenchScrewdriverIcon, SparklesIcon, CameraIcon, PaperAirplaneIcon, StopCircleIcon, SpeakerWaveIcon, ShieldCheckIcon, PhotoIcon, XCircleIcon, MicrophoneIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useSpeech } from '../hooks/useSpeech';
import { fileToBase64 } from '../services/geminiService';
import Loader from './Loader';
import { useClassroom } from '../contexts/ClassroomContext';

interface SkillScenario {
    id: string;
    trade: string;
    task: string;
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

const mockScenarios: SkillScenario[] = [
    { id: '1', trade: 'Electrician', task: 'Check why a ceiling fan is humming but not rotating.', difficulty: 'Basic' },
    { id: '2', trade: 'Fitter', task: 'Identify the correct tool for measuring a shaft diameter with 0.02mm accuracy.', difficulty: 'Intermediate' },
    { id: '3', trade: 'Mechanic (Diesel)', task: 'Bleed the air from a diesel fuel system.', difficulty: 'Advanced' },
];

const AiSkillWorkshop: React.FC = () => {
    const { selectedClass } = useClassroom();
    const toast = useToast();
    const [selectedTrade, setSelectedTrade] = useState('Electrician');
    const [scenario, setScenario] = useState<SkillScenario | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ sender: 'ai' | 'user', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { playAudio, stopAudio, isSpeaking, isListening, speechInput, toggleListening } = useSpeech({ initialLanguage: 'Hindi', initialVoice: 'Puck', enableSpeechRecognition: true });

    const startTraining = async (scen: SkillScenario) => {
        setScenario(scen);
        setMessages([]);
        setLoading(true);
        stopAudio();

        const systemInstruction = `
            You are 'AI Ustad', an expert ITI Instructor for the ${scen.trade} trade.
            The current task is: "${scen.task}".
            
            GOAL: Teach the student how to perform this task practically.
            
            GUIDELINES:
            1. Start by asking the student about the first safety precaution for this task.
            2. Evaluate their answer in HINDI (Hinglish).
            3. Use <b>bold</b> for tool names and technical terms.
            4. If the student uploads a photo of a tool or part, identify it and tell them if it's correct for the task.
            5. Be strict but encouraging about safety.
            
            Format: HTML (<p>, <ul>).
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chatInstance = ai.chats.create({ model: 'gemini-3-flash-preview', config: { systemInstruction } });
            setChat(chatInstance);

            const response = await chatInstance.sendMessage({ message: "Start the practical training session." });
            setMessages([{ sender: 'ai', text: response.text }]);
            playAudio(response.text, 0);
        } catch (e) {
            toast.error("Workshop engine failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (textOverride?: string) => {
        const text = textOverride || input;
        if ((!text.trim() && !attachedFile) || !chat) return;

        const currentFile = attachedFile;
        setInput(''); setAttachedFile(null); setPreview(null);
        
        setMessages(prev => [...prev, { sender: 'user', text: text || "Analyzing image..." }]);
        setLoading(true);

        try {
            const parts: Part[] = [];
            if (text) parts.push({ text });
            if (currentFile) {
                const b64 = await fileToBase64(currentFile);
                parts.push({ inlineData: { data: b64, mimeType: currentFile.type } });
            }

            const response = await chat.sendMessage({ message: parts });
            setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
            playAudio(response.text, messages.length);
        } catch (e) {
            toast.error("Error connecting to AI Ustad.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 rounded-3xl h-full flex flex-col overflow-hidden shadow-2xl border-4 border-slate-800">
            {/* Header */}
            <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                    <WrenchScrewdriverIcon className="h-6 w-6 text-orange-500" />
                    <div>
                        <h3 className="font-bold text-white">AI Skill Workshop</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Practical Training Engine</p>
                    </div>
                </div>
                {scenario && (
                    <button onClick={() => setScenario(null)} className="text-xs font-bold text-red-400 hover:underline">Exit Workshop</button>
                )}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                {!scenario ? (
                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                        <div className="text-center">
                            <h4 className="text-xl font-bold text-white mb-2">अपनी ट्रेड और काम चुनें (Select Task)</h4>
                            <p className="text-slate-400 font-hindi">सीखें असली काम, AI उस्ताद के साथ</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {mockScenarios.map(s => (
                                <button 
                                    key={s.id}
                                    onClick={() => startTraining(s)}
                                    className="p-5 bg-slate-800 border border-slate-700 rounded-2xl hover:border-orange-500 transition-all text-left group"
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs font-bold text-orange-500">{s.trade}</span>
                                        <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">{s.difficulty}</span>
                                    </div>
                                    <p className="font-bold text-slate-200 group-hover:text-white">{s.task}</p>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-orange-400">
                                        शुरू करें <PaperAirplaneIcon className="h-3 w-3" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
                        {/* Task Info */}
                        <div className="p-3 bg-orange-600/10 border-b border-orange-500/20 text-orange-500 flex items-center gap-2">
                            <ShieldCheckIcon className="h-4 w-4"/>
                            <p className="text-xs font-bold font-hindi">सावधानी: प्रैक्टिकल करते समय हमेशा सुरक्षा नियमों का पालन करें।</p>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl shadow-lg ${m.sender === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'}`}>
                                        <div className="prose prose-sm prose-invert max-w-none font-hindi" dangerouslySetInnerHTML={{ __html: m.text }} />
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="flex justify-start"><Loader message="AI उस्ताद सोच रहे हैं..." /></div>}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Interaction Bar */}
                        <div className="p-4 bg-slate-900 border-t border-white/5">
                            {preview && (
                                <div className="mb-4 relative w-20 h-20">
                                    <img src={preview} className="w-full h-full object-cover rounded-lg border-2 border-orange-500"/>
                                    <button onClick={() => { setAttachedFile(null); setPreview(null); }} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5"><XCircleIcon className="h-4 w-4"/></button>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-orange-500"><PhotoIcon className="h-6 w-6"/></button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                                    if(e.target.files?.[0]) {
                                        setAttachedFile(e.target.files[0]);
                                        setPreview(URL.createObjectURL(e.target.files[0]));
                                        toast.success("Photo attached! Send with your message.");
                                    }
                                }}/>
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        value={input} 
                                        onChange={e => setInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                                        placeholder="Type or speak process step..."
                                        className="w-full bg-slate-800 border-none rounded-xl p-3 text-white focus:ring-2 focus:ring-orange-500 pr-10"
                                    />
                                    <button onClick={toggleListening} className={`absolute right-2 top-2 p-1 rounded-lg ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                                        <MicrophoneIcon className="h-6 w-6"/>
                                    </button>
                                </div>
                                <button onClick={() => handleSend()} className="p-3 bg-orange-600 text-white rounded-xl shadow-lg hover:bg-orange-700">
                                    <PaperAirplaneIcon className="h-6 w-6"/>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiSkillWorkshop;
