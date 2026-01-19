
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PaintBrushIcon, ArrowDownTrayIcon, SparklesIcon, ArrowPathIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useAppConfig } from '../contexts/AppConfigContext';

// Fixed: Global declarations
declare global {
  interface Window {
    html2canvas: any;
  }
}

interface DesignElement {
    type: 'text' | 'image';
    content: string;
    style: React.CSSProperties;
}

const presetSizes = [
    { label: 'A4 पोस्टर (A4 - 800x1120)', width: 800, height: 1120, type: 'Paper' },
    { label: 'बैनर (Banner - 1200x400)', width: 1200, height: 400, type: 'Wide' },
    { label: 'आईडी कार्ड (ID Card - 600x900)', width: 600, height: 900, type: 'Card' },
    { label: 'सोशल मीडिया (Square - 800x800)', width: 800, height: 800, type: 'Post' },
];

const SmartDesignStudio: React.FC = () => {
    const { institutionName } = useAppConfig();
    const toast = useToast();
    const [paraInput, setParaInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [canvasSize, setCanvasSize] = useState(presetSizes[0]); 
    const [design, setDesign] = useState<{ bg: string, elements: DesignElement[] } | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        if (!paraInput.trim()) {
            toast.error("कृपया बताएं कि आप क्या बनाना चाहते हैं। (जैसे: खेल दिवस के लिए पोस्टर)");
            return;
        }

        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Act as a professional graphic designer. 
                Target Output: "${canvasSize.label}"
                User Instruction: "${paraInput}"
                School Name to include: "${institutionName}"

                INSTRUCTIONS:
                1. Always put the School Name "${institutionName}" at the top center in a large, elegant font.
                2. Design a complete layout with background colors, headings, and details based on the user instruction.
                3. Return ONLY a JSON object:
                {
                  "bg": "CSS background property (hex or linear-gradient)",
                  "elements": [
                    {
                      "type": "text",
                      "content": "string",
                      "style": {
                        "top": "0-100%",
                        "left": "0-100%",
                        "fontSize": "12px-80px",
                        "color": "hex",
                        "fontWeight": "bold/normal",
                        "textAlign": "center/left",
                        "width": "100%",
                        "padding": "10px",
                        "textShadow": "optional shadow"
                      }
                    }
                  ]
                }
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            const data = JSON.parse(response.text || '{}');
            setDesign(data);
            toast.success("डिज़ाइन तैयार है! आप इसे देख और सेव कर सकते हैं।");
        } catch (e) {
            toast.error("डिज़ाइन बनाने में विफल। कृपया आसान भाषा में लिखें।");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!canvasRef.current) return;
        toast.info("डिज़ाइन फोटो के रूप में सेव हो रहा है...");
        try {
            const canvas = await window.html2canvas(canvasRef.current, { scale: 2, useCORS: true });
            const link = document.createElement('a');
            link.download = `Design_${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (e) {
            toast.error("Save Failed");
        }
    };

    return (
        <div className="h-full flex flex-col lg:flex-row bg-slate-200 overflow-hidden">
            
            {/* Sidebar Controls */}
            <div className="w-full lg:w-96 bg-white border-r p-6 overflow-y-auto custom-scrollbar shadow-2xl z-20">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <SparklesIcon className="h-6 w-6 text-primary"/> AI मैजिक डिज़ाइनर
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-hindi">सिर्फ लिखें और प्रीव्यू देखें</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">1. पेपर साइज़ चुनें (Select Size)</label>
                        <div className="grid grid-cols-1 gap-2">
                            {presetSizes.map(s => (
                                <button 
                                    key={s.label} 
                                    onClick={() => { setCanvasSize(s); setDesign(null); }}
                                    className={`p-3 rounded-xl border-2 text-left text-xs font-bold transition-all ${canvasSize.label === s.label ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">2. क्या बनाना है? (Describe in a Para)</label>
                        <textarea 
                            value={paraInput}
                            onChange={e => setParaInput(e.target.value)}
                            placeholder="जैसे: मुझे कक्षा 10 के बच्चों के लिए गणतंत्र दिवस का एक बधाई पोस्टर चाहिए जिसमें तिरंगे के रंग हों।"
                            className="w-full h-40 p-4 border-2 border-slate-100 rounded-2xl text-sm font-hindi bg-slate-50 focus:border-primary focus:ring-0 outline-none shadow-inner"
                        />
                    </div>

                    <button 
                        onClick={handleGenerate} 
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader message="डिज़ाइन बन रहा है..." /> : <><SparklesIcon className="h-5 w-5 text-yellow-400"/> डिज़ाइन तैयार करें</>}
                    </button>

                    {design && (
                        <button 
                            onClick={handleDownload} 
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5"/> फोटो गैलरी में सेव करें
                        </button>
                    )}
                </div>
            </div>

            {/* Main Preview Area (WYSWYG) */}
            <div className="flex-1 p-8 overflow-auto flex items-start justify-center bg-[#525659] custom-scrollbar">
                {!design && !loading ? (
                    <div className="mt-20 text-center opacity-30">
                        <PaintBrushIcon className="h-32 w-32 mx-auto text-white mb-4" />
                        <p className="text-xl font-black text-white font-hindi">आपका डिज़ाइन यहाँ दिखेगा</p>
                        <p className="text-xs text-white/60 mt-2 uppercase tracking-widest">Real-Time Print Preview</p>
                    </div>
                ) : (
                    <div 
                        ref={canvasRef}
                        className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative transition-all duration-700 origin-top overflow-hidden"
                        style={{ 
                            width: canvasSize.width, 
                            height: canvasSize.height, 
                            background: design?.bg || '#ffffff',
                            transform: `scale(${Math.min(0.65, 800 / canvasSize.width)})`,
                            marginBottom: '100px'
                        }}
                    >
                        {design?.elements.map((el, i) => (
                            <div 
                                key={i} 
                                className="animate-pop-in"
                                style={{ 
                                    position: 'absolute', 
                                    ...el.style, 
                                    padding: '20px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {el.type === 'text' ? (
                                    <span className="font-hindi">{el.content}</span>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartDesignStudio;
