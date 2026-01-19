
import React, { useState } from 'react';
import { SpeakerWaveIcon, StopCircleIcon, SparklesIcon } from './icons/AllIcons';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpeech } from '../hooks/useSpeech';

const GlobalReader: React.FC = () => {
    const { language } = useLanguage();
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ 
        initialLanguage: language === 'hi' ? 'Hindi' : 'English',
        initialVoice: 'Kore'
    });
    
    const handleReadPage = () => {
        if (isSpeaking) {
            stopAudio();
            return;
        }

        const mainContent = document.querySelector('main');
        if (mainContent) {
            const textNodes = mainContent.querySelectorAll('h1, h2, h3, h4, p, li, td');
            let textToRead = language === 'hi' ? "नमस्ते। मैं इस पेज को पढ़ रहा हूँ। " : "Hello. Reading the current page. ";
            
            textNodes.forEach(node => {
                if (node.textContent && node.textContent.length > 3) {
                    textToRead += node.textContent.trim() + ". ";
                }
            });

            playAudio(textToRead.substring(0, 3000), 999); 
        }
    };

    return (
        <div className="fixed bottom-24 left-6 z-[100] no-print">
            <div className="relative group">
                {/* Outer Glow Effect */}
                {!isSpeaking && (
                    <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping scale-150"></div>
                )}
                
                <button
                    onClick={handleReadPage}
                    className={`relative flex items-center gap-3 h-16 px-6 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.2)] border-4 border-white transition-all duration-500 hover:scale-110 active:scale-95 z-10 ${isSpeaking ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white'}`}
                    title="Suno (Listen to Page)"
                >
                    <div className={`p-2 rounded-full ${isSpeaking ? 'bg-white/20' : 'bg-primary/20'}`}>
                        {isSpeaking ? <StopCircleIcon className="h-7 w-7" /> : <SpeakerWaveIcon className="h-7 w-7" />}
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{language === 'hi' ? 'सुविधा' : 'VOICE'}</span>
                        <span className="text-sm font-black font-hindi">{isSpeaking ? (language === 'hi' ? 'रुकें' : 'STOP') : (language === 'hi' ? 'पेज सुनें' : 'LISTEN')}</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default GlobalReader;
