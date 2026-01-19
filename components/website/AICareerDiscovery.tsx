
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon, RocketLaunchIcon, ArrowRightIcon, BriefcaseIcon, StarIcon } from '../icons/AllIcons';
import { useToast } from '../../hooks/useToast';
import Loader from '../Loader';
import SectionWrapper from './SectionWrapper';

const AICareerDiscovery: React.FC = () => {
    const [hobbies, setHobbies] = useState('');
    const [loading, setLoading] = useState(false);
    const [careers, setCareers] = useState<any[]>([]);
    const toast = useToast();

    const handleDiscover = async () => {
        if (!hobbies.trim()) {
            toast.error("कृपया अपनी रुचियां लिखें (Please enter hobbies).");
            return;
        }
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                The user is a student. Their hobbies/interests are: "${hobbies}".
                Suggest 3 diverse career paths for them.
                1. A creative path.
                2. A technical/scientific path.
                3. A unique/modern path (e.g. AI, Space, Sustainability).
                
                Output ONLY JSON array:
                [
                    { "title": "Career Title", "reason": "One short sentence in Hindi explanation why this fits.", "icon": "emoji" },
                    ...
                ]
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });
            
            const data = JSON.parse(response.text || '[]');
            setCareers(data);
            toast.success("AI ने आपके लिए करियर ढूंढ लिए हैं!");
        } catch (e) {
            toast.error("AI अभी व्यस्त है।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SectionWrapper id="ai-career" className="relative py-32 overflow-hidden bg-[#0B0F19]">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    
                    {/* Left: Interactive Input Area */}
                    <div className="lg:w-1/2 space-y-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <SparklesIcon className="h-4 w-4 animate-spin-slow"/> Future Lab
                            </div>
                            <h2 className="text-5xl sm:text-7xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                                Decode Your <br/> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">Destiny.</span>
                            </h2>
                            <p className="text-xl text-slate-400 font-hindi mt-6 leading-relaxed border-l-4 border-indigo-500 pl-6">
                                "बस अपनी पसंद बताएं, बाकी काम <span className="text-white font-bold">AI सार्थी</span> का।" <br/>
                                हम आपके शौक को एक सफल करियर में बदल देंगे।
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-40 group-hover:opacity-75 transition duration-1000"></div>
                            <div className="relative bg-slate-900 p-3 rounded-[2.5rem] flex flex-col sm:flex-row gap-3 items-center border border-white/10 shadow-2xl">
                                <input 
                                    type="text" 
                                    value={hobbies}
                                    onChange={(e) => setHobbies(e.target.value)}
                                    placeholder="मैं क्रिकेट खेलता हूँ और पेंटिंग करता हूँ..."
                                    className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 px-8 py-5 outline-none font-bold text-lg w-full font-hindi"
                                    onKeyPress={(e) => e.key === 'Enter' && handleDiscover()}
                                />
                                <button 
                                    onClick={handleDiscover}
                                    disabled={loading}
                                    className="px-10 py-5 bg-white text-slate-950 font-black rounded-[2rem] hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 active:scale-95 w-full sm:w-auto group/btn"
                                >
                                    {loading ? <Loader message="" /> : (
                                        <>
                                            <span className="uppercase tracking-widest text-sm">ANALYZE</span>
                                            <RocketLaunchIcon className="h-5 w-5 group-hover/btn:rotate-45 transition-transform text-indigo-600"/>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Quick Tags */}
                        <div className="flex flex-wrap gap-3">
                            {['Gaming 🎮', 'Cooking 🍳', 'Music 🎵', 'Science 🧪'].map(tag => (
                                <button key={tag} onClick={() => setHobbies(tag)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 border border-white/5 transition-all">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: The Compass/Results */}
                    <div className="lg:w-1/2 w-full flex justify-center">
                        {careers.length > 0 ? (
                            <div className="w-full space-y-6 animate-pop-in perspective-1000">
                                {careers.map((career, idx) => (
                                    <div 
                                        key={idx} 
                                        className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] flex items-center gap-8 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                                        style={{ animationDelay: `${idx * 150}ms` }}
                                    >
                                        <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-black rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                            {career.icon || '🚀'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Path {idx + 1}</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tight italic group-hover:text-indigo-300 transition-colors">{career.title}</h4>
                                            <p className="text-sm text-slate-400 font-hindi mt-2 font-medium leading-relaxed">{career.reason}</p>
                                        </div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                            <div className="p-3 bg-white rounded-full text-indigo-600 shadow-lg">
                                                <ArrowRightIcon className="h-5 w-5"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center mt-8">
                                    <button className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                                        Save to Student Profile
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full max-w-md aspect-square flex flex-col items-center justify-center">
                                {/* Simple Icon Replacement */}
                                <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
                                
                                <div className="relative z-10 mb-6 group">
                                    <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center border-4 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-float group-hover:border-indigo-500 transition-all">
                                        <BriefcaseIcon className="h-14 w-14 text-indigo-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-white text-indigo-600 p-2 rounded-full shadow-lg animate-bounce">
                                        <SparklesIcon className="h-6 w-6" />
                                    </div>
                                </div>
                                
                                <div className="mt-6 text-center relative z-10">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-3 animate-pulse">
                                        AI <span className="text-indigo-500">SARTHI</span>
                                    </h3>
                                    <p className="text-slate-400 font-hindi font-bold text-lg max-w-xs mx-auto leading-relaxed">
                                        अपनी रुचियां लिखें और भविष्य का नक्शा देखें।
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </SectionWrapper>
    );
};

export default AICareerDiscovery;
