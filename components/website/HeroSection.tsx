
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SparklesIcon, ArrowRightIcon, BuildingOfficeIcon, SunIcon, RocketLaunchIcon, BoltIcon, CheckCircleIcon } from '../icons/AllIcons';

interface HeroSectionProps {
    onNavigateToLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToLogin }) => {
    const { t } = useLanguage();

    return (
        <section id="home" className="relative bg-[#020617] overflow-hidden min-h-[90vh] flex flex-col justify-center pt-24 pb-16 lg:pt-32 lg:pb-20">
            {/* Dynamic Background FX */}
            <div className="absolute top-0 right-0 w-[600px] lg:w-[1000px] h-[600px] lg:h-[1000px] bg-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 lg:-mr-80 lg:-mt-80 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-blue-600/5 rounded-full blur-[120px] -ml-40 -mb-40 lg:-ml-80 lg:-mb-80"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl z-10 relative">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left Content Area */}
                    <div className="lg:w-7/12 space-y-6 sm:space-y-8 animate-pop-in text-center lg:text-left pt-4 lg:pt-0">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl shadow-glow">
                            <SunIcon className="h-3 w-3 sm:h-4 sm:w-4 animate-spin-slow" /> 
                            <span>MANGMAT SPECIAL EDITION</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] sm:leading-[0.95] tracking-tighter uppercase italic drop-shadow-3xl">
                            EDUCATION SARTHI <br/>
                            <span className="text-primary not-italic">SCHOOL, MANGMAT.</span> <br/>
                            <span className="text-white/30 text-2xl sm:text-4xl lg:text-5xl lowercase font-hindi not-italic drop-shadow-none block mt-2">Full AI Smart System (No Cost)</span>
                        </h1>

                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm inline-block">
                             <p className="text-sm sm:text-base text-slate-300 font-hindi font-medium flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <span className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-green-500"/> ग्राम मंगमत के लिए समर्पित</span>
                                <span className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4 text-green-500"/> 100% Free AI Labs</span>
                             </p>
                        </div>

                        <p className="text-base sm:text-xl lg:text-2xl text-slate-400 font-hindi max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0 px-2 sm:px-0">
                            मंगमत के हर छात्र को विश्वस्तरीय एआई तकनीक से जोड़ने वाला पहला स्मार्ट स्कूल प्लेटफ़ॉर्म। बिना किसी लागत के शिक्षा में क्रांति।
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
                            <button 
                                onClick={onNavigateToLogin}
                                className="px-8 sm:px-10 py-4 sm:py-5 bg-primary text-slate-950 font-black text-sm sm:text-base rounded-full shadow-[0_20px_50px_-10px_rgba(245,158,11,0.5)] hover:bg-white hover:scale-105 transition-all flex items-center justify-center gap-3 sm:gap-4 uppercase tracking-widest active:scale-95 group"
                            >
                                <RocketLaunchIcon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                                {t('cta_dashboard', 'START MANGMAT DASHBOARD')}
                            </button>
                            
                            <a href="#features" className="px-8 sm:px-10 py-4 sm:py-5 bg-white/5 border border-white/10 text-white font-black text-sm sm:text-base rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest backdrop-blur-md group">
                                <BoltIcon className="h-5 w-5 text-yellow-400 group-hover:text-white transition-colors"/> View System Plan
                            </a>
                        </div>
                    </div>

                    {/* Right Visual Area */}
                    <div className="lg:w-5/12 relative hidden md:block">
                        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-blue-500/10 to-purple-500/20 rounded-full blur-[80px] animate-pulse-slow"></div>
                             
                             {/* Central 3D Floating Element Simulation */}
                             <div className="relative z-10 w-full h-full bg-slate-900/50 backdrop-blur-sm rounded-[3rem] border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-center text-center animate-float">
                                 <div className="w-32 h-32 bg-gradient-to-br from-primary to-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30 mb-8 rotate-12 group hover:rotate-0 transition-transform duration-700">
                                     <BuildingOfficeIcon className="h-16 w-16 text-white" />
                                 </div>
                                 <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Mangmat HQ</h3>
                                 <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">AI Campus Live</p>
                                 
                                 {/* Floating Stats */}
                                 <div className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl animate-float" style={{animationDelay: '1s'}}>
                                     <p className="text-[10px] font-black text-slate-400 uppercase">Local Students</p>
                                     <p className="text-2xl font-black text-slate-900">100%</p>
                                 </div>
                                 <div className="absolute -left-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl animate-float" style={{animationDelay: '2s'}}>
                                     <p className="text-[10px] font-black text-slate-400 uppercase">Cost</p>
                                     <p className="text-2xl font-black text-green-600">ZERO</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#020617] to-transparent z-20"></div>
            
            <style>{`
                @keyframes float { 
                    0%, 100% { transform: translateY(0); } 
                    50% { transform: translateY(-20px); } 
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-spin-slow { animation: spin 12s linear infinite; }
            `}</style>
        </section>
    );
};

export default HeroSection;
