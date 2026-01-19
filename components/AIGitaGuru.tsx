
import React, { useState, useEffect } from 'react';
import { getGitaVerse } from '../services/geminiService';
import { GitaVerse } from '../types';
import Loader from './Loader';
import { BookOpenIcon, SparklesIcon, ArrowPathIcon } from './icons/AllIcons';

const AIGitaGuru: React.FC = () => {
    const [verse, setVerse] = useState<GitaVerse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchVerse = async () => {
        setLoading(true);
        try {
            const data = await getGitaVerse();
            setVerse(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerse();
    }, []);

    return (
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-amber-800">
                    <BookOpenIcon className="h-6 w-6" />
                    <h3 className="font-bold text-lg">Gita Wisdom</h3>
                </div>
                <button onClick={fetchVerse} className="p-2 hover:bg-amber-100 rounded-full transition-colors text-amber-700">
                    <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader message="Seeking wisdom..." />
                </div>
            ) : verse ? (
                <div className="flex-1 flex flex-col justify-center text-center animate-pop-in">
                    <div className="mb-4">
                        <SparklesIcon className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-xl font-bold text-slate-800 font-hindi leading-relaxed">
                            "{verse.shloka}"
                        </p>
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                        <p className="text-sm text-slate-700 font-hindi font-medium mb-2">
                            {verse.hindi_explanation}
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            {verse.english_explanation}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center text-amber-700">
                    Wisdom is loading...
                </div>
            )}
        </div>
    );
};

export default AIGitaGuru;
