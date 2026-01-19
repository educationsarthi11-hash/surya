
import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PlayIcon, StopCircleIcon, ClockIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const tracks = [
    { id: 1, title: 'Exam Focus (एकाग्रता)', duration: '5 Min', audio: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3', color: 'from-blue-400 to-indigo-500' },
    { id: 2, title: 'Stress Relief (तनाव मुक्ति)', duration: '10 Min', audio: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3', color: 'from-green-400 to-emerald-500' },
    { id: 3, title: 'Deep Sleep (गहरी नींद)', duration: '15 Min', audio: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-loop-2987.mp3', color: 'from-purple-400 to-pink-500' },
];

const MeditationStudio: React.FC = () => {
    const [activeTrack, setActiveTrack] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const toast = useToast();

    useEffect(() => {
        let interval: any;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            setActiveTrack(null);
            toast.success("Meditation Session Complete! Well done.");
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);

    const playTrack = (track: any) => {
        if (activeTrack === track.id && isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            setActiveTrack(track.id);
            setIsPlaying(true);
            setTimeLeft(parseInt(track.duration) * 60);
            // Simulate audio play (In real app, bind audioRef src)
            // audioRef.current.src = track.audio; 
            // audioRef.current.play();
            toast.info(`Starting ${track.title}... Breathe deeply.`);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-soft h-full min-h-[500px] flex flex-col relative overflow-hidden border border-slate-100">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            
            <div className="text-center mb-10 relative z-10">
                <div className="inline-block p-4 bg-purple-100 rounded-full text-purple-600 mb-4 animate-float">
                    <SparklesIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">ध्यान कक्ष (Mindfulness)</h2>
                <p className="text-slate-500 font-hindi mt-2">परीक्षा के तनाव को दूर करें और एकाग्रता बढ़ाएं</p>
            </div>

            {activeTrack && (
                <div className="mb-8 bg-slate-900 rounded-[2.5rem] p-8 text-center text-white shadow-2xl animate-pop-in relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Session Active</p>
                    <h3 className="text-6xl font-mono font-black mb-6">{formatTime(timeLeft)}</h3>
                    <div className="flex justify-center gap-2">
                        <div className="w-1 h-8 bg-green-400 rounded-full animate-wave"></div>
                        <div className="w-1 h-6 bg-green-400 rounded-full animate-wave [animation-delay:0.1s]"></div>
                        <div className="w-1 h-8 bg-green-400 rounded-full animate-wave [animation-delay:0.2s]"></div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tracks.map(track => (
                    <button 
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={`p-6 rounded-[2rem] text-left transition-all group relative overflow-hidden ${activeTrack === track.id ? 'ring-4 ring-offset-2 ring-purple-400 scale-105' : 'hover:-translate-y-1 hover:shadow-xl'}`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-90 transition-opacity group-hover:opacity-100`}></div>
                        <div className="relative z-10 text-white">
                            <div className="flex justify-between items-start mb-8">
                                <span className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                                    {activeTrack === track.id && isPlaying ? <StopCircleIcon className="h-6 w-6"/> : <PlayIcon className="h-6 w-6"/>}
                                </span>
                                <span className="text-xs font-bold bg-black/20 px-2 py-1 rounded flex items-center gap-1">
                                    <ClockIcon className="h-3 w-3"/> {track.duration}
                                </span>
                            </div>
                            <h4 className="text-xl font-black font-hindi">{track.title}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Audio Guide</p>
                        </div>
                    </button>
                ))}
            </div>
            
            {/* Hidden audio element for future implementation */}
            <audio ref={audioRef} loop />
        </div>
    );
};

export default MeditationStudio;
