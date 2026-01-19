
import React, { useState, useEffect } from 'react';
import { BoltIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, ArrowRightIcon, ArrowPathIcon } from './icons/AllIcons';
import { generateText } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useClassroom } from '../contexts/ClassroomContext';

interface Question {
    id: number;
    question: string;
    options: string[];
    answer: string;
}

const QuizArena: React.FC = () => {
    const toast = useToast();
    const { selectedClass } = useClassroom();
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [gameState, setGameState] = useState<'setup' | 'playing' | 'results'>('setup');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Audio effects (simulated)
    const playSound = (type: 'correct' | 'wrong' | 'tick') => {
        // In a real app, use Audio() API
    };

    const startGame = async () => {
        if (!topic.trim()) {
            toast.error("Please enter a topic for the battle!");
            return;
        }
        setLoading(true);
        try {
            const prompt = `Generate 5 multiple-choice questions on "${topic}" for a ${selectedClass} student level (${difficulty}). 
            Format as JSON array of objects: [{ "id": 1, "question": "...", "options": ["A", "B", "C", "D"], "answer": "Correct Option String" }]`;
            
            const text = await generateText(prompt, 'gemini-2.5-flash');
            const json = JSON.parse(text.replace(/```json|```/g, '').trim());
            
            if (Array.isArray(json)) {
                setQuestions(json);
                setGameState('playing');
                setCurrentQIndex(0);
                setScore(0);
                setAiScore(0);
                setTimeLeft(15);
                setIsAnswered(false);
                setSelectedOption(null);
            } else {
                throw new Error("Invalid format");
            }
        } catch (e) {
            toast.error("Failed to start battle. Try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let timer: number;
        if (gameState === 'playing' && timeLeft > 0 && !isAnswered) {
            timer = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isAnswered) {
            handleTimeUp();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, isAnswered]);

    const handleTimeUp = () => {
        handleAnswer(null); // Treat as wrong/skipped
    };

    const handleAnswer = (option: string | null) => {
        setIsAnswered(true);
        setSelectedOption(option);
        
        const currentQ = questions[currentQIndex];
        const isCorrect = option === currentQ.answer;
        
        if (isCorrect) {
            setScore(prev => prev + 10 + Math.ceil(timeLeft / 2)); // Bonus for speed
            playSound('correct');
        } else {
            playSound('wrong');
        }

        // AI Turn Simulation
        // AI has a probability to answer correctly based on difficulty
        const aiChance = difficulty === 'Easy' ? 0.6 : difficulty === 'Medium' ? 0.8 : 0.95;
        if (Math.random() < aiChance) {
            setAiScore(prev => prev + 10 + Math.floor(Math.random() * 5));
        }

        setTimeout(() => {
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
                setTimeLeft(15);
                setIsAnswered(false);
                setSelectedOption(null);
            } else {
                setGameState('results');
            }
        }, 2000);
    };

    const renderSetup = () => (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-pop-in">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse-slow">
                <BoltIcon className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2">Quiz Battle Arena</h2>
            <p className="text-slate-500 mb-8 font-hindi">AI के खिलाफ ज्ञान का युद्ध लड़ें!</p>
            
            <div className="w-full max-w-md space-y-4">
                <input 
                    type="text" 
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Enter Topic (e.g. Solar System, Algebra)"
                    className="w-full p-4 text-center text-lg border-2 border-slate-200 rounded-2xl focus:border-orange-500 focus:ring-0 transition-all"
                />
                
                <div className="grid grid-cols-3 gap-2">
                    {['Easy', 'Medium', 'Hard'].map(level => (
                        <button 
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`py-2 rounded-xl font-bold text-sm transition-all ${difficulty === level ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={startGame}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-xl rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                    {loading ? <Loader message="Preparing Arena..." /> : <>BATTLE START <BoltIcon className="h-6 w-6"/></>}
                </button>
            </div>
        </div>
    );

    const renderPlaying = () => {
        const currentQ = questions[currentQIndex];
        return (
            <div className="h-full flex flex-col p-6 animate-pop-in max-w-3xl mx-auto">
                {/* HUD */}
                <div className="flex justify-between items-center mb-8 bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <p className="text-xs text-slate-400 uppercase font-bold">You</p>
                        <p className="text-2xl font-black text-green-400">{score}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`text-2xl font-black font-mono ${timeLeft < 5 ? 'text-red-500 animate-ping' : 'text-white'}`}>{timeLeft}s</div>
                        <div className="text-[10px] text-slate-400">Round {currentQIndex + 1}/5</div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-slate-400 uppercase font-bold">AI Bot</p>
                        <p className="text-2xl font-black text-red-400">{aiScore}</p>
                    </div>
                </div>

                {/* Question */}
                <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-8 leading-tight">{currentQ.question}</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQ.options.map((opt, idx) => {
                            let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50";
                            if (isAnswered) {
                                if (opt === currentQ.answer) btnClass = "bg-green-500 border-green-600 text-white shadow-md scale-[1.02]";
                                else if (opt === selectedOption) btnClass = "bg-red-500 border-red-600 text-white opacity-80";
                                else btnClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-50";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => !isAnswered && handleAnswer(opt)}
                                    disabled={isAnswered}
                                    className={`p-6 rounded-2xl font-bold text-lg transition-all duration-300 transform ${btnClass}`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        const won = score > aiScore;
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-pop-in bg-[url('https://www.transparenttextures.com/patterns/confetti.png')]">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl ${won ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <TrophyIcon className="h-16 w-16" />
                </div>
                
                <h2 className="text-5xl font-black text-slate-900 mb-2">{won ? "VICTORY!" : "DEFEAT"}</h2>
                <p className="text-xl text-slate-600 font-medium mb-8">
                    {won ? "You outsmarted the AI!" : "The AI was too strong this time."}
                </p>

                <div className="flex gap-8 mb-10">
                    <div className="text-center">
                        <p className="text-sm text-slate-500 uppercase font-bold">Your Score</p>
                        <p className="text-4xl font-black text-green-600">{score}</p>
                    </div>
                    <div className="w-px bg-slate-300"></div>
                    <div className="text-center">
                        <p className="text-sm text-slate-500 uppercase font-bold">AI Score</p>
                        <p className="text-4xl font-black text-red-600">{aiScore}</p>
                    </div>
                </div>

                <button 
                    onClick={() => setGameState('setup')}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-transform hover:scale-105 flex items-center gap-2"
                >
                    <ArrowPathIcon className="h-5 w-5"/> Play Again
                </button>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl h-[600px] border-4 border-slate-100 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600"></div>
            {gameState === 'setup' && renderSetup()}
            {gameState === 'playing' && renderPlaying()}
            {gameState === 'results' && renderResults()}
        </div>
    );
};

export default QuizArena;
