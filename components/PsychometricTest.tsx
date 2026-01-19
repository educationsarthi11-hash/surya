
import React, { useState } from 'react';
import { analyzePsychometricResults } from '../services/geminiService';
import { BrainIcon, SparklesIcon, ArrowRightIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const questions = [
    "I prefer working with machines/tools over people.",
    "I enjoy solving logic puzzles and math problems.",
    "I love creative activities like painting or writing.",
    "I am good at convincing people or selling ideas.",
    "I like helping others and social work."
];

const PsychometricTest: React.FC = () => {
    const toast = useToast();
    const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill('Neutral'));
    const [result, setResult] = useState<{ stream: string, career: string, personality: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleOptionChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await analyzePsychometricResults(answers);
            setResult(res);
            toast.success("Analysis Complete!");
        } catch (e) {
            toast.error("Failed to analyze.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[500px]">
            <div className="flex items-center mb-6">
                <BrainIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Psychometric Career Test</h2>
                    <p className="text-sm text-neutral-500 font-hindi">वैज्ञानिक करियर चयन (Stream Selector)</p>
                </div>
            </div>

            {!result ? (
                <div className="space-y-6 max-w-2xl mx-auto">
                    {questions.map((q, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded-lg border">
                            <p className="font-medium text-slate-800 mb-3">{i + 1}. {q}</p>
                            <div className="flex gap-4">
                                {['Disagree', 'Neutral', 'Agree'].map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name={`q${i}`} 
                                            checked={answers[i] === opt} 
                                            onChange={() => handleOptionChange(i, opt)}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-sm text-slate-600">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader message="Analyzing Brain Type..." /> : "Analyze My Profile"}
                    </button>
                </div>
            ) : (
                <div className="max-w-2xl mx-auto animate-pop-in text-center">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl mb-6">
                        <p className="text-purple-200 text-sm uppercase font-bold tracking-wider mb-2">Recommended Stream</p>
                        <h3 className="text-4xl font-black">{result.stream}</h3>
                        <p className="mt-4 text-lg font-medium bg-white/20 p-2 rounded-lg inline-block">{result.career}</p>
                    </div>
                    <div className="bg-white border p-6 rounded-xl text-left">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <SparklesIcon className="h-5 w-5 text-purple-600"/> Personality Analysis
                        </h4>
                        <p className="text-slate-600 leading-relaxed">{result.personality}</p>
                    </div>
                    <button onClick={() => setResult(null)} className="mt-6 text-purple-600 font-bold hover:underline">Retake Test</button>
                </div>
            )}
        </div>
    );
};

export default PsychometricTest;
