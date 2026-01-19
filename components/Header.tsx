
import React, { useState, useEffect } from 'react';
import { MenuIcon, EduSarthiLogo, KeyIcon, BriefcaseIcon } from './icons/AllIcons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import LocalizationModal from './LocalizationModal';

interface HeaderProps {
    onNavigateToLogin: (target?: string) => void; 
    onNavigateToAdmission: () => void; 
}

const Header: React.FC<HeaderProps> = ({ onNavigateToLogin }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);
    
    const { logoUrl, institutionName, slogan } = useAppConfig();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? 'py-2 bg-slate-950/95 backdrop-blur-2xl shadow-xl border-b border-white/5' : 'py-6 bg-transparent'}`}>
                <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
                    
                    <a href="#home" className="flex items-center gap-3 group">
                        <div className="w-14 h-14 bg-white p-1 rounded-full shadow-lg border-2 border-primary/50 flex items-center justify-center overflow-hidden">
                            {logoUrl ? (
                                <img src={logoUrl} className="max-h-full max-w-full object-contain" alt="Logo" />
                            ) : (
                                <EduSarthiLogo className="w-full h-full text-primary scale-125" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black tracking-tighter text-white leading-none uppercase italic">SURYA <span className="text-primary">EDUCATION</span></h1>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">{slogan || "SARTHI SMART SYSTEM"}</span>
                        </div>
                    </a>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => onNavigateToLogin('corporate')} 
                            className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95 border border-indigo-400/30"
                        >
                            <BriefcaseIcon className="h-4 w-4" />
                            <span>RECRUITER ACCESS</span>
                        </button>

                        <button 
                            onClick={() => onNavigateToLogin()} 
                            className="bg-primary text-slate-950 px-8 py-4 rounded-2xl font-black text-[11px] shadow-2xl hover:bg-white transition-all flex items-center gap-3 uppercase tracking-[0.2em] active:scale-95 border-b-4 border-amber-700"
                        >
                            <KeyIcon className="h-5 w-5" />
                            <span>ADMIN PORTAL</span>
                        </button>

                        <button className="lg:hidden p-2 text-white" onClick={() => onNavigateToLogin()}>
                            <MenuIcon className="h-7 w-7" />
                        </button>
                    </div>
                </div>
            </header>
            <LocalizationModal isOpen={isLocalModalOpen} onClose={() => setIsLocalModalOpen(false)} />
        </>
    );
};

export default Header;
