
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MoonIcon, SparklesIcon, MapPinIcon, CheckCircleIcon, HeartIcon, UserCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useAppConfig } from '../contexts/AppConfigContext';

const AIAstroGuru: React.FC = () => {
    const toast = useToast();
    const { userName, fatherName, motherName, selectedState, primaryColor } = useAppConfig();
    const [reading, setReading] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!reading) handleSuryanshuReading();
    }, []);

    const handleSuryanshuReading = async () => {
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Expert Vedic Astrologer Greeting:
                Name: Suryanshu (Son of ${fatherName} and ${motherName})
                Details: 3rd May 2024, 12:32 PM, Rishi Nagar, Haryana.
                
                Key Astrological Point: Sun is EXALTED in Aries. Time is Noon (Sun strength is MAX).
                
                Instructions: 
                Write a 4-5 line greeting in Hindi. 
                1. Congratulate him on his powerful name and Sun position.
                2. Explain that the website's Golden (#f59e0b) theme is chosen to match his Solar energy.
                3. Mention that this energy brings success in leadership and education.
                4. Bless the family (${fatherName} & ${motherName}).
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });

            setReading(response.text || '');
        } catch (error) {
            setReading("नमस्ते सूर्यांशू! आपके नाम और जन्म समय के अनुसार आपका सूर्य अत्यंत प्रबल है। यह स्वर्ण थीम आपकी सफलता का प्रतीक है।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto animate-sunrise">
            <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-amber-100 flex flex-col md:flex-row min-h-[600px]">
                
                {/* Left Side: Solar Profile */}
                <div className="md:w-1/2 p-8 lg:p-12 bg-amber-50/30 border-r-2 border-amber-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-primary rounded-3xl text-white shadow-2xl shadow-primary/40 rotate-3">
                                <SparklesIcon className="h-10 w-10" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{userName}</h2>
                                <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mt-1">Solar Destiny Portal</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-5 bg-white/80 backdrop-blur-md rounded-3xl border border-amber-200 shadow-sm group hover:shadow-lg transition-all">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">अभिभावक (Parents)</p>
                                    <div className="flex items-center gap-3 text-slate-800 font-bold">
                                        <HeartIcon className="h-5 w-5 text-red-500" />
                                        <span>{fatherName} & {motherName}</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-white/80 backdrop-blur-md rounded-3xl border border-amber-200 shadow-sm">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">जन्म स्थान (Birthplace)</p>
                                    <div className="flex items-center gap-3 text-slate-800 font-bold">
                                        <MapPinIcon className="h-5 w-5 text-primary" />
                                        <span>Rishi Nagar, {selectedState}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-primary rounded-[2.5rem] text-white shadow-xl">
                         <h4 className="font-black text-xs uppercase mb-2 tracking-widest opacity-80">The Solar Theme</h4>
                         <p className="text-sm font-hindi leading-relaxed">
                            आपका मुख्य रंग **स्वर्ण (Gold)** है। यह आपके नाम की चमक और उच्च के सूर्य की ऊर्जा को दर्शाता है।
                         </p>
                    </div>
                </div>

                {/* Right Side: Astro Insight */}
                <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center text-center relative bg-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                    
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <Loader message="ग्रहों की गणना हो रही है..." />
                        </div>
                    ) : (
                        <div className="relative z-10 space-y-8">
                            <div className="w-28 h-28 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto border-4 border-amber-50 animate-bounce-slow">
                                <MoonIcon className="h-14 w-14 text-primary" />
                            </div>
                            
                            <div>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-3">Vedic Blessing</h3>
                                <p className="text-5xl font-black text-primary font-hindi drop-shadow-sm">शुभम भवतु!</p>
                            </div>

                            <div className="p-8 bg-amber-50/50 border-2 border-amber-100 rounded-[3rem] shadow-inner relative">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-amber-200 text-[10px] font-black uppercase text-primary">AI Kundli Summary</div>
                                <p className="text-xl font-hindi text-slate-700 leading-relaxed italic whitespace-pre-wrap">{reading}</p>
                            </div>

                            <div className="flex items-center justify-center gap-3 text-green-600 font-black text-xs uppercase tracking-widest">
                                <CheckCircleIcon className="h-5 w-5" /> Horoscope Theme Synced
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIAstroGuru;
