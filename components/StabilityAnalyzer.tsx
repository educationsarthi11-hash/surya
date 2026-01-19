
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import { StarIcon, SparklesIcon, ChartBarIcon, MapPinIcon, HeartIcon, BoltIcon, SignalIcon, ShieldCheckIcon, ClipboardIcon } from './icons/AllIcons';
import Loader from './Loader';

const StabilityAnalyzer: React.FC = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    
    const [formData, setFormData] = useState({
        name: 'Aarav Kumar',
        location: 'Rishi Nagar, Rohtak',
        isLocal: true,
        isMarried: true,
        hasExperience: '2 Years',
        careerGoal: 'Seeking long-term growth and stability'
    });

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const prompt = `
                Act as 'MGM Group Stability Auditor'. Evaluate this candidate for "Executive Stability Index" (Probability of staying 2+ years).
                
                Candidate Profile:
                - Name: ${formData.name}
                - Home Location: ${formData.location} (System Flag: ${formData.isLocal ? 'LOCAL - WITHIN 10KM' : 'OUTSTATION'})
                - Relationship/Social Status: ${formData.isMarried ? 'MARRIED / STABLE HOME' : 'SINGLE / MOBILE'}
                - Reported Experience: ${formData.hasExperience}
                
                Audit Logic:
                1. Local Candidates (within 15km) increase score by 35%.
                2. Married/Home-owning status increases score by 25%.
                3. Historical data shows these factors prevent 'Employee Attrition'.
                
                Return JSON:
                {
                    "score": number (0-100),
                    "verdict": "2-sentence executive summary in Hindi.",
                    "auditPoints": ["Factor 1 analysis", "Factor 2 analysis"],
                    "riskAssessment": "Risk level (Low/Medium/High) with 1 reason."
                }
            `;

            const response = await generateText(prompt, 'gemini-3-pro-preview');
            const data = JSON.parse(response.replace(/```json|```/g, '').trim());
            setResult(data);
            toast.success("Stability Audit Complete!");
        } catch (e) {
            toast.error("Auditor Node Busy.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-pop-in">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b-2 pb-10 border-slate-100">
                <div className="flex items-center gap-8">
                    <div className="bg-amber-500 p-6 rounded-3xl text-slate-950 shadow-2xl shadow-amber-500/20 transform -rotate-3 transition-transform hover:rotate-0">
                        <StarIcon className="h-12 w-12" />
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Stability <span className="text-amber-500">Node</span></h2>
                        <p className="text-xl font-hindi font-bold text-slate-400 mt-1">रिटेंशन और भरोसे का वैज्ञानिक विश्लेषण</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-[2.5rem] border border-slate-100">
                     <div className="flex -space-x-4">
                        {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm"><img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i+10}`}/></div>)}
                     </div>
                     <span className="text-xs font-black text-slate-500 uppercase tracking-widest">1,240 Audits Done</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 {/* Input Column */}
                 <div className="lg:col-span-5 bg-white p-12 rounded-[4.5rem] border-[12px] border-slate-50 shadow-3xl space-y-10">
                     <div className="flex items-center gap-4 mb-4">
                         {/* --- FIXED: Added missing ClipboardIcon to imports --- */}
                         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><ClipboardIcon className="h-6 w-6"/></div>
                         <h3 className="text-2xl font-black uppercase tracking-tight leading-none italic">Audit Input</h3>
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 mb-1">Candidate Full Identity</label>
                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold focus:border-primary outline-none transition-all shadow-inner text-xl" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <button 
                                onClick={() => setFormData({...formData, isLocal: !formData.isLocal})}
                                className={`p-8 rounded-[2.5rem] border-4 transition-all duration-500 flex flex-col items-center gap-4 ${formData.isLocal ? 'border-primary bg-primary/5 text-primary shadow-xl scale-105' : 'border-slate-50 bg-slate-50 text-slate-300 opacity-60'}`}
                            >
                                <MapPinIcon className="h-10 w-10"/>
                                <span className="font-black text-[10px] uppercase tracking-widest">{formData.isLocal ? 'LOCAL NODE' : 'OUTSTATION'}</span>
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, isMarried: !formData.isMarried})}
                                className={`p-8 rounded-[2.5rem] border-4 transition-all duration-500 flex flex-col items-center gap-4 ${formData.isMarried ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-xl scale-105' : 'border-slate-50 bg-slate-50 text-slate-300 opacity-60'}`}
                            >
                                <HeartIcon className="h-10 w-10"/>
                                <span className="font-black text-[10px] uppercase tracking-widest">{formData.isMarried ? 'STABLE CORE' : 'MOBILE CORE'}</span>
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 mb-1">Home Base (Location)</label>
                             <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold focus:border-primary outline-none text-base" />
                        </div>
                     </div>

                     <button 
                        onClick={handleAnalyze} 
                        disabled={loading}
                        className="w-full py-8 bg-slate-950 text-white font-black rounded-[2.5rem] shadow-3xl hover:bg-primary hover:text-slate-950 transition-all transform active:scale-95 flex items-center justify-center gap-6 text-2xl uppercase tracking-tighter disabled:opacity-50"
                    >
                        {loading ? <Loader message="" /> : <><BoltIcon className="h-8 w-8 text-yellow-400"/> RUN AUDIT ENGINE</>}
                    </button>
                 </div>

                 {/* Results Column */}
                 <div className="lg:col-span-7 flex flex-col justify-center">
                    {result ? (
                        <div className="bg-slate-900 p-12 rounded-[5rem] text-white shadow-3xl border-4 border-slate-800 animate-pop-in relative overflow-hidden flex flex-col min-h-[600px]">
                             <div className="absolute top-0 right-0 p-24 bg-primary/10 rounded-full blur-[120px] -mr-16 -mt-16 animate-pulse"></div>
                             
                             <div className="flex justify-between items-start mb-12 relative z-10">
                                 <div>
                                     <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20 mb-3">Audited Score Output</div>
                                     <h4 className="text-9xl font-black tracking-tighter text-white leading-none">{result.score}<span className="text-4xl text-primary opacity-50 ml-2">%</span></h4>
                                 </div>
                                 <div className={`p-6 rounded-[2rem] ${result.score > 80 ? 'bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)]' : 'bg-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.4)]'} text-slate-950 group-hover:scale-110 transition-transform`}>
                                     <ChartBarIcon className="h-12 w-12"/>
                                 </div>
                             </div>
                             
                             <div className="relative z-10 p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl mb-12 shadow-inner">
                                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 flex items-center gap-2"><SparklesIcon className="h-4 w-4"/> AI Executive Verdict</h5>
                                <p className="text-3xl font-hindi font-medium leading-relaxed text-slate-100 italic">"{result.verdict}"</p>
                             </div>

                             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-auto">
                                <div className="space-y-4">
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Positive Audit Points</p>
                                     <ul className="space-y-3">
                                         {result.auditPoints?.map((r: string, i: number) => (
                                             <li key={i} className="flex gap-3 items-center text-sm font-bold text-green-400">
                                                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                                                 {r}
                                             </li>
                                         ))}
                                     </ul>
                                </div>
                                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-center">
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Risk Rating</p>
                                     <div className="flex items-center gap-3">
                                          <span className={`text-2xl font-black uppercase tracking-tighter ${result.riskAssessment.includes('Low') ? 'text-green-400' : 'text-red-400'}`}>{result.riskAssessment.split(' ')[0]} RISK</span>
                                          <ShieldCheckIcon className={`h-6 w-6 ${result.riskAssessment.includes('Low') ? 'text-green-400' : 'text-red-400'}`}/>
                                     </div>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center py-40 bg-white/30 rounded-[5rem] border-8 border-dashed border-slate-100 flex flex-col items-center justify-center group">
                            <StarIcon className="h-40 w-40 mb-10 text-slate-100 group-hover:scale-110 group-hover:text-amber-100 transition-all duration-1000"/>
                            <p className="font-black text-3xl uppercase tracking-[0.2em] text-slate-300">Awaiting Profile Stream...</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default StabilityAnalyzer;
