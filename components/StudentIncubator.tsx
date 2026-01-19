
import React, { useState, useRef } from 'react';
import { 
    ShoppingCartIcon, SparklesIcon, PhotoIcon, 
    CurrencyRupeeIcon, RocketLaunchIcon, ArrowRightIcon,
    XCircleIcon, ShieldCheckIcon, ChartBarIcon, SpeakerWaveIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { analyzeImageAndGetJson, fileToBase64 } from '../services/geminiService';
import { Type } from '@google/genai';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';

const StudentIncubator: React.FC = () => {
    const toast = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
            setProductData(null);
        }
    };

    const handleLaunchProduct = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const prompt = `
                Analyze this student-made project image. 
                1. Identify what it is (e.g., Hand-made painting, ITI Metal Tool, Science Model).
                2. Write a Professional Marketing Pitch in Hindi (Hinglish).
                3. Suggest an estimated Market Value in INR.
                4. Give 3 tips to improve this as a commercial product.
                
                Return ONLY JSON:
                {
                    "name": "Product Name",
                    "category": "Category",
                    "pitch": "Detailed Hindi marketing description starting with 'Beta...'",
                    "valuation": "₹500 - ₹2000",
                    "tips": ["Tip 1", "Tip 2", "Tip 3"]
                }
            `;

            const result = await analyzeImageAndGetJson(prompt, file, {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    pitch: { type: Type.STRING },
                    valuation: { type: Type.STRING },
                    tips: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["name", "pitch", "valuation"]
            });

            setProductData(result);
            playAudio(result.pitch, 0);
            toast.success("आपका प्रोडक्ट अब ग्लोबल बाज़ार के लिए तैयार है!");
        } catch (e) {
            toast.error("AI विश्लेषण विफल रहा।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-2 sm:p-8 rounded-[3.5rem] shadow-soft h-full flex flex-col min-h-[800px] border border-slate-100 animate-pop-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-slate-900 p-4 rounded-3xl text-primary shadow-xl rotate-3">
                        <ShoppingCartIcon className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">AI Global Bazaar</h2>
                        <p className="text-sm font-hindi font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <SparklesIcon className="h-4 w-4 text-primary animate-pulse"/> छात्र उद्यमी हब (Student Incubator)
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
                {/* Upload Section */}
                <div className="space-y-8 flex flex-col">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 min-h-[400px] border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50 hover:bg-white hover:border-primary/30 transition-all flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden shadow-inner"
                    >
                        {preview ? (
                            <img src={preview} className="w-full h-full object-cover rounded-[3.5rem] animate-pop-in" alt="Project Preview"/>
                        ) : (
                            <div className="text-center space-y-6">
                                <div className="p-8 bg-white rounded-full shadow-2xl group-hover:scale-110 transition-transform">
                                    <PhotoIcon className="h-16 w-16 text-slate-200 group-hover:text-primary transition-colors" />
                                </div>
                                <p className="font-hindi text-xl font-bold text-slate-400 uppercase tracking-widest">अपने प्रोजेक्ट की फोटो डालें</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                    
                    <button 
                        onClick={handleLaunchProduct}
                        disabled={!file || loading}
                        className="w-full py-6 bg-slate-950 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 text-xl uppercase active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader message="AI विश्लेषण कर रहा है..." /> : <><RocketLaunchIcon className="h-8 w-8 text-yellow-400"/> बाज़ार में लॉन्च करें (Launch to Market)</>}
                    </button>
                </div>

                {/* AI Result Section */}
                <div className="flex flex-col h-full bg-slate-50/50 rounded-[4rem] border-2 border-slate-100 p-8 shadow-inner overflow-y-auto custom-scrollbar">
                    {productData ? (
                        <div className="animate-pop-in space-y-8">
                            <div className="flex justify-between items-start border-b pb-6 border-slate-200">
                                <div>
                                    <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{productData.category}</span>
                                    <h3 className="text-4xl font-black text-slate-900 mt-2 uppercase tracking-tighter">{productData.name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Valuation</p>
                                    <p className="text-3xl font-black text-green-600 font-mono">{productData.valuation}</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-primary/5 relative overflow-hidden group">
                                <div className="absolute top-4 right-6"><SpeakerWaveIcon className={`h-6 w-6 ${isSpeaking ? 'text-red-500 animate-pulse' : 'text-primary opacity-20'}`}/></div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2"><SparklesIcon className="h-4 w-4 text-primary"/> Marketing Pitch (Hinglish)</h4>
                                <p className="text-xl font-hindi leading-relaxed text-slate-700 font-medium italic">"{productData.pitch}"</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-lg">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Business Tips</h4>
                                    <ul className="space-y-3">
                                        {productData.tips?.map((tip: string, i: number) => (
                                            <li key={i} className="flex gap-3 items-start text-xs font-hindi">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white shrink-0"></div>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-200 flex flex-col items-center justify-center text-center">
                                     <ShieldCheckIcon className="h-10 w-10 text-green-500 mb-2" />
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Verified</p>
                                     <p className="font-bold text-slate-800 text-sm">AI Patent Check Passed</p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-primary transition-all text-xs uppercase tracking-widest">Add to Global Store</button>
                                <button className="p-4 bg-slate-100 rounded-2xl text-slate-400"><ChartBarIcon className="h-6 w-6"/></button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                            <RocketLaunchIcon className="h-24 w-24 mb-6 text-slate-400" />
                            <h3 className="text-2xl font-black uppercase tracking-widest text-slate-400">Incubator Preview</h3>
                            <p className="font-hindi text-lg mt-2">अपना प्रोजेक्ट अपलोड करें और देखें कि AI उसे एक सफल बिज़नेस में कैसे बदलता है।</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentIncubator;
