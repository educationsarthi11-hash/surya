
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    SparklesIcon, ArrowPathIcon, SpeakerWaveIcon, StopCircleIcon, 
    LeafIcon, DocumentTextIcon, PaperAirplaneIcon, MicrophoneIcon, 
    AcademicCapIcon, CameraIcon, PhotoIcon, XCircleIcon 
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';
import { allLevels } from '../config/classroomData';
import { analyzeImageAndGetJson } from '../services/geminiService';
import { Type } from '@google/genai';

const AIAgricultureLab: React.FC = () => {
    const toast = useToast();
    const [selectedGrade, setSelectedGrade] = useState('Class 10');
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<any>(null);
    const [customQuery, setCustomQuery] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { playAudio, stopAudio, isSpeaking, isListening, speechInput, toggleListening } = useSpeech({ 
        enableSpeechRecognition: true, 
        initialLanguage: 'Hindi' 
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            analyzeSoilOrCrop(file);
        }
    };

    const analyzeSoilOrCrop = async (file: File) => {
        setLoading(true);
        setAiResponse(null);
        stopAudio();
        toast.info("AI मिट्टी और फसल की जांच कर रहा है...");

        try {
            const prompt = `
                Act as 'Kisan Sarthi AI Specialist'. Analyze this photo of soil or a plant.
                1. Identify if it is Soil, a healthy crop, or a diseased plant.
                2. If it's soil: Tell its type, health status, and 3 best crops for it in Hindi.
                3. If it's a plant: Identify the crop and any visible diseases or nutrient deficiencies.
                4. Suggest natural remedies or best fertilizers in a very simple Haryanvi/Hindi mix.
                
                Return JSON:
                {
                    "title": "Analysis Result Title",
                    "explanation": "Detailed explanation in simple Hindi",
                    "farmerFact": "A motivating tip for the farmer",
                    "tip": "Actionable step for better yield"
                }
            `;

            const schema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    farmerFact: { type: Type.STRING },
                    tip: { type: Type.STRING }
                },
                required: ["title", "explanation", "tip"]
            };

            const result = await analyzeImageAndGetJson(prompt, file, schema);
            setAiResponse(result);
            playAudio(result.explanation, 0);
            toast.success("जांच पूरी हुई!");
        } catch (e) {
            toast.error("AI स्कैनर अभी व्यस्त है।");
        } finally {
            setLoading(false);
        }
    };

    const runAnalysis = async (query: string) => {
        const text = query || customQuery;
        if (!text.trim()) return;

        setLoading(true);
        setCustomQuery('');
        stopAudio();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `You are 'Kisan Sarthi AI', an expert in agriculture and rural life. 
                   A student from ${selectedGrade} is asking: "${text}". 
                   Explain the agricultural concept or the farmer's challenge mentioned. 
                   Make sure to highlight:
                   1. The hard work involved.
                   2. Scientific techniques (modern farming).
                   3. Economic and climate challenges.
                   4. A solution in simple Hindi (Hinglish).
                   Return ONLY JSON: {
                     "title": "Topic Title", 
                     "explanation": "Detailed Hindi explanation", 
                     "farmerFact": "A heart-touching fact about Indian farmers",
                     "tip": "How students can help or learn more"
                   }`;
            
            const response = await ai.models.generateContent({ 
                model: 'gemini-3-flash-preview', 
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });
            
            const data = JSON.parse(response.text || '{}');
            setAiResponse(data);
            playAudio(data.explanation, 0);
        } catch (e) {
            toast.error("AI सर्वर व्यस्त है।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-emerald-950 p-4 sm:p-8 rounded-[3.5rem] shadow-2xl h-full flex flex-col min-h-[750px] border-8 border-emerald-900 text-white font-sans overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 p-4 rounded-[1.5rem] shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                        <LeafIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight leading-none">कृषि विज्ञान लैब</h2>
                        <div className="flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 mt-1">
                             <AcademicCapIcon className="h-3 w-3 text-emerald-400"/>
                             <select value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none text-emerald-400 p-0 cursor-pointer">
                                 {allLevels.slice(5).map(l => <option key={l} value={l} className="bg-slate-900 text-white">{l}</option>)}
                             </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl hover:bg-orange-500 transition-all flex items-center gap-3 animate-pulse active:scale-95"
                    >
                        <CameraIcon className="h-6 w-6"/>
                        <span className="font-hindi tracking-tighter">मिट्टी / फसल की फोटो खींचें</span>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                    
                    <button onClick={() => { setAiResponse(null); stopAudio(); setCustomQuery(''); }} className="p-4 bg-white/5 rounded-full border border-white/10 shadow-xl hover:bg-white/10 transition-colors">
                        <ArrowPathIcon className="h-6 w-6 text-emerald-300"/>
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 overflow-hidden">
                {/* Left side: Interactive Questions */}
                <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-4">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">AI Soil Expert</h4>
                        <p className="text-sm font-hindi leading-relaxed opacity-80">खेत की मिट्टी या पत्तों की फोटो खींचें। AI आपको बताएगा कि अच्छी पैदावार (Yield) के लिए क्या करना चाहिए।</p>
                    </div>

                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Common Questions</p>
                    {[
                        "मिट्टी की उपजाऊ शक्ति कैसे बढ़ाएं?",
                        "फसल को कीड़ों से कैसे बचाएं?",
                        "जैविक खेती (Organic Farming) क्या है?",
                        "एक किसान का दिन कैसा होता है?"
                    ].map((q, i) => (
                        <button 
                            key={i} 
                            onClick={() => runAnalysis(q)}
                            className="w-full p-5 rounded-[2rem] border-2 border-white/5 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500 transition-all text-left font-hindi text-sm shadow-sm group"
                        >
                            <span className="group-hover:translate-x-2 transition-transform inline-block">{q}</span>
                        </button>
                    ))}
                    
                    <div className="pt-4 border-t border-white/10">
                        <div className="relative">
                            <input 
                                value={customQuery}
                                onChange={e => setCustomQuery(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && runAnalysis(customQuery)}
                                placeholder="अपना सवाल लिखें..." 
                                className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-4 pr-12 font-hindi text-sm focus:border-emerald-500 outline-none"
                            />
                            <button onClick={() => runAnalysis(customQuery)} className="absolute right-3 top-3 text-emerald-500"><PaperAirplaneIcon className="h-6 w-6"/></button>
                        </div>
                        <button 
                            onClick={toggleListening}
                            className={`w-full mt-3 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all ${isListening ? 'bg-red-600 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            <MicrophoneIcon className="h-5 w-5"/> {isListening ? 'मैं सुन रहा हूँ...' : 'बोलकर पूछें'}
                        </button>
                    </div>
                </div>

                {/* Right side: AI Report & Visuals */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="flex-1 bg-slate-900 border border-white/10 rounded-[3.5rem] p-8 flex flex-col shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><LeafIcon className="h-40 w-40"/></div>
                        
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <Loader message="AI सार्थी डेटा की जांच कर रहा है..." />
                                <div className="mt-8 flex gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        ) : aiResponse ? (
                            <div className="animate-pop-in flex flex-col h-full">
                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">AI Agriculture Report</span>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">{aiResponse.title}</h3>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                                    <div className="p-8 bg-emerald-500/10 rounded-[2.5rem] border-2 border-emerald-500/20 shadow-inner">
                                        <p className="text-2xl font-hindi leading-relaxed text-slate-100 font-medium italic">"{aiResponse.explanation}"</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-orange-500/10 rounded-[2rem] border border-orange-500/20 group hover:bg-orange-500/20 transition-all">
                                            <h4 className="text-xs font-black text-orange-400 uppercase mb-3 flex items-center gap-2"><SparklesIcon className="h-4 w-4"/> मुख्य तथ्य (Fact)</h4>
                                            <p className="text-base font-hindi text-slate-300 leading-relaxed">{aiResponse.farmerFact}</p>
                                        </div>
                                        <div className="p-6 bg-blue-500/10 rounded-[2rem] border border-blue-500/20 group hover:bg-blue-500/20 transition-all">
                                            <h4 className="text-xs font-black text-blue-400 uppercase mb-3 flex items-center gap-2"><AcademicCapIcon className="h-4 w-4"/> अच्छी उपज के लिए सलाह</h4>
                                            <p className="text-base font-hindi text-slate-300 leading-relaxed">{aiResponse.tip}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4">
                                    <button onClick={() => playAudio(aiResponse.explanation, 0)} className="flex-1 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-4 shadow-xl hover:bg-emerald-500 transition-all transform active:scale-95 text-lg">
                                        {isSpeaking ? <StopCircleIcon className="h-7 w-7 animate-pulse"/> : <SpeakerWaveIcon className="h-7 w-7"/>} रिपोर्ट सुनें
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center px-10">
                                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                                    <PhotoIcon className="h-16 w-16 text-emerald-400 opacity-40" />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-widest text-slate-400">Scan Soil & Crops</h3>
                                <p className="font-hindi text-xl mt-4 text-slate-500 max-w-md mx-auto">खेत की मिट्टी या फसल की फोटो डालें और वैज्ञानिक जानकारी पाएं। अच्छी पैदावार का सार्थी!</p>
                                <div className="mt-10 flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAgricultureLab;
