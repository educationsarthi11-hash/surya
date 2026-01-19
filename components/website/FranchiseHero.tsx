
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BuildingOfficeIcon, CheckCircleIcon, EduSarthiLogo, SparklesIcon, GlobeAltIcon, HeartIcon, RocketLaunchIcon } from '../icons/AllIcons';
import { useAppConfig } from '../../contexts/AppConfigContext';

interface FranchiseHeroProps {
    onNavigateToLogin: () => void;
}

const FranchiseHero: React.FC<FranchiseHeroProps> = ({ onNavigateToLogin }) => {
    const { logoUrl, institutionName } = useAppConfig();
    const { t, language } = useLanguage();
    const isHindi = language === 'hi' || language === 'hr';

    const benefits = [
        { en: "No-Cost Rural Setup", hi: "मुफ्त ग्रामीण सेटअप मिशन" },
        { en: "Regional AI Intelligence", hi: "देसी भाषा AI इंटेलिजेंस" },
        { en: "100% Paperless Admin", hi: "100% पेपरलेस प्रबंधन" },
        { en: "Global Market Bridge", hi: "ग्लोबल मार्केट ब्रिज" },
        { en: "Smart Bus & Safety", hi: "स्मार्ट बस और सुरक्षा" },
        { en: "Lifetime AI Support", hi: "लाइफटाइम AI सपोर्ट" }
    ];

    return (
        <section id="franchise" className="py-40 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="animate-fade-in-up order-2 lg:order-1">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-600/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-orange-500/30">
                            <HeartIcon className="h-4 w-4" /> SURYA MISSION 2024
                        </div>
                        <h2 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] mb-10 uppercase italic">
                            BUILD THE <br/>
                            <span className="text-primary not-italic">FUTURE HUB.</span>
                        </h2>
                        <p className="text-2xl text-slate-400 mb-12 leading-relaxed font-hindi font-medium">
                            मंगमत के गौरवशाली इतिहास को आधुनिक एआई तकनीक के साथ जोड़ें। हम आपको वो टूल्स देते हैं जो "पैसे से ऊपर शिक्षा" को रखते हैं।
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-16">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                    <div className="bg-green-500/10 p-2 rounded-xl group-hover:bg-green-500/20 transition-colors">
                                        <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0" />
                                    </div>
                                    <span className="text-lg font-bold text-slate-100 font-hindi tracking-wide">{isHindi ? benefit.hi : benefit.en}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <button 
                                onClick={onNavigateToLogin}
                                className="px-12 py-6 bg-primary text-slate-950 font-black rounded-3xl transition-all shadow-[0_25px_50px_-15px_rgba(245,158,11,0.5)] hover:bg-white hover:scale-105 flex items-center gap-4 transform active:scale-95 text-xl"
                            >
                                <GlobeAltIcon className="h-6 w-6" />
                                <span className="uppercase tracking-widest">{isHindi ? 'पार्टनर बनें' : 'BECOME A PARTNER'}</span>
                            </button>
                            <button className="px-10 py-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-lg hover:bg-white/10 transition-all uppercase tracking-widest backdrop-blur-md">
                                {isHindi ? 'डाउनलोड प्लान' : 'DOWNLOAD PLAN'}
                            </button>
                        </div>
                    </div>

                    <div className="relative order-1 lg:order-2 flex justify-center">
                        <div className="w-full max-w-md aspect-square bg-slate-900 rounded-[5rem] border-4 border-white/10 flex items-center justify-center overflow-hidden relative group shadow-[0_100px_150px_-30px_rgba(0,0,0,1)]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-30"></div>
                            
                            <div className="flex flex-col items-center justify-center p-12 text-center animate-pop-in">
                                <div className="w-72 h-72 flex items-center justify-center mb-10 relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse"></div>
                                    {logoUrl ? (
                                        <img src={logoUrl} className="max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(245,158,11,0.6)] transition-transform duration-1000 group-hover:scale-110" alt={institutionName} />
                                    ) : (
                                        <div className="p-10 bg-white rounded-[3rem] shadow-2xl relative z-10 group-hover:rotate-6 transition-transform">
                                             <EduSarthiLogo className="w-full h-auto" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-white text-3xl font-black tracking-tighter uppercase mb-2">SURYA MASTER HUB</h3>
                                <p className="text-primary text-xs font-black uppercase tracking-[0.5em]">Platform Ready</p>
                            </div>
                        </div>
                        
                        {/* Floating Tech Card */}
                        <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-[2.5rem] shadow-3xl animate-float border border-slate-100 hidden sm:block">
                             <div className="flex items-center gap-4 mb-4">
                                 <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><RocketLaunchIcon className="h-6 w-6"/></div>
                                 <span className="font-black text-slate-900 uppercase text-xs">Node Status</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Sync Active</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </section>
    );
};

export default FranchiseHero;
