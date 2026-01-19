
import React, { useState, useRef } from 'react';
import { analyzeImageAndGetJson } from '../services/geminiService';
import { Type } from '@google/genai';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { SparklesIcon, CameraIcon, UserCircleIcon, PhotoIcon } from './icons/AllIcons';

interface OutfitRecommendation {
    style: string; // Casual, Formal, Traditional
    top: string;
    bottom: string;
    colorPalette: string[];
    footwear: string;
    accessories: string;
    reason: string; // Why this suits them
}

interface AnalysisResult {
    bodyType: string;
    skinTone: string;
    gender: string;
    recommendations: OutfitRecommendation[];
}

const AIFashionStylist: React.FC = () => {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [activeTab, setActiveTab] = useState<'Casual' | 'Formal' | 'Traditional'>('Casual');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            toast.error("Please upload a photo first.");
            return;
        }

        setLoading(true);
        try {
            const prompt = `
                Act as a top Indian Fashion Stylist. Analyze the image of the person.
                1. Identify their Gender, approximate Body Type (e.g., Lean, Athletic, Curvy), and Skin Tone.
                2. Suggest 3 complete outfits for them: 
                   - 'Casual' (Daily wear/College)
                   - 'Formal' (Office/Interview)
                   - 'Traditional' (Indian Wedding/Festivals)
                3. For each outfit, specify color combinations that suit their skin tone.
                
                Respond in HINDI (Hinglish allowed for fashion terms).
                Return JSON format strictly matching this schema.
            `;

            const schema = {
                type: Type.OBJECT,
                properties: {
                    gender: { type: Type.STRING },
                    bodyType: { type: Type.STRING },
                    skinTone: { type: Type.STRING },
                    recommendations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                style: { type: Type.STRING, enum: ["Casual", "Formal", "Traditional"] },
                                top: { type: Type.STRING },
                                bottom: { type: Type.STRING },
                                colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
                                footwear: { type: Type.STRING },
                                accessories: { type: Type.STRING },
                                reason: { type: Type.STRING }
                            },
                            required: ["style", "top", "bottom", "colorPalette", "footwear", "accessories", "reason"]
                        }
                    }
                },
                required: ["gender", "bodyType", "skinTone", "recommendations"]
            };

            const data = await analyzeImageAndGetJson(prompt, selectedFile, schema);
            setResult(data);
            toast.success("Styling complete!");
        } catch (e) {
            console.error(e);
            toast.error("AI could not analyze the image. Try a clearer photo.");
        } finally {
            setLoading(false);
        }
    };

    const currentOutfit = result?.recommendations.find(r => r.style === activeTab);

    return (
        <div className="bg-white p-6 rounded-[3rem] shadow-soft h-full flex flex-col min-h-[800px] border border-slate-100 animate-pop-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-[2.5rem]">
                <div className="p-3 bg-white rounded-full shadow-md text-pink-500">
                    <SparklesIcon className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">AI Fashion Stylist</h2>
                    <p className="text-sm font-hindi font-bold text-slate-500 tracking-widest mt-1">आपकी पर्सनल स्टाइलिंग गाइड</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Upload Section */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative flex-1 min-h-[400px] bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center"
                    >
                        {previewUrl ? (
                            <img src={previewUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="User Upload" />
                        ) : (
                            <div className="text-center p-8 space-y-4">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                                    <CameraIcon className="h-10 w-10 text-slate-300 group-hover:text-pink-500 transition-colors"/>
                                </div>
                                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Upload Photo</h3>
                                <p className="text-sm font-hindi text-slate-500">अपनी पूरी फोटो डालें (Full Body Photo)</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        
                        {previewUrl && !loading && (
                            <div className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-xl">
                                <PhotoIcon className="h-6 w-6 text-slate-700"/>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleAnalyze} 
                        disabled={loading || !selectedFile}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
                    >
                        {loading ? <Loader message="Analyzing Style..." /> : <><SparklesIcon className="h-6 w-6 text-yellow-300"/> Get My Look</>}
                    </button>
                </div>

                {/* Right: Analysis & Results */}
                <div className="lg:col-span-7">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10 border-4 border-slate-50 rounded-[3rem]">
                            <UserCircleIcon className="h-32 w-32 mb-6 text-slate-300" />
                            <h3 className="text-3xl font-black uppercase tracking-widest text-slate-400">Style Report Waiting</h3>
                            <p className="font-hindi text-lg mt-2">फोटो अपलोड करें और जादू देखें।</p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col space-y-8 animate-slide-in-right">
                            {/* Profile Summary */}
                            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl flex justify-between items-center relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400 mb-2">Analysis Complete</p>
                                    <div className="flex gap-6 text-sm font-bold">
                                        <span>Build: {result.bodyType}</span>
                                        <span className="w-px bg-white/20 h-4"></span>
                                        <span>Skin: {result.skinTone}</span>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 p-10 bg-white/10 rounded-full blur-xl -mr-5 -mt-5"></div>
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem]">
                                {['Casual', 'Formal', 'Traditional'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-white shadow-md text-pink-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Recommendation Card */}
                            {currentOutfit && (
                                <div className="flex-1 bg-white border-2 border-pink-100 rounded-[3rem] p-8 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-6 -mt-6"></div>
                                    
                                    <h3 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight relative z-10">Best Look For You</h3>
                                    
                                    <div className="space-y-6 relative z-10">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">1</div>
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Upper Wear</p>
                                                <p className="text-lg font-bold text-slate-800 font-hindi">{currentOutfit.top}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Bottom Wear</p>
                                                <p className="text-lg font-bold text-slate-800 font-hindi">{currentOutfit.bottom}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">3</div>
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Style Logic</p>
                                                <p className="text-sm text-slate-600 font-hindi leading-relaxed italic">"{currentOutfit.reason}"</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-100">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Color Palette</p>
                                        <div className="flex gap-3">
                                            {currentOutfit.colorPalette.map((color, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-1">
                                                    <div className="w-12 h-12 rounded-full shadow-inner border-2 border-white ring-1 ring-slate-200" style={{backgroundColor: color.toLowerCase()}}></div>
                                                    <span className="text-[10px] font-bold text-slate-500">{color}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIFashionStylist;
