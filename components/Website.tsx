
import React from 'react';
import Header from './Header';
import HeroSection from './website/HeroSection';
import FranchiseHero from './website/FranchiseHero';
import FeaturesSection from './website/FeaturesSection';
import Footer from './website/Footer';
import ProgramsSection from './website/ProgramsSection';
import ContactSection from './website/ContactSection';
import PricingPage from './PricingPage';
import RoadmapSection from './website/RoadmapSection';
import ProspectusSection from './website/ProspectusSection';
import AICareerDiscovery from './website/AICareerDiscovery';
import { SparklesIcon, ArrowRightIcon, WhatsAppIcon, BriefcaseIcon, BuildingOfficeIcon } from './icons/AllIcons';

interface WebsiteProps {
    onNavigateToLogin: (target?: string) => void;
    onNavigateToAdmission: () => void;
}

const Website: React.FC<WebsiteProps> = ({ onNavigateToLogin, onNavigateToAdmission }) => {
    return (
        <div className="bg-[#fffdf7] text-slate-900 overflow-x-hidden selection:bg-primary selection:text-white font-sans scroll-smooth">
            <Header onNavigateToLogin={onNavigateToLogin} onNavigateToAdmission={onNavigateToAdmission} />
            
            <main className="relative flex flex-col">
                <HeroSection onNavigateToLogin={() => onNavigateToLogin()} />
                
                {/* --- REPAIRED: Sticky Corporate Bar (Optimized for Mobile) --- */}
                {/* z-index lowered slightly to stay behind main Header (z-100) but above content */}
                <div className="sticky top-16 sm:top-20 z-40 w-full bg-slate-900/95 backdrop-blur-md py-3 sm:py-4 border-y border-white/10 shadow-2xl transition-all">
                    <div className="container mx-auto px-4 sm:px-6 flex flex-row items-center justify-between gap-3">
                        
                        {/* Left Side: Label */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center animate-pulse shrink-0">
                                <SparklesIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white"/>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-white font-hindi text-xs sm:text-lg font-bold leading-tight truncate">
                                    कॉर्पोरेट पोर्टल <span className="hidden sm:inline">- Enterprise</span>
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-primary-light font-black uppercase tracking-widest truncate">Hiring Active</p>
                            </div>
                        </div>

                        {/* Right Side: Actions (Compact on Mobile) */}
                        <div className="flex gap-2 sm:gap-4 shrink-0">
                            <button 
                                onClick={() => onNavigateToLogin('corporate')}
                                className="px-3 sm:px-8 py-2 sm:py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest flex items-center gap-2 active:scale-95 text-[9px] sm:text-xs"
                            >
                                <BriefcaseIcon className="h-3 w-3 sm:h-4 sm:w-4"/> 
                                <span className="hidden sm:inline">RECRUITER</span> LOGIN
                            </button>
                            <button 
                                onClick={() => onNavigateToLogin()}
                                className="px-4 sm:px-10 py-2 sm:py-3 bg-primary text-slate-950 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-white transition-all uppercase tracking-widest flex items-center gap-2 active:scale-95 text-[9px] sm:text-xs"
                            >
                                <span className="hidden sm:inline">ADMIN</span> PORTAL <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4"/>
                            </button>
                        </div>
                    </div>
                </div>

                <FeaturesSection />
                
                {/* AI Discovery Section */}
                <AICareerDiscovery />

                <ProspectusSection />
                <ProgramsSection />
                <FranchiseHero onNavigateToLogin={() => onNavigateToLogin()} />

                <div id="pricing" className="py-24 sm:py-32 bg-slate-50">
                     <div className="container mx-auto px-4 sm:px-6">
                        <PricingPage />
                     </div>
                </div>

                <RoadmapSection />
                <div className="bg-white relative z-10">
                    <ContactSection />
                </div>
            </main>

            {/* Fixed Floating Action Button - Positioned safely above mobile browser bars */}
            <div className="fixed bottom-6 right-4 sm:bottom-10 sm:right-10 z-[110] flex flex-col gap-4 no-print">
                <a 
                    href="https://wa.me/919817776765?text=I%20want%20to%20know%20more%20about%20MGM%20Corporate%20Hiring" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-white hover:border-green-100"
                    title="Chat on WhatsApp"
                >
                    <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                    <span className="absolute right-full mr-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Help Chat
                    </span>
                </a>
            </div>

            <Footer />
        </div>
    );
};

export default Website;
