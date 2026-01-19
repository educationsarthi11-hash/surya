
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    BoltIcon, SparklesIcon, ArrowPathIcon, SpeakerWaveIcon, 
    StopCircleIcon, PlusIcon, TrashIcon, DocumentTextIcon, 
    AcademicCapIcon, MicrophoneIcon, PaperAirplaneIcon 
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';
import { allLevels } from '../config/classroomData';

const AIElectricLab: React.FC = () => {
    const toast = useToast();
    const [selectedGrade, setSelectedGrade] = useState('Class 10');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string>('');
    const [activeComponents, setActiveComponents] = useState<string[]>([]);
    const { playAudio, stopAudio, isSpeaking, isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ initialLanguage: 'Hindi' });

    useEffect(() => {
        if (speechInput && !isListening) {
            setQuery(speechInput);
            analyzeElectricQuery(speechInput);
            setSpeechInput('');
        }
    }, [speechInput, isListening]);

    const analyzeElectricQuery = async (textOverride?: string) => {
        const text = textOverride || query;
        if (!text.trim()) return;

        setLoading(true);
        setAiAnalysis('');
        setQuery('');
        stopAudio();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Act as a Professional Electrician & Physics Teacher for ${selectedGrade}.
                Question: "${text}"
                
                Identify the electrical components involved (Battery, LED, Switch, Wire, Motor, Resistor).
                Explain the result in simple Hindi (Hinglish) starting with "Beta...".
                Mention safety warnings if they are connecting high voltage to low voltage items.
                
                Return JSON:
                {
                    "explanation": "Hindi explanation text",
                    "components": ["Battery", "LED"],
                    "isSafe": boolean,
                    "result": "Description of what happens (e.g. LED glows, motor spins, short circuit)"
                }
            `;
            
            const response = await ai.models.generateContent({ 
                model: 'gemini-3-flash-preview', 
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });
            
            const data = JSON.parse(response.text || '{}');
            setAiAnalysis(data.explanation);
            setActiveComponents(data.components || []);
            playAudio(data.explanation, 0);

            if (!data.isSafe) {
                toast.warning("सावधानी: यह कनेक्शन खतरनाक हो सकता है!");
            }
        } catch (e) {
            toast.error("AI उस्ताद अभी व्यस्त हैं।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-950 p-6 rounded-[3.5rem] shadow-2xl h-full flex flex-col min-h-[750px] border-8 border-slate-900 text-white font-sans overflow-hidden">
            <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-500 p-4 rounded-[1.5rem] shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <BoltIcon className="h-8 w-8 text-black" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Smart Electric Lab</h2>
                        <div className="flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 mt-1">
                             <AcademicCapIcon className="h-3 w-3 text-yellow-400"/>
                             <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none text-yellow-400 p-0 cursor-pointer">
                                 {allLevels.map(l => <option key={l} value={l} className="bg-slate-900 text-white">{l}</option>)}
                             </select>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative">
                        <input 
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && analyzeElectricQuery()}
                            placeholder="सर्किट के बारे में पूछें (जैसे: 12V बैटरी + 3V LED)..."
                            className="w-64 sm:w-96 bg-white/5 border-2 border-white/10 rounded-2xl p-4 pr-12 font-hindi font-bold focus:border-yellow-500 outline-none transition-all"
                        />
                        <button onClick={toggleListening} className={`absolute right-4 top-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                            <MicrophoneIcon className="h-6 w-6"/>
                        </button>
                    </div>
                    <button onClick={() => analyzeElectricQuery()} className="p-4 bg-yellow-600 rounded-2xl hover:bg-yellow-500 text-black shadow-xl active:scale-95 transition-all">
                        <PaperAirplaneIcon className="h-6 w-6"/>
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 overflow-hidden">
                {/* Visual Workbench */}
                <div className="lg:col-span-8 bg-black/40 rounded-[4rem] border-2 border-white/5 relative flex flex-col items-center justify-center overflow-hidden shadow-inner">
                    {loading ? (
                        <Loader message="AI सर्किट की जांच कर रहा है..." />
                    ) : activeComponents.length > 0 ? (
                        <div className="flex flex-col items-center gap-10 animate-pop-in">
                            <div className="flex items-center gap-12">
                                {activeComponents.map((c, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3">
                                        <div className="w-24 h-24 bg-white/10 rounded-3xl border-2 border-yellow-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                                            {c.toLowerCase().includes('battery') ? '🔋' : c.toLowerCase().includes('led') ? '💡' : c.toLowerCase().includes('motor') ? '⚙️' : '🔌'}
                                        </div>
                                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{c}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="h-1 w-64 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-pulse"></div>
                            <p className="text-xl font-black text-yellow-400 uppercase tracking-tighter">Connection Active</p>
                        </div>
                    ) : (
                        <div className="opacity-20 text-center px-10">
                            <BoltIcon className="h-32 w-32 mx-auto mb-6 text-slate-500" />
                            <p className="text-2xl font-black uppercase tracking-widest font-hindi">इलेक्ट्रिक सर्किट का जादू देखें</p>
                        </div>
                    )}
                </div>

                {/* Analysis Report */}
                <div className="lg:col-span-4 flex flex-col h-full">
                    <div className="p-8 bg-slate-900 border border-white/10 rounded-[3rem] h-full flex flex-col shadow-2xl relative overflow-hidden">
                        <h3 className="font-black mb-6 flex items-center gap-3 text-yellow-400 uppercase tracking-tight text-lg border-b border-white/5 pb-4"><DocumentTextIcon className="h-6 w-6"/> AI उस्ताद रिपोर्ट</h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {aiAnalysis ? (
                                <div className="animate-pop-in space-y-8">
                                    <div className="p-6 bg-yellow-500/5 rounded-[2rem] border border-yellow-500/10">
                                        <p className="text-xl font-hindi leading-relaxed text-slate-100 italic font-medium">"{aiAnalysis}"</p>
                                    </div>
                                    <button onClick={() => playAudio(aiAnalysis, 0)} className="w-full py-5 bg-yellow-600 text-black rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-xl hover:bg-yellow-500 transition-all">
                                        {isSpeaking ? <StopCircleIcon className="h-6 w-6 animate-pulse"/> : <SpeakerWaveIcon className="h-6 w-6"/>} दोबारा सुनें
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-30 h-full text-center px-6">
                                    <BoltIcon className="h-20 w-20 mb-6 text-slate-400" />
                                    <p className="text-xs font-black uppercase tracking-[0.2em] leading-snug">ऊपर सवाल पूछें, जैसे: "9V बैटरी से 3V LED जोड़ने पर क्या होगा?"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIElectricLab;
