
import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, CheckCircleIcon, XIcon, EyeIcon, SunIcon, MoonIcon, SparklesIcon } from './icons/AllIcons';

const THEME_VERSION = '4.0-AQUA-GLASS'; 

const themes = [
    { 
        name: 'Aqua Water (Pani)', 
        primary: '#06b6d4', // Cyan-500
        light: '#67e8f9',   // Cyan-300
        dark: '#0891b2',    // Cyan-600
        secondary: '#3b82f6', // Blue-500
        accent: '#22d3ee',    // Cyan-400
        bgGradient: 'linear-gradient(-45deg, #0f172a, #0e7490, #0891b2, #164e63)'
    },
    { 
        name: 'Suryanshu Gold', 
        primary: '#f59e0b', 
        light: '#fcd34d',   
        dark: '#b45309',    
        secondary: '#1e3a8a', 
        accent: '#fbbf24',
        bgGradient: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 70%)'
    },
    { 
        name: 'Deep Ocean', 
        primary: '#3b82f6', 
        light: '#60a5fa', 
        dark: '#1e3a8a',
        secondary: '#06b6d4', 
        accent: '#93c5fd',
        bgGradient: 'linear-gradient(to bottom right, #0f172a, #1e3a8a)'
    },
    { 
        name: 'Nature (Green)', 
        primary: '#10b981', 
        light: '#34d399', 
        dark: '#047857',
        secondary: '#059669',
        accent: '#6ee7b7',
        bgGradient: 'linear-gradient(to bottom right, #064e3b, #065f46)'
    },
];

export const ThemeCustomizer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTheme, setActiveTheme] = useState('Aqua Water (Pani)');
    const [zenMode, setZenMode] = useState(false);
    const [eyeComfort, setEyeComfort] = useState(false);

    useEffect(() => {
        const savedVersion = localStorage.getItem('theme_version');
        const savedTheme = localStorage.getItem('app-theme');
        
        let themeToApply = themes[0]; // Default to Aqua

        if (savedVersion === THEME_VERSION && savedTheme) {
             const foundTheme = themes.find(t => t.name === savedTheme);
             if (foundTheme) themeToApply = foundTheme;
        } else {
            // Force update to Aqua on new version
            localStorage.setItem('theme_version', THEME_VERSION);
            themeToApply = themes[0]; 
        }

        applyTheme(themeToApply);
        
        const savedZen = localStorage.getItem('app-zen');
        const savedEye = localStorage.getItem('app-eye-comfort');
        if (savedZen === 'true') toggleZenMode(true);
        if (savedEye === 'true') toggleEyeComfort(true);

    }, []);

    const applyTheme = (theme: typeof themes[0]) => {
        document.documentElement.style.setProperty('--color-primary', theme.primary);
        document.documentElement.style.setProperty('--color-primary-light', theme.light);
        document.documentElement.style.setProperty('--color-primary-dark', theme.dark);
        document.documentElement.style.setProperty('--color-secondary', theme.secondary);
        document.documentElement.style.setProperty('--color-accent', theme.accent);
        
        // Update Body Background
        document.body.style.background = theme.bgGradient;
        document.body.style.backgroundSize = '400% 400%';
        
        setActiveTheme(theme.name);
        localStorage.setItem('app-theme', theme.name);
    };

    const toggleZenMode = (forceState?: boolean) => {
        const newState = forceState !== undefined ? forceState : !zenMode;
        setZenMode(newState);
        if (newState) {
            document.documentElement.classList.add('zen-mode');
        } else {
            document.documentElement.classList.remove('zen-mode');
        }
        localStorage.setItem('app-zen', String(newState));
    };

    const toggleEyeComfort = (forceState?: boolean) => {
        const newState = forceState !== undefined ? forceState : !eyeComfort;
        setEyeComfort(newState);
        if (newState) {
            document.body.style.filter = 'sepia(0.3) contrast(0.9) brightness(0.95)';
        } else {
            document.body.style.filter = '';
        }
        localStorage.setItem('app-eye-comfort', String(newState));
    };

    return (
        <div className={`fixed top-24 right-0 z-[60] flex items-start transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} no-print`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/20 backdrop-blur-md text-white p-3 rounded-l-2xl shadow-lg border border-white/20 hover:bg-white/30 transition-colors mt-4 flex flex-col gap-2 items-center"
                title="Theme Settings"
            >
                {isOpen ? <XIcon className="h-6 w-6" /> : <SparklesIcon className="h-6 w-6 animate-pulse" />}
            </button>
            
            <div className="bg-white/80 backdrop-blur-xl border-l border-white/40 w-80 h-auto max-h-[80vh] overflow-y-auto shadow-2xl p-6 rounded-bl-3xl">
                <h3 className="font-black text-slate-800 text-lg mb-4 uppercase tracking-wider flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-primary"/> Visual Theme
                </h3>
                
                <div className="space-y-3 mb-6">
                    {themes.map(theme => (
                        <button
                            key={theme.name}
                            onClick={() => applyTheme(theme)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${activeTheme === theme.name ? 'border-primary bg-primary/10 shadow-inner' : 'border-transparent bg-white/50 hover:bg-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full shadow-md border-2 border-white" style={{ background: theme.bgGradient }}></div>
                                <span className="text-sm font-bold text-slate-800">{theme.name}</span>
                            </div>
                            {activeTheme === theme.name && <CheckCircleIcon className="h-5 w-5 text-primary" />}
                        </button>
                    ))}
                </div>
                
                <div className="border-t border-slate-200/50 pt-4 space-y-3">
                    <h4 className="font-bold text-slate-700 text-xs uppercase tracking-widest mb-2">Display Modes</h4>
                    
                    <button 
                        onClick={() => toggleZenMode()}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${zenMode ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white/50 border-transparent hover:bg-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <EyeIcon className="h-5 w-5" />
                            <span className="text-sm font-bold">Zen Focus</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${zenMode ? 'bg-green-500' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${zenMode ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    </button>

                    <button 
                        onClick={() => toggleEyeComfort()}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${eyeComfort ? 'bg-amber-100 border-amber-500 text-amber-900' : 'bg-white/50 border-transparent hover:bg-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            {eyeComfort ? <MoonIcon className="h-5 w-5"/> : <SunIcon className="h-5 w-5"/>}
                            <span className="text-sm font-bold">Eye Comfort</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${eyeComfort ? 'bg-amber-500' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${eyeComfort ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
