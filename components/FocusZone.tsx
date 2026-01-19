
import React, { useState, useEffect, useRef } from 'react';
import { ClockIcon, PlayIcon, StopCircleIcon, ArrowPathIcon, SpeakerWaveIcon, CheckCircleIcon, SparklesIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const AMBIENT_SOUNDS = [
    { id: 'rain', name: 'Rainfall', icon: '🌧️', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3' },
    { id: 'forest', name: 'Forest Birds', icon: '🐦', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
    { id: 'cafe', name: 'Library/Cafe', icon: '☕', url: 'https://assets.mixkit.co/sfx/preview/mixkit-restaurant-crowd-talking-ambience-444.mp3' },
    { id: 'white', name: 'White Noise', icon: '📻', url: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-loop-2987.mp3' },
];

const FocusZone: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [isWorkSession, setIsWorkSession] = useState(true);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [volume, setVolume] = useState(0.5);
    const [tasks, setTasks] = useState<{id: number, text: string, completed: boolean}[]>([]);
    const [newTask, setNewTask] = useState('');
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<number | null>(null);
    const toast = useToast();

    // Timer Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);
            
            if (isWorkSession) {
                toast.success("Focus session complete! Take a break.");
                setTimeLeft(5 * 60); // 5 min break
            } else {
                toast.info("Break over! Back to work.");
                setTimeLeft(25 * 60); // 25 min work
            }
            setIsWorkSession(!isWorkSession);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, isWorkSession]);

    // Audio Logic
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (activeSound && isActive) {
                audioRef.current.play().catch(e => console.log("Audio play failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [activeSound, isActive, volume]);

    const toggleTimer = () => {
        setIsActive(!isActive);
        if (!isActive && activeSound && audioRef.current) {
            audioRef.current.play();
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsWorkSession(true);
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleSoundSelect = (soundUrl: string) => {
        if (activeSound === soundUrl) {
            setActiveSound(null); 
        } else {
            setActiveSound(soundUrl);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col lg:flex-row gap-8">
            <audio ref={audioRef} src={activeSound || ''} loop />
            
            {/* Left: Timer & Ambience */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white p-8 relative overflow-hidden shadow-2xl">
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30 transition-all duration-1000 ${isActive ? 'scale-150 opacity-50' : 'scale-100'}`}></div>
                
                <div className="relative z-10 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider">
                        {isWorkSession ? '🔥 Deep Focus Mode' : '☕ Break Time'}
                    </div>
                    
                    <div className="text-[8rem] font-black font-mono leading-none tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                        {formatTime(timeLeft)}
                    </div>
                    
                    <div className="flex gap-6 justify-center mb-12">
                        <button 
                            onClick={toggleTimer}
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-110 ${isActive ? 'bg-red-500 text-white' : 'bg-green-50 text-white'}`}
                        >
                            {isActive ? <StopCircleIcon className="h-8 w-8"/> : <PlayIcon className="h-8 w-8 ml-1"/>}
                        </button>
                        <button onClick={resetTimer} className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors">
                            <ArrowPathIcon className="h-6 w-6"/>
                        </button>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-xl backdrop-blur-md border border-white/5">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center justify-center gap-2">
                            <SpeakerWaveIcon className="h-3 w-3"/> Ambient Sound
                        </p>
                        <div className="flex gap-4 justify-center mb-4">
                            {AMBIENT_SOUNDS.map(sound => (
                                <button 
                                    key={sound.id}
                                    onClick={() => handleSoundSelect(sound.url)}
                                    className={`p-3 rounded-lg transition-all ${activeSound === sound.url ? 'bg-indigo-500 text-white scale-110 shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                                    title={sound.name}
                                >
                                    <span className="text-xl">{sound.icon}</span>
                                </button>
                            ))}
                        </div>
                        {activeSound && (
                            <input 
                                type="range" 
                                min="0" max="1" step="0.05" 
                                value={volume} 
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Task List */}
            <div className="lg:w-1/3 bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <SparklesIcon className="h-6 w-6 text-primary"/>
                    <h3 className="text-xl font-bold text-slate-800">Session Goals</h3>
                </div>
                
                <form onSubmit={addTask} className="flex gap-2 mb-6">
                    <input 
                        type="text" 
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What are you working on?" 
                        className="flex-1 p-3 rounded-lg border-none shadow-sm focus:ring-2 focus:ring-primary bg-white"
                    />
                    <button type="submit" className="bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800">
                        <PlayIcon className="h-5 w-5"/>
                    </button>
                </form>
                
                <div className="flex-1 overflow-y-auto space-y-3">
                    {tasks.map(task => (
                        <div 
                            key={task.id} 
                            onClick={() => toggleTask(task.id)}
                            className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${task.completed ? 'bg-green-50 border border-green-100 opacity-60' : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                {task.completed && <CheckCircleIcon className="h-4 w-4 text-white"/>}
                            </div>
                            <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-700'}`}>{task.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FocusZone;
