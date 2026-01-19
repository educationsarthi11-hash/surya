
import React, { useState, useEffect } from 'react';
import { SparklesIcon, CalculatorIcon, BookOpenIcon, PlayIcon, SpeakerWaveIcon, StopCircleIcon, BoltIcon, TrophyIcon, ArrowRightIcon } from './icons/AllIcons';
import { generateText } from '../services/geminiService';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';
import { useSpeech } from '../hooks/useSpeech';

const VedicMathLab: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'learn' | 'race'>('learn');
    const [trick, setTrick] = useState<string | null>(null);
    const [raceStatus, setRaceStatus] = useState<'idle' | 'running' | 'finished'>('idle');
    const [problem, setProblem] = useState({ q: '', a: 0 });
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(0);
    
    const toast = useToast();
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    const getNewTrick = async () => {
        setLoading(true);
        try {
            const prompt = `Generate a unique Vedic Math trick for students. Explain it in simple Hindi (Devanagari). Format as clean HTML. Start with 'BETA...'`;
            const result = await generateText(prompt, 'gemini-3-flash-preview');
            setTrick(result);
        } catch (e) { toast.error("AI is busy."); }
        finally { setLoading(false); }
    };

    const startRace = () => {
        setMode('race');
        setRaceStatus('running');
        setScore(0);
        setTimer(30);
        generateProblem();
    };

    const generateProblem = () => {
        const a = Math.floor(Math.random() * 90) + 10;
        const b = Math.floor(Math.random() * 90) + 10;
        setProblem({ q: `${a} x ${b}`, a: a * b });
        setUserAnswer('');
    };

    useEffect(() => {
        let interval: any;
        if (raceStatus === 'running' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && raceStatus === 'running') {
            setRaceStatus('finished');
            toast.success(`Game Over! Your Score: ${score}`);
        }
        return () => clearInterval(interval);
    }, [raceStatus, timer]);

    const checkAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(userAnswer) === problem.a) {
            setScore(s => s + 10);
            generateProblem();
            toast.success("+10 Points!");
        } else {
            toast.error("Try again!");
        }
    };

    return (
        <div className="p-8 h-full bg-[#fffdf7] space-y-8 overflow-y-auto custom-scrollbar animate-pop-in">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-4 rounded-3xl text-amber-700 shadow-sm border border-amber-200">
                        <CalculatorIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vedic Math Lab</h2>
                        <p className="text-sm text-amber-600 font-hindi font-bold uppercase tracking-widest">Calculations faster than light</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button onClick={() => setMode('learn')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${mode === 'learn' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}>LEARN TRICKS</button>
                    <button onClick={() => setMode('race')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${mode === 'race' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}>SPEED RACE</button>
                </div>
            </div>

            {mode === 'learn' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border-2 border-amber-100 shadow-xl space-y-6 flex flex-col justify-center">
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Learn Magic Tricks</h3>
                        <p className="text-slate-500 font-hindi text-lg">AI सार्थी आपको प्राचीन भारतीय गणित की वो जादुई ट्रिक्स सिखाएगा जिनसे आप बड़े से बड़े सवाल चुटकियों में हल कर लेंगे।</p>
                        <button onClick={getNewTrick} disabled={loading} className="w-full py-6 bg-primary text-white font-black rounded-3xl shadow-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3">
                            {loading ? <Loader message="" /> : <><SparklesIcon className="h-6 w-6 text-yellow-300"/> Get Magic Trick</>}
                        </button>
                    </div>
                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl min-h-[400px] flex items-center justify-center">
                        {trick ? <div className="prose prose-invert font-hindi text-xl" dangerouslySetInnerHTML={{ __html: trick }} /> : <p className="opacity-40 uppercase font-black text-2xl">Ready for Wisdom?</p>}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-12 rounded-[4rem] border-4 border-amber-100 shadow-2xl flex flex-col items-center text-center">
                    {raceStatus === 'idle' ? (
                        <div className="space-y-8 py-10">
                            <BoltIcon className="h-20 w-20 text-orange-500 mx-auto animate-pulse" />
                            <h3 className="text-4xl font-black uppercase">Are you faster than AI?</h3>
                            <button onClick={startRace} className="px-12 py-5 bg-primary text-white font-black rounded-[2rem] shadow-2xl hover:scale-105 transition-all text-xl">START RACE 🏁</button>
                        </div>
                    ) : raceStatus === 'running' ? (
                        <div className="w-full max-w-lg space-y-10">
                            <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-3xl">
                                <div><p className="text-[10px] font-black opacity-60">SCORE</p><p className="text-3xl font-black text-green-400">{score}</p></div>
                                <div className="text-center w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center"><p className="text-3xl font-black">{timer}s</p></div>
                                <div><p className="text-[10px] font-black opacity-60">LEVEL</p><p className="text-3xl font-black text-blue-400">Pro</p></div>
                            </div>
                            <div className="py-10"><p className="text-6xl font-black text-slate-900 tracking-tighter">{problem.q} = ?</p></div>
                            <form onSubmit={checkAnswer} className="flex gap-4">
                                <input autoFocus value={userAnswer} onChange={e => setUserAnswer(e.target.value)} type="number" placeholder="Type Answer..." className="flex-1 p-6 bg-slate-50 border-4 border-slate-100 rounded-3xl font-black text-4xl text-center outline-none focus:border-primary shadow-inner" />
                                <button type="submit" className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl"><ArrowRightIcon className="h-10 w-10"/></button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8 py-10 animate-pop-in">
                            <TrophyIcon className="h-24 w-24 text-yellow-500 mx-auto" />
                            <h3 className="text-5xl font-black">GAME OVER</h3>
                            <p className="text-3xl font-bold text-primary">Final Score: {score}</p>
                            <button onClick={startRace} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl">PLAY AGAIN</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VedicMathLab;
