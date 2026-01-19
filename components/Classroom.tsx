
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import LiveClass from './LiveClass';
import { 
    BookOpenIcon, GlobeAltIcon, 
    PencilSquareIcon, MicrophoneIcon, CheckCircleIcon,
    ChatBubbleIcon, UserCircleIcon, FaceSmileIcon,
    UsersIcon, ShieldCheckIcon, CpuChipIcon, SparklesIcon,
    SignalIcon, ArrowLeftIcon, CalculatorIcon, BeakerIcon, 
    ScaleIcon, ChartBarIcon, DocumentTextIcon, BugAntIcon,
    HeartIcon, BoltIcon, BriefcaseIcon, ClipboardDocumentCheckIcon
} from './icons/AllIcons';
import { useClassroom } from '../contexts/ClassroomContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getSubjectsForClass } from '../config/classroomData';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useToast } from '../hooks/useToast';

const languages = [
    { code: 'Hinglish', label: 'Hinglish', native: 'Mixed' },
    { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'Haryanvi', label: 'Haryanvi', native: 'देसी' },
    { code: 'English', label: 'English', native: 'Eng' },
];

// Helper to map string icon name to component
const getIconComponent = (iconName: string) => {
    switch (iconName) {
        case 'CalculatorIcon': return <CalculatorIcon className="h-8 w-8" />;
        case 'BeakerIcon': return <BeakerIcon className="h-8 w-8" />;
        case 'BookOpenIcon': return <BookOpenIcon className="h-8 w-8" />;
        case 'GlobeAltIcon': return <GlobeAltIcon className="h-8 w-8" />;
        case 'CpuChipIcon': return <CpuChipIcon className="h-8 w-8" />;
        case 'SparklesIcon': return <SparklesIcon className="h-8 w-8" />;
        case 'PencilSquareIcon': return <PencilSquareIcon className="h-8 w-8" />;
        case 'ChartBarIcon': return <ChartBarIcon className="h-8 w-8" />;
        case 'ScaleIcon': return <ScaleIcon className="h-8 w-8" />;
        case 'DocumentTextIcon': return <DocumentTextIcon className="h-8 w-8" />;
        case 'HeartIcon': return <HeartIcon className="h-8 w-8" />;
        case 'BugAntIcon': return <BugAntIcon className="h-8 w-8" />;
        case 'BoltIcon': return <BoltIcon className="h-8 w-8" />;
        case 'BriefcaseIcon': return <BriefcaseIcon className="h-8 w-8" />;
        case 'ClipboardDocumentCheckIcon': return <ClipboardDocumentCheckIcon className="h-8 w-8" />;
        case 'UserCircleIcon': return <UserCircleIcon className="h-8 w-8" />;
        default: return <BookOpenIcon className="h-8 w-8" />;
    }
};

