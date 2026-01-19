
import React, { useState, useEffect } from 'react';
import { generateText } from '../services/geminiService';
import { SparklesIcon, ArrowPathIcon, GlobeAltIcon } from './icons/AllIcons';
import Loader from './Loader';
import { useClassroom } from '../contexts/ClassroomContext';

const DailyNews: React.FC = () => {
    const { selectedClass } = useClassroom();
    const [news, setNews] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    const fetchNews = async () => {
        setLoading(true);
        try {
            const prompt = `
                You are a friendly storyteller for ${selectedClass} students and their parents.
                Generate 5 interesting, super simple "Knowledge Shorts" (GK).
                
                LANGUAGE: Simple Hinglish (Mix of Hindi and English).
                STYLE: Avoid hard words. Use words that common people use.
                CONTENT:
                - If Class is small: Fun animal facts, space facts.
                - If Class is big: General knowledge about India, new science inventions.
                
                Format: Return ONLY a JSON array of 5 strings.
                Example: ["हाथी के कान बहुत बड़े होते हैं पर वो बहुत धीरे सुनता है।", "..."]
            `;
            
            const response = await generateText(prompt);
            const jsonStr = response.replace(/```json|```/g, '').trim();
            try {
                const parsed = JSON.parse(jsonStr);
                if (Array.isArray(parsed)) {
                    setNews(parsed);
                } else {
                    setNews(["डाटा लोड करने में समस्या आई।"]);
                }
            } catch (e) {
                setNews(response.split('\n').filter(line => line.length > 5).slice(0, 5));
            }
        } catch (e) {
            setNews(["कृपया इंटरनेट चेक करें।"]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [selectedClass]);

    return (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-soft h-full min-h-[500px] flex flex-col border border-slate-100">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                        <GlobeAltIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Daily Knowledge</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedClass} Edition • {date}</p>
                    </div>
                </div>
                <button onClick={fetchNews} className="p-3 hover:bg-slate-50 rounded-full transition-all active:scale-90" title="Refresh">
                    <ArrowPathIcon className={`h-6 w-6 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader message="AI सार्थी ज्ञान बटोर रहा है..." />
                </div>
            ) : (
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {news.map((item, index) => (
                        <div key={index} className="group relative bg-slate-50 border border-slate-100 rounded-3xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-primary text-xs shadow-sm group-hover:scale-110 transition-transform">
                                    {index + 1}
                                </div>
                                <p className="flex-1 text-slate-700 font-hindi text-lg font-medium leading-relaxed">
                                    {item.replace(/^[0-9]+\.\s*/, '')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DailyNews;
