
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    SparklesIcon, ArrowPathIcon, SpeakerWaveIcon, 
    StopCircleIcon, FlaskConicalIcon, DocumentTextIcon, 
    PlusIcon, TrashIcon, AcademicCapIcon, MicrophoneIcon, 
    PaperAirplaneIcon 
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';
import { allLevels } from '../config/classroomData';

interface Chemical {
    id: string;
    name: string;
    formula: string;
    color: string;
    type: string;
}

const INITIAL_CHEMICALS: Chemical[] = [
    { id: 'c1', name: 'Sodium', formula: 'Na', color: '#E2E8F0', type: 'Metal' },
    { id: 'c2', name: 'Chlorine', formula: 'Cl', color: '#dcfce7', type: 'Gas' },
    { id: 'c3', name: 'Potassium', formula: 'K', color: '#cbd5e1', type: 'Metal' },
    { id: 'c4', name: 'Hydrochloric Acid', formula: 'HCl', color: '#f8fafc', type: 'Acid' },
    { id: 'c5', name: 'Water', formula: 'H2O', color: '#3b82f6', type: 'Liquid' },
];

const AIChemistryLab: React.FC = () => {
    const toast = useToast();
    const [selectedGrade, setSelectedGrade] = useState('Class 10');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPouring, setIsPouring] = useState(false);
    const [pouringColor, setPouringColor] = useState('#ffffff');
    const [targetContents, setTargetContents] = useState<string[]>([]);
    const [reactionResult, setReactionResult] = useState<any>(null);
    const [liquidColor, setLiquidColor] = useState('#334155');
    
    const { playAudio, stopAudio, isSpeaking, isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ 
        enableSpeechRecognition: true, 
        initialLanguage: 'Hindi' 
    });

    // Handle voice input automatically
    useEffect(() => {
        if (speechInput && !isListening) {
            setQuery(speechInput);
            handleUniversalQuery(speechInput);
            setSpeechInput('');
        }
    }, [speechInput, isListening]);

    const handleUniversalQuery = async (textOverride?: string | any) => {
        // Fix: Ensure we are working with a string to prevent .trim() errors
        const searchText = (typeof textOverride === 'string' ? textOverride : query) || '';
        
        if (!searchText || typeof searchText !== 'string' || !searchText.trim()) return;

        setLoading(true);
        setReactionResult(null);
        setQuery('');
        stopAudio();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Act as an AI Lab Scientist for grade ${selectedGrade}.
                The student asks: "${searchText}"
                
                Your Task:
                1. Identify which chemicals from this list are mentioned: [Sodium, Chlorine, Potassium, Water, HCl, Sodium Hydroxide, Sulphuric Acid].
                2. Explain the reaction in simple Hindi (Hinglish) starting with "Beta...".
                3. Determine the visual properties of the result.
                
                Return ONLY JSON:
                {
                    "title": "Reaction Name",
                    "explanation": "Simple Hindi text explanation",
                    "detectedChemicals": ["Chem1", "Chem2"],
                    "resultColor": "#hex_color",
                    "effect": "bubbling" | "smoke" | "explosion" | "none",
                    "temp": number
                }
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const data = JSON.parse(response.text || '{}');
            
            // Start Animation Sequence
            if (data.detectedChemicals && data.detectedChemicals.length > 0) {
                simulateMixing(data);
            } else {
                setReactionResult(data);
                playAudio(data.explanation, 0);
            }

        } catch (e) {
            toast.error("AI प्रयोगशाला में त्रुटि हुई।");
        } finally {
            setLoading(false);
        }
    };

    const simulateMixing = (data: any) => {
        setTargetContents([]);
        setLiquidColor('#334155');
        
        // Step 1: Pour chemicals one by one
        let delay = 0;
        data.detectedChemicals.forEach((chemName: string, index: number) => {
            setTimeout(() => {
                const chem = INITIAL_CHEMICALS.find(c => c.name.toLowerCase().includes(chemName.toLowerCase())) || INITIAL_CHEMICALS[0];
                setPouringColor(chem.color);
                setIsPouring(true);
                
                setTimeout(() => {
                    setIsPouring(false);
                    setTargetContents(prev => [...prev, chemName]);
                    if (index === data.detectedChemicals.length - 1) {
                        // Final reaction
                        setReactionResult(data);
                        setLiquidColor(data.resultColor || '#ffffff');
                        playAudio(data.explanation, 0);
                    }
                }, 1000);
            }, delay);
            delay += 1500;
        });
    };

    return (
        <div className="bg-slate-950 p-6 rounded-[3.5rem] shadow-2xl h-full flex flex-col min-h-[750px] border-8 border-slate-900 text-white font-sans overflow-hidden relative">
            <div className={`absolute inset-0 transition-all duration-1000 opacity-20 pointer-events-none ${reactionResult?.temp > 50 ? 'bg-red-500' : 'bg-transparent'}`}></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-4 rounded-[1.5rem] shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                        <FlaskConicalIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Smart Lab 3.0</h2>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Grade: {selectedGrade}</p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative">
                        <input 
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleUniversalQuery()}
                            placeholder="क्या मिलाना है? (बोलें या लिखें)..."
                            className="w-64 sm:w-96 bg-white/5 border-2 border-white/10 rounded-2xl p-4 pr-12 font-hindi font-bold focus:border-indigo-500 outline-none transition-all shadow-inner"
                        />
                        <button onClick={toggleListening} className={`absolute right-4 top-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                            <MicrophoneIcon className="h-6 w-6"/>
                        </button>
                    </div>
                    <button onClick={() => handleUniversalQuery()} className="p-4 bg-indigo-600 rounded-2xl hover:bg-indigo-500 shadow-xl active:scale-95 transition-all">
                        <PaperAirplaneIcon className="h-6 w-6"/>
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 overflow-hidden">
                {/* Info Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sample Commands</h4>
                        <div className="space-y-2">
                            {[
                                "सोडियम और पानी मिलाओ",
                                "क्लोरीन गैस कैसी दिखती है?",
                                "HCl + NaOH का रिएक्शन दिखाओ"
                            ].map((cmd, i) => (
                                <button key={i} onClick={() => {setQuery(cmd); handleUniversalQuery(cmd);}} className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-xs font-hindi border border-transparent hover:border-indigo-500/30 transition-all">
                                    {cmd}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {reactionResult && (
                        <div className="p-6 bg-indigo-600/20 border border-indigo-500/30 rounded-3xl animate-pop-in">
                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Detected Chemicals</h4>
                            <div className="flex flex-wrap gap-2">
                                {reactionResult.detectedChemicals?.map((c: string) => (
                                    <span key={c} className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-bold border border-white/10">{c}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Beaker Visualizer */}
                <div className="lg:col-span-6 bg-black/40 rounded-[4rem] border-2 border-white/5 relative flex flex-col items-center justify-center overflow-hidden shadow-inner group">
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                        {isPouring && (
                            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 animate-pour-stream">
                                <div className="w-2 h-40 rounded-full" style={{backgroundColor: pouringColor}}></div>
                            </div>
                        )}
                        
                        <div className="w-64 h-80 border-4 border-white/20 relative overflow-hidden transition-all duration-1000 shadow-2xl rounded-b-[2rem]">
                             <div 
                                className="absolute bottom-0 w-full transition-all duration-[2000ms] ease-in-out" 
                                style={{ 
                                    height: `${Math.min(100, (targetContents.length + 1) * 20)}%`, 
                                    backgroundColor: liquidColor, 
                                    opacity: 0.85 
                                }}
                             >
                                 {reactionResult?.effect === 'bubbling' && (
                                     <div className="absolute inset-0 overflow-hidden">
                                         {[...Array(20)].map((_, i) => (
                                             <div key={i} className="absolute bottom-0 w-2 h-2 bg-white/40 rounded-full animate-bubble" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}></div>
                                         ))}
                                     </div>
                                 )}
                                 {reactionResult?.effect === 'smoke' && (
                                     <div className="absolute -top-40 left-0 w-full h-40 pointer-events-none">
                                          <div className="w-full h-full bg-gradient-to-t from-white/20 to-transparent blur-xl animate-smoke"></div>
                                     </div>
                                 )}
                                 {reactionResult?.effect === 'explosion' && (
                                     <div className="absolute inset-0 bg-orange-500 animate-pulse flex items-center justify-center">
                                         <SparklesIcon className="h-20 w-20 text-yellow-300 animate-ping" />
                                     </div>
                                 )}
                             </div>
                        </div>

                        {loading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                                <Loader message="AI सार्थी गणना कर रहा है..." />
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Explanation Report */}
                <div className="lg:col-span-3">
                    <div className="p-8 bg-slate-900 border border-white/10 rounded-[3rem] h-full flex flex-col shadow-2xl relative overflow-hidden">
                        <h3 className="font-black mb-6 flex items-center gap-3 text-indigo-400 uppercase tracking-tight text-lg border-b border-white/5 pb-4"><DocumentTextIcon className="h-6 w-6"/> AI लैब रिपोर्ट</h3>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {reactionResult ? (
                                <div className="animate-pop-in space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Resulting Product</p>
                                        <h4 className="text-2xl font-black text-indigo-400">{reactionResult.title}</h4>
                                    </div>
                                    <div className="p-6 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 shadow-inner">
                                        <p className="text-lg font-hindi leading-relaxed text-slate-100 font-medium">"{reactionResult.explanation}"</p>
                                    </div>
                                    <button onClick={() => playAudio(reactionResult.explanation, 0)} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-500 transition-all">
                                        {isSpeaking ? <StopCircleIcon className="h-6 w-6 animate-pulse"/> : <SpeakerWaveIcon className="h-6 w-6"/>} दोबारा सुनें
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-6">
                                    <FlaskConicalIcon className="h-20 w-20 mb-6 text-slate-400" />
                                    <p className="text-sm font-black uppercase tracking-[0.2em] leading-snug font-hindi">ऊपर बॉक्स में लिखें कि आप क्या मिलाना चाहते हैं।</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pour-stream { 0% { height: 0; opacity: 1; transform: translateY(-100px); } 100% { height: 300px; opacity: 0; transform: translateY(200px); } }
                .animate-pour-stream { animation: pour-stream 1s ease-in-out forwards; }
                @keyframes bubble { 0% { transform: translateY(0) scale(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-150px) scale(1.5); opacity: 0; } }
                .animate-bubble { animation: bubble 3s infinite; }
                @keyframes smoke { 0% { transform: translateY(0) scaleX(1); opacity: 0; } 50% { opacity: 0.5; transform: translateY(-30px) scaleX(1.3); } 100% { transform: translateY(-80px) scaleX(1.8); opacity: 0; } }
                .animate-smoke { animation: smoke 4s infinite linear; }
            `}</style>
        </div>
    );
};

export default AIChemistryLab;
