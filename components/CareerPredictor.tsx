
import React, { useState } from 'react';
import { analyzeMarketGap, generateText } from '../services/geminiService';
import { SparklesIcon, ChartBarIcon, StarIcon, AcademicCapIcon, BriefcaseIcon, WrenchScrewdriverIcon, ArrowTrendingUpIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

interface PredictionResult {
    primaryCareer: string;
    secondaryCareer: string;
    matchScore: number;
    analysis: string;
    suggestedPath: string[];
    skillGaps: { skill: string, howToLearn: string }[];
}

const CareerPredictor: React.FC = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [marketTrend, setMarketTrend] = useState<{ trend: string, demand: string } | null>(null);

    const [formData, setFormData] = useState({
        strongestSubjects: 'Mathematics, Physics',
        weakestSubjects: 'History, Biology',
        hobbies: 'Coding, Chess, Solving Puzzles',
        personality: 'Introverted, Logical, Detail-Oriented',
        dream: 'To build something that changes the world'
    });

    const handlePredict = async () => {
        if (!formData.strongestSubjects || !formData.hobbies) {
            toast.error("कृपया मुख्य जानकारी भरें।");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const prompt = `
                Act as a highly advanced Scientific Career Counselor AI.
                Profile:
                - Subjects: ${formData.strongestSubjects} (Strong), ${formData.weakestSubjects} (Weak)
                - Hobbies: ${formData.hobbies}
                - Traits: ${formData.personality}
                
                Generate a JSON object:
                {
                    "primaryCareer": "Career Title",
                    "secondaryCareer": "Alternative",
                    "matchScore": number,
                    "analysis": "2-sentence scientific reason in Hindi.",
                    "suggestedPath": ["Step 1", "Step 2", "Step 3"],
                    "skillGaps": [{"skill": "Skill Name", "howToLearn": "Action in Hindi"}]
                }
            `;

            const response = await generateText(prompt, 'gemini-3-pro-preview');
            const data = JSON.parse(response.replace(/```json|```/g, '').trim());
            setResult(data);
            
            // Parallel Fetch Market Trend
            const trend = await analyzeMarketGap(data.primaryCareer);
            setMarketTrend(trend);
            
            toast.success("भविष्यवाणी तैयार है!");
        } catch (error) {
            toast.error("Failed to generate prediction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fffdf7] p-8 rounded-[4rem] shadow-soft flex flex-col items-center border border-slate-100 min-h-[800px]">
            <div className="text-center mb-12">
                <div className="inline-block p-5 bg-indigo-100 rounded-[2.5rem] text-indigo-600 mb-6 shadow-inner animate-float relative">
                    <StarIcon className="h-14 w-14" />
                    <SparklesIcon className="h-6 w-6 absolute top-2 right-2 text-yellow-500 animate-pulse"/>
                </div>
                <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter uppercase">AI Career Prophet</h2>
                <p className="text-xl text-slate-500 font-hindi font-medium">
                    वैज्ञानिक डेटा और मार्केट ट्रेंड्स के आधार पर आपके भविष्य की भविष्यवाणी
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl">
                <div className="space-y-6">
                    <div className="bg-white p-10 rounded-[3.5rem] border-4 border-slate-50 shadow-xl">
                        <h3 className="font-black text-2xl text-slate-800 mb-8 flex items-center gap-4 uppercase tracking-tighter">
                            <ChartBarIcon className="h-7 w-7 text-primary"/> Student Profile
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-2">Strongest Subjects</label>
                                <input type="text" value={formData.strongestSubjects} onChange={e => setFormData({...formData, strongestSubjects: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-3xl text-sm font-bold outline-none transition-all shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-2">Hobbies & Interests</label>
                                <textarea value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} rows={2} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-3xl text-sm font-bold outline-none transition-all shadow-inner" />
                            </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-2">Big Dream?</label>
                                <input type="text" value={formData.dream} onChange={e => setFormData({...formData, dream: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-3xl text-sm font-bold outline-none transition-all shadow-inner" />
                            </div>
                        </div>

                        <button 
                            onClick={handlePredict}
                            disabled={loading}
                            className="w-full mt-12 py-6 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-primary transition-all transform active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 text-xl tracking-widest"
                        >
                            {loading ? <Loader message="Analyzing Destiny..." /> : <><SparklesIcon className="h-6 w-6 text-yellow-300"/> REVEAL MY FUTURE</>}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    {!result && !loading && (
                        <div className="text-center text-slate-300 p-20 border-8 border-dashed border-slate-50 rounded-[5rem] flex flex-col items-center justify-center bg-white/50">
                            <AcademicCapIcon className="h-24 w-24 mb-8 opacity-10"/>
                            <p className="font-black text-3xl uppercase tracking-tighter text-slate-400">Your future path <br/> awaits discovery</p>
                        </div>
                    )}

                    {result && (
                        <div className="animate-pop-in space-y-8 pb-10">
                            <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden border-b-[12px] border-primary">
                                <div className="absolute top-0 right-0 p-16 bg-primary/20 rounded-full blur-[100px] -mr-10 -mt-10 animate-pulse"></div>
                                
                                <div className="flex justify-between items-start relative z-10 mb-8">
                                    <div>
                                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2">High Confidence Match</p>
                                        <h3 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none">{result.primaryCareer}</h3>
                                    </div>
                                    <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-inner">
                                        <span className="text-xs font-black text-slate-400 uppercase">Score</span>
                                        <span className="text-4xl font-black text-green-400">{result.matchScore}%</span>
                                    </div>
                                </div>
                                
                                <div className="relative z-10 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <p className="text-lg font-hindi leading-relaxed text-slate-300 italic">"{result.analysis}"</p>
                                </div>
                            </div>

                            {marketTrend && (
                                <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl animate-slide-in-right">
                                     <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2"><ArrowTrendingUpIcon className="h-5 w-5"/> Market Demand (2025-30)</h4>
                                        <span className="bg-white text-indigo-700 px-4 py-1 rounded-full font-black text-[10px]">{marketTrend.demand} DEMAND</span>
                                     </div>
                                     <p className="text-indigo-50 font-hindi text-lg">{marketTrend.trend}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 shadow-lg">
                                    <h4 className="font-black text-xs text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <SparklesIcon className="h-5 w-5 text-primary"/> Roadmap to Success
                                    </h4>
                                    <ul className="space-y-4">
                                        {result.suggestedPath.map((step, idx) => (
                                            <li key={idx} className="flex gap-4 items-start text-slate-700">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">{idx + 1}</div>
                                                <span className="font-bold text-sm font-hindi leading-tight">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-orange-50 p-8 rounded-[3rem] border-4 border-orange-100 shadow-lg">
                                    <h4 className="font-black text-xs text-orange-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        <WrenchScrewdriverIcon className="h-5 w-5"/> Skill Gaps Identified
                                    </h4>
                                    <div className="space-y-6">
                                        {result.skillGaps?.map((gap, idx) => (
                                            <div key={idx} className="group">
                                                <p className="text-xs font-black text-orange-900 uppercase tracking-widest">{gap.skill}</p>
                                                <div className="mt-2 p-3 bg-white rounded-2xl border border-orange-100 text-[11px] font-hindi font-bold text-orange-700 leading-relaxed shadow-sm group-hover:shadow-md transition-all">
                                                    {gap.howToLearn}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerPredictor;
