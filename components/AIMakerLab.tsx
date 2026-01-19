
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    SparklesIcon, WrenchScrewdriverIcon, 
    SpeakerWaveIcon, StopCircleIcon, 
    ArrowPathIcon, PlayIcon, CheckCircleIcon,
    RocketLaunchIcon, BeakerIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';

interface Part {
    id: string;
    name: string;
    hindiName: string;
    functionHindi: string;
    icon: string;
}

const AIMakerLab: React.FC = () => {
    const toast = useToast();
    const [productName, setProductName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAssembling, setIsAssembling] = useState(false);
    const [parts, setParts] = useState<Part[]>([]);
    const [assembledParts, setAssembledParts] = useState<string[]>([]);
    const [advice, setAdvice] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    const generateClass = async () => {
        if (!productName.trim()) {
            toast.error("कृपया नाम लिखें (e.g. Robot)");
            return;
        }
        setIsGenerating(true);
        setParts([]);
        setAssembledParts([]);
        setIsFinished(false);
        setAdvice('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Break down building a "${productName}" into 5 essential parts for a school student.
            Return ONLY JSON:
            {
              "parts": [
                { "id": "p1", "name": "PartName", "hindiName": "हिन्दी नाम", "functionHindi": "इसका काम क्या है - 'बेटा...' से शुरू करें", "icon": "Emoji" }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const data = JSON.parse(response.text || '{}');
            setParts(data.parts || []);
            setIsAssembling(true);
        } catch (e) {
            toast.error("AI उस्ताद अभी व्यस्त हैं।");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFitPart = (part: Part) => {
        if (assembledParts.includes(part.id)) return;
        setAssembledParts(prev => [...prev, part.id]);
        setAdvice(part.functionHindi);
        playAudio(part.functionHindi, 0);

        if (assembledParts.length + 1 === parts.length) {
            setIsFinished(true);
            const msg = "बधाई हो! आपने यह प्रोजेक्ट पूरा कर लिया। आप एक अच्छे इंजीनियर बन सकते हैं!";
            setAdvice(msg);
            playAudio(msg, 1);
        }
    };

    return (
        <div className="bg-slate-950 p-6 rounded-[3rem] shadow-2xl h-full flex flex-col min-h-[750px] border-8 border-slate-900 text-white overflow-hidden relative">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-600 p-4 rounded-3xl shadow-lg">
                        <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">AI निर्माण शाला</h2>
                        <p className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.2em]">Build Anything, Learn Everything</p>
                    </div>
                </div>
                {isAssembling && (
                    <button onClick={() => { setIsAssembling(false); setProductName(''); }} className="p-4 bg-white/5 rounded-full hover:bg-white/10 text-orange-300"><ArrowPathIcon className="h-6 w-6"/></button>
                )}
            </div>

            <div className="flex-1 flex flex-col z-10">
                {!isAssembling ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-pop-in">
                        <h3 className="text-4xl font-black">बेटा, आज क्या <span className="text-orange-500">बनाना है?</span></h3>
                        <div className="w-full max-w-lg flex gap-3 bg-white/5 p-3 rounded-[2.5rem] border-2 border-white/10 focus-within:border-orange-500 transition-all">
                            <input 
                                value={productName}
                                onChange={e => setProductName(e.target.value)}
                                placeholder="जैसे: Computer, Drone, Car..." 
                                className="flex-1 bg-transparent border-none text-xl font-bold px-6 py-2 outline-none"
                            />
                            <button onClick={generateClass} disabled={isGenerating} className="bg-orange-600 text-white px-8 py-4 rounded-[2rem] font-black uppercase">
                                {isGenerating ? <Loader message="" /> : "शुरू करें"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                        <div className="lg:col-span-3 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                             {parts.map(part => (
                                <button key={part.id} onClick={() => handleFitPart(part)} className={`w-full p-5 rounded-[2rem] border-2 transition-all flex items-center gap-5 ${assembledParts.includes(part.id) ? 'opacity-20 grayscale' : 'border-white/5 bg-white/5 hover:border-orange-500/50'}`}>
                                    <span className="text-4xl">{part.icon}</span>
                                    <div className="text-left"><span className="block text-xs font-black uppercase">{part.hindiName}</span></div>
                                </button>
                             ))}
                        </div>
                        <div className="lg:col-span-6 bg-black/40 rounded-[4rem] relative flex items-center justify-center border-4 border-dashed border-slate-700">
                             {isFinished ? (
                                 <div className="text-center animate-bounce"><CheckCircleIcon className="h-32 w-32 text-green-500 mx-auto"/><h4 className="text-3xl font-black mt-4">{productName} READY!</h4></div>
                             ) : <div className="text-center opacity-20"><BeakerIcon className="h-32 w-32 mx-auto"/><p className="text-xl font-bold uppercase mt-4">Work in Progress</p></div>}
                        </div>
                        <div className="lg:col-span-3 bg-slate-900 p-8 rounded-[3rem] border border-white/10 flex flex-col shadow-2xl">
                             <h4 className="text-orange-400 font-black uppercase text-xs mb-6">AI उस्ताद रिपोर्ट</h4>
                             <p className="text-2xl font-hindi leading-relaxed text-slate-100 italic">"{advice || 'पार्ट्स जोड़ना शुरू करें।'}"</p>
                             {advice && <button onClick={() => playAudio(advice, 0)} className="mt-8 p-4 bg-orange-600 rounded-2xl flex items-center justify-center gap-3">
                                {isSpeaking ? <StopCircleIcon className="h-6 w-6"/> : <SpeakerWaveIcon className="h-6 w-6"/>} सुनें
                             </button>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIMakerLab;