const Classroom: React.FC = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const { selectedClass, subject } = useClassroom();
    const { institutionName } = useAppConfig();
    const toast = useToast();
    
    const [localSubject, setLocalSubject] = useState(subject);
    const [topic, setTopic] = useState('');
    const [teachingLanguage, setTeachingLanguage] = useState('Hinglish');
    const [teacherPersona, setTeacherPersona] = useState<'Male' | 'Female' | 'Robot'>('Robot');

    // Future Tech State
    const [systemReady, setSystemReady] = useState(false);

    useEffect(() => {
        setLocalSubject(subject);
        setTimeout(() => setSystemReady(true), 500); // Intro animation
    }, [subject]);
    
    const dynamicSubjects = useMemo(() => getSubjectsForClass(selectedClass), [selectedClass]);

    const visualAidPromptGenerator = useCallback((text: string) => {
        return `Generate a futuristic, high-tech holographic educational illustration for: "${text.substring(0, 300)}". Style: 3D Render, Neon highlights, Black background, HUD overlay elements.`;
    }, [selectedClass]);

    const systemInstruction = `
        You are 'AI Sarthi 3000', a futuristic holographic teacher for ${selectedClass}.
        Current Mode: ${teacherPersona}. Language: ${teachingLanguage}.
        Explain concepts using futuristic analogies (e.g. comparing cells to nanobots).
        If the student asks to "Visualize", provide detailed visual descriptions.
    `;

    if (isSessionActive) {
        return (
            <div className="h-screen w-full bg-black fixed inset-0 z-[100] animate-pop-in flex flex-col">
                <LiveClass 
                    systemInstruction={systemInstruction}
                    onEnd={() => setIsSessionActive(false)}
                    sessionTitle={`NEURAL LINK: ${localSubject}`}
                    visualAidPromptGenerator={visualAidPromptGenerator}
                    languageName={teachingLanguage}
                    voiceName={teacherPersona === 'Female' ? 'Kore' : 'Puck'}
                    isRobot={teacherPersona === 'Robot'}
                />
            </div>
        );
    }

    return (
        <div className={`p-6 sm:p-10 h-full bg-black/80 backdrop-blur-xl rounded-[3rem] overflow-y-auto custom-scrollbar relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-opacity duration-1000 ${systemReady ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Holographic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                
                {/* HUD Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.5em]">System Online</span>
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                            Holo<span className="text-cyan-400">Deck</span>
                        </h2>
                        <p className="text-slate-400 font-hindi mt-2 text-lg">भविष्य की कक्षा में आपका स्वागत है।</p>
                    </div>
                    
                    {/* Status Monitor */}
                    <div className="flex gap-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">CPU Load</p>
                            <div className="flex items-end gap-1 h-8">
                                <div className="w-2 bg-cyan-500/50 h-full rounded-sm animate-pulse"></div>
                                <div className="w-2 bg-cyan-500/50 h-3/4 rounded-sm"></div>
                                <div className="w-2 bg-cyan-500/50 h-1/2 rounded-sm"></div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-center min-w-[100px]">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">User</p>
                            <p className="text-xl font-black text-white">READY</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Configuration Console */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Subject Selection Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {dynamicSubjects.map(s => (
                                <button 
                                    key={s.name}
                                    onClick={() => setLocalSubject(s.name)}
                                    className={`group relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col items-center justify-center text-center ${localSubject === s.name ? 'bg-cyan-900/30 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    {localSubject === s.name && <div className="absolute inset-0 bg-cyan-400/10 animate-pulse"></div>}
                                    
                                    <div className={`mb-3 ${localSubject === s.name ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`}>
                                        {getIconComponent(s.icon)}
                                    </div>

                                    <h4 className={`text-lg font-black uppercase tracking-tight relative z-10 ${localSubject === s.name ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'}`}>{s.name}</h4>
                                    <p className="text-[12px] font-hindi text-slate-500 relative z-10 mt-1 font-bold group-hover:text-cyan-200">{s.hindi}</p>
                                </button>
                            ))}
                        </div>

                        {/* Interactive Input */}
                        <div className="bg-slate-900/50 border border-white/10 p-1 rounded-[2.5rem] flex items-center shadow-2xl relative group focus-within:border-cyan-500/50 transition-colors">
                            <div className="absolute inset-0 bg-cyan-500/5 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                            <div className="h-14 w-14 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg relative z-10">
                                <SparklesIcon className="h-6 w-6 animate-spin-slow"/>
                            </div>
                            <input 
                                type="text" 
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                placeholder="Enter Topic Protocol (e.g. Quantum Physics)..."
                                className="bg-transparent border-none w-full text-white placeholder:text-slate-600 focus:ring-0 font-bold text-lg px-6 relative z-10 h-16"
                            />
                        </div>

                        {/* Controls Row */}
                        <div className="flex flex-wrap gap-4">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => setTeachingLanguage(lang.code)}
                                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${teachingLanguage === lang.code ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'}`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Avatar & Launch */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-gradient-to-b from-slate-800 to-black rounded-[3rem] p-1 border border-white/10 relative overflow-hidden group">
                            {/* Scanning Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_#06b6d4] z-20 animate-scan opacity-50"></div>
                            
                            <div className="p-8 flex flex-col items-center text-center relative z-10">
                                <div className="w-32 h-32 rounded-full border-4 border-cyan-500/30 flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <CpuChipIcon className="h-16 w-16 text-cyan-300"/>
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-1">AI ROBOT</h3>
                                <p className="text-[10px] text-cyan-400 font-mono">STATUS: ONLINE</p>
                                
                                <div className="mt-8 w-full bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                                        <span>Knowledge Base</span>
                                        <span>100%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-400 w-full shadow-[0_0_10px_#06b6d4]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsSessionActive(true)}
                            className="w-full py-8 bg-cyan-500 text-black font-black rounded-[2.5rem] shadow-[0_0_60px_rgba(6,182,212,0.4)] hover:bg-white hover:shadow-[0_0_80px_rgba(255,255,255,0.6)] transition-all text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4 group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                INITIATE LINK <ArrowLeftIcon className="h-6 w-6 rotate-180 group-hover:translate-x-2 transition-transform"/>
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Classroom;
