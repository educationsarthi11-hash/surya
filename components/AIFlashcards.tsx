
import React, { useState, useEffect, useRef } from 'react';
import { generateText } from '../services/geminiService';
import { SparklesIcon, RectangleStackIcon, ArrowRightIcon, ArrowLeftIcon, CheckCircleIcon, ArrowPathIcon } from './icons/AllIcons';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';
import { Type, GoogleGenAI } from '@google/genai';

interface Flashcard {
    front: string;
    back: string;
}

const AIFlashcards: React.FC = () => {
    const toast = useToast();
    const [topic, setTopic] = useState('');
    const [numCards, setNumCards] = useState(10);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error("Please enter a topic.");
            return;
        }
        setLoading(true);
        setFlashcards([]);
        
        try {
            const prompt = `
                Generate ${numCards} study flashcards on the topic '${topic}'. 
                The 'front' should contain a key term, question, or concept. 
                The 'back' should contain the definition, answer, or explanation.
                Ensure the content is accurate and educational.
            `;

            const schema = {
                type: Type.OBJECT,
                properties: {
                    cards: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                front: { type: Type.STRING, description: "The question or term on the front of the card." },
                                back: { type: Type.STRING, description: "The answer or definition on the back of the card." }
                            },
                            required: ["front", "back"]
                        }
                    }
                },
                required: ["cards"]
            };

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            // Fixed: Updated to use recommended gemini-3-flash-preview for basic text tasks.
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema
                }
            });

            const jsonStr = response.text?.trim();
            if (jsonStr) {
                const result = JSON.parse(jsonStr);
                if (result.cards && Array.isArray(result.cards) && result.cards.length > 0) {
                    setFlashcards(result.cards);
                    setIsSessionActive(true);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    toast.success("Flashcards generated!");
                } else {
                    throw new Error("Invalid response format");
                }
            } else {
                throw new Error("No response text");
            }

        } catch (e) {
            console.error("Flashcard generation failed", e);
            toast.error("Could not generate flashcards. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150); // Slight delay for flip reset visual
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
        }
    };

    const handleReset = () => {
        setIsSessionActive(false);
        setFlashcards([]);
        setTopic('');
    };

    if (!isSessionActive) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col items-center justify-center text-center animate-pop-in">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                    <RectangleStackIcon className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Flashcard Hero</h2>
                <p className="text-slate-500 mb-8 max-w-md">Master any subject quickly. Enter a topic, and AI will create a custom deck of flashcards for you to practice.</p>
                
                <div className="w-full max-w-md space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Topic (विषय)</label>
                        <input 
                            type="text" 
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)} 
                            placeholder="e.g., Periodic Table, French Vocabulary, Java Syntax"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Number of Cards</label>
                        <select 
                            value={numCards} 
                            onChange={(e) => setNumCards(Number(e.target.value))}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value={5}>5 Cards</option>
                            <option value={10}>10 Cards</option>
                            <option value={15}>15 Cards</option>
                            <option value={20}>20 Cards</option>
                        </select>
                    </div>
                    <button 
                        onClick={handleGenerate} 
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transform transition-transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader message="Generating Deck..." /> : <><SparklesIcon className="h-5 w-5"/> Generate Flashcards</>}
                    </button>
                </div>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    // FIX: Guard clause to prevent crash if currentCard is undefined
    if (!currentCard) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col items-center justify-center">
                 <Loader message="Loading card..." />
                 <button onClick={handleReset} className="mt-4 text-sm text-red-500 hover:underline">Reset</button>
            </div>
        );
    }

    const progress = ((currentIndex + 1) / flashcards.length) * 100;

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col animate-pop-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={handleReset} className="p-2 hover:bg-slate-100 rounded-full text-slate-500" title="Back to Setup">
                        <ArrowLeftIcon className="h-5 w-5"/>
                    </button>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{topic}</h3>
                        <p className="text-xs text-slate-500">Card {currentIndex + 1} of {flashcards.length}</p>
                    </div>
                </div>
                <button onClick={handleGenerate} disabled={loading} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    <ArrowPathIcon className="h-4 w-4"/> Regenerate
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Card Area */}
            <div className="flex-1 flex flex-col items-center justify-center perspective-1000">
                <div 
                    className="relative w-full max-w-lg aspect-[3/2] cursor-pointer group"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ perspective: '1000px' }}
                >
                    <div 
                        className={`w-full h-full transition-all duration-500 transform-style-3d relative shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden border-2 border-blue-400/50">
                            <span className="absolute top-4 left-4 text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">Question</span>
                            <p className="text-2xl sm:text-3xl font-bold text-center leading-relaxed">{currentCard.front}</p>
                            <p className="absolute bottom-4 text-sm opacity-70 animate-bounce">Tap to flip</p>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 w-full h-full bg-white text-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 border-2 border-slate-200">
                            <span className="absolute top-4 left-4 text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wider">Answer</span>
                            <p className="text-xl sm:text-2xl font-medium text-center leading-relaxed">{currentCard.back}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex justify-center items-center gap-6">
                <button 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                >
                    <ArrowLeftIcon className="h-6 w-6"/>
                </button>
                
                <div className="font-mono font-bold text-slate-400">
                    {currentIndex + 1} / {flashcards.length}
                </div>

                <button 
                    onClick={handleNext} 
                    disabled={currentIndex === flashcards.length - 1}
                    className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-30 transition-colors shadow-lg shadow-blue-500/30"
                >
                    <ArrowRightIcon className="h-6 w-6"/>
                </button>
            </div>
            
            {currentIndex === flashcards.length - 1 && isFlipped && (
                <div className="text-center mt-4 animate-fade-in-up">
                    <p className="text-green-600 font-bold flex items-center justify-center gap-2"><CheckCircleIcon className="h-5 w-5"/> Deck Completed!</p>
                    <button onClick={handleReset} className="mt-2 text-sm underline text-slate-500 hover:text-slate-700">Start New Topic</button>
                </div>
            )}

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

export default AIFlashcards;
