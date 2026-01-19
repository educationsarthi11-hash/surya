
import React, { useState, useEffect, useRef } from 'react';
import { generateSpeech, getOutputAudioContext } from '../services/geminiService';
import { PlayIcon, StopCircleIcon, SpeakerWaveIcon, GlobeAltIcon, SparklesIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const MOCK_NEWS = [
    "Good Morning, Students! This is your Campus Radio.",
    "Today's top story: The Annual Science Fair registration closes tomorrow. Don't miss out!",
    "In global news: India successfully launches a new solar observatory mission.",
    "Sports update: The Inter-School Cricket tournament begins this Saturday.",
    "Word of the day is 'Resilience' - the capacity to recover quickly from difficulties.",
    "Stay curious and keep learning. Have a wonderful day!"
];

const CampusRadio: React.FC = () => {
    const toast = useToast();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [visualizerHeight, setVisualizerHeight] = useState<number[]>(new Array(10).fill(20));
    
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Simple visualizer simulation
    useEffect(() => {
        if (isPlaying) {
            const animate = () => {
                setVisualizerHeight(prev => prev.map(() => Math.random() * 40 + 10));
                animationFrameRef.current = requestAnimationFrame(animate);
            };
            animate();
        } else {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            setVisualizerHeight(new Array(10).fill(10));
        }
        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    }, [isPlaying]);

    const stopAudio = () => {
        if (audioSourceRef.current) {
            try { audioSourceRef.current.stop(); } catch (e) {}
            audioSourceRef.current = null;
        }
        setIsPlaying(false);
    };

    const playNextTrack = async () => {
        if (currentTrackIndex >= MOCK_NEWS.length) {
            setCurrentTrackIndex(0);
            setIsPlaying(false);
            return;
        }

        setIsLoading(true);
        try {
            // Resume context if needed
            const ctx = getOutputAudioContext();
            if (ctx.state === 'suspended') await ctx.resume();
            
            const text = MOCK_NEWS[currentTrackIndex];
            // Use a distinct 'Radio Host' voice if available, or generic
            const source = await generateSpeech(text, 'Charon'); 
            
            audioSourceRef.current = source;
            setIsPlaying(true);
            setIsLoading(false);

            source.onended = () => {
                setCurrentTrackIndex(prev => prev + 1);
                // Auto play next
                // Note: In a real React effect chain, we'd handle this via state dependency, 
                // but for this demo component, we'll trigger the next play via a small timeout to let state settle
                // Or we rely on the user to press play again if we want to save tokens. 
                // Let's stop after one segment for token safety in demo.
                setIsPlaying(false); 
            };
        } catch (error) {
            console.error(error);
            toast.error("Radio signal lost. Try again.");
            setIsPlaying(false);
            setIsLoading(false);
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            stopAudio();
        } else {
            playNextTrack();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft border border-slate-100 h-full min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Retro Radio Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 text-center w-full max-w-md">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-orange-500/30 ring-8 ring-white">
                    {isLoading ? (
                        <Loader message="" />
                    ) : (
                        <SpeakerWaveIcon className={`h-16 w-16 text-white ${isPlaying ? 'animate-pulse' : ''}`} />
                    )}
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-2">Campus Radio</h2>
                <p className="text-slate-500 font-hindi mb-8">Daily News & Updates (AI Voice)</p>

                {/* Visualizer */}
                <div className="flex justify-center items-end gap-1 h-16 mb-8">
                    {visualizerHeight.map((h, i) => (
                        <div 
                            key={i} 
                            className="w-2 bg-indigo-500 rounded-full transition-all duration-100 ease-in-out" 
                            style={{ height: `${h}px`, opacity: isPlaying ? 1 : 0.3 }}
                        ></div>
                    ))}
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8">
                    <p className="text-sm font-medium text-slate-700">
                        {isPlaying ? MOCK_NEWS[currentTrackIndex] : "Press Play to start today's broadcast."}
                    </p>
                </div>

                <div className="flex justify-center gap-6">
                    <button 
                        onClick={togglePlay}
                        disabled={isLoading}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transform transition-transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                        {isPlaying ? <><StopCircleIcon className="h-6 w-6"/> Stop Broadcast</> : <><PlayIcon className="h-6 w-6"/> Tune In</>}
                    </button>
                </div>
                
                <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
                    <GlobeAltIcon className="h-3 w-3"/> Powered by Google Gemini TTS
                </p>
            </div>
        </div>
    );
};

export default CampusRadio;
