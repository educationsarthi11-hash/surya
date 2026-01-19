
import React, { useEffect, useState, useRef } from 'react';
import { MicrophoneIcon, SparklesIcon, PaperAirplaneIcon, XIcon, BoltIcon } from './icons/AllIcons';
import { useSpeech } from '../hooks/useSpeech';
import { ServiceName } from '../types';

interface VoiceNavigationProps {
    onNavigate: (service: ServiceName | 'overview') => void;
}

// कमांड मैपिंग (Command Mapping for Hindi/English)
const commandMap: { [key: string]: ServiceName } = {
    'admission': 'Smart Admissions',
    'dakhila': 'Smart Admissions',
    'add student': 'Smart Admissions',
    'exam': 'Online Exam',
    'pariksha': 'Online Exam',
    'test': 'Test Paper Guru',
    'paper': 'Test Paper Guru',
    'fee': 'Fee Management',
    'fees': 'Fee Management',
    'paisa': 'Fee Management',
    'attendance': 'Face Attendance',
    'hajiri': 'Face Attendance',
    'attendance log': 'Attendance Log',
    'video': 'AI Video Generator',
    'reels': 'EduReels',
    'library': 'Smart Library',
    'kitab': 'Smart Library',
    'book': 'Smart Library',
    'lab': 'AI Virtual Lab',
    'science': 'AI Virtual Lab',
    'timetable': 'Automated Timetable Generator',
    'schedule': 'Automated Timetable Generator',
    'result': 'Exam Result Portal',
    'marksheet': 'Exam Result Portal',
    'id card': 'Smart Admissions',
    'bus': 'Smart Transport',
    'transport': 'Smart Transport',
    'complaint': 'Grievance Portal',
    'shikayat': 'Grievance Portal',
    'website': 'AI Website Builder',
    'design': 'Smart Design Studio',
    'poster': 'Smart Design Studio',
    'logo': 'Smart Brand Studio',
    'hr': 'Smart HR Manager',
    'salary': 'Smart HR Manager',
    'staff': 'Smart HR Manager',
    'stock': 'Inventory Manager',
    'saman': 'Inventory Manager',
    'career': 'Career Predictor',
    'job': 'Placement Forum',
    'hiring': 'Placement Forum',
    'cv': 'CV Generator',
    'resume': 'CV Generator',
    'quiz': 'Quiz Arena',
    'news': 'Daily Knowledge Shorts',
    'tutor': 'AI Tutor',
    'teacher': 'AI Tutor',
};

const VoiceNavigation: React.FC<VoiceNavigationProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const { isListening, speechInput, toggleListening, setSpeechInput } = useSpeech({ enableSpeechRecognition: true, initialLanguage: 'Hindi' });
    const [feedback, setFeedback] = useState('AI Commander Ready');
    const inputRef = useRef<HTMLInputElement>(null);

    // वॉयस या टेक्स्ट कमांड को प्रोसेस करना
    const processCommand = (cmd: string) => {
        const lowerCmd = cmd.toLowerCase();
        let found = false;

        // 1. Direct Keyword Match
        for (const [key, service] of Object.entries(commandMap)) {
            if (lowerCmd.includes(key)) {
                onNavigate(service);
                setFeedback(`Opening ${service}...`);
                setIsOpen(false); // Close on success
                found = true;
                break;
            }
        }

        // 2. Dashboard/Home check
        if (!found && (lowerCmd.includes('home') || lowerCmd.includes('dashboard') || lowerCmd.includes('main') || lowerCmd.includes('wapas'))) {
            onNavigate('overview');
            setFeedback('Going Home...');
            setIsOpen(false);
            found = true;
        }

        if (!found) {
            setFeedback("Command not recognized. Try 'Fee', 'Exam', 'Admission'...");
        }
        
        // Clear inputs
        setManualInput('');
        setSpeechInput('');
    };

    useEffect(() => {
        if (speechInput) {
            setManualInput(speechInput); // Show what was heard
            setTimeout(() => processCommand(speechInput), 1000); // Auto process voice after 1s
        }
    }, [speechInput]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        processCommand(manualInput);
    };

    return (
        <>
            {/* The Master Button (Floating) */}
            <div className="fixed bottom-6 right-6 z-[160] no-print flex flex-col items-end gap-4">
                
                {/* Expanded Command Center */}
                {isOpen && (
                    <div className="bg-slate-900 p-4 rounded-[2rem] shadow-2xl w-80 sm:w-96 border-4 border-white/20 animate-pop-in mb-2">
                        <div className="flex justify-between items-center mb-4 text-white">
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="h-5 w-5 text-primary animate-pulse"/>
                                <span className="font-bold text-sm uppercase tracking-widest">AI Master Control</span>
                            </div>
                            <button onClick={() => setIsOpen(false)}><XIcon className="h-5 w-5 text-slate-400 hover:text-white"/></button>
                        </div>

                        {feedback && (
                            <div className="bg-black/30 p-2 rounded-xl text-center mb-4 border border-white/5">
                                <p className="text-xs text-primary font-mono">{feedback}</p>
                            </div>
                        )}

                        <form onSubmit={handleManualSubmit} className="relative">
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                                placeholder="Type or Speak command..."
                                className="w-full bg-slate-800 text-white pl-4 pr-12 py-4 rounded-2xl border-2 border-slate-700 focus:border-primary outline-none font-hindi text-lg"
                            />
                            <button 
                                type="submit"
                                className="absolute right-2 top-2 p-2 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"
                            >
                                <PaperAirplaneIcon className="h-5 w-5"/>
                            </button>
                        </form>
                        
                        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {['Admission', 'Fee', 'Exam', 'Transport', 'Library'].map(cmd => (
                                <button key={cmd} onClick={() => processCommand(cmd)} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] text-slate-300 hover:bg-white/20 hover:text-white whitespace-nowrap transition-colors">
                                    {cmd}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group flex items-center justify-center h-16 w-16 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-110 border-4 border-white ${isOpen ? 'bg-slate-800 rotate-45' : isListening ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-indigo-600 to-primary'}`}
                    title="Open AI Commander"
                >
                    {isListening ? (
                        <MicrophoneIcon className="h-8 w-8 text-white" />
                    ) : isOpen ? (
                        <PlusIcon className="h-8 w-8 text-white" /> // Shows 'X' when rotated
                    ) : (
                        <BoltIcon className="h-8 w-8 text-white group-hover:text-slate-950" />
                    )}
                </button>
                
                {/* Quick Mic Button (Only visible when open to toggle voice) */}
                {isOpen && (
                    <button 
                        onClick={toggleListening}
                        className={`absolute bottom-20 right-1 h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
                    >
                        <MicrophoneIcon className="h-6 w-6"/>
                    </button>
                )}
            </div>
        </>
    );
};

// Helper Icon for the button
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export default VoiceNavigation;
