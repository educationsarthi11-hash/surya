
import React, { useState } from 'react';
import { ChartBarIcon, SparklesIcon, UsersIcon, MapPinIcon, HeartIcon, ShieldCheckIcon, SignalIcon, CheckCircleIcon, StarIcon, BoltIcon } from './icons/AllIcons';

const AuthorityDashboard777: React.FC = () => {
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

    const mockCandidates = [
        { 
            id: 1, name: 'Aman Deep', age: 22, location: 'Rohtak (5km)', status: 'Married', stability: 94, 
            longevity: 'EXCELLENT', distanceFactor: 'OPTIMAL (5km)', 
            dna: ['Local Roots', 'Technical Proficiency', 'High Patience Index'] 
        },
        { 
            id: 2, name: 'Sahil Verma', age: 24, location: 'Delhi (65km)', status: 'Single', stability: 62, 
            longevity: 'MODERATE', distanceFactor: 'RISKY (Long Commute)',
            dna: ['Fast Learner', 'Highly Ambitious', 'Willing to Travel'] 
        },
        { 
            id: 3, name: 'Preeti Singh', age: 25, location: 'Rohtak (2km)', status: 'Married', stability: 98, 
            longevity: 'SUPREME', distanceFactor: 'NEIGHBORHOOD (2km)',
            dna: ['Punctual', 'Stable Family Base', 'Leadership Quality'] 
        }
    ];

    return (
        <div className="h-full flex flex-col space-y-8 animate-pop-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">777 <span className="text-primary">AUTHORITY</span></h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                        <SignalIcon className="h-4 w-4 text-green-500 animate-pulse"/> Corporate Candidate Intelligence v5.0
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-950 p-6 rounded-[2.5rem] text-white text-center shadow-xl border-b-4 border-primary">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Elite Pipeline</p>
                         <p className="text-3xl font-black italic">482 <span className="text-xs text-primary">Pre-Trained Assets</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
                {/* Candidates List */}
                <div className="lg:col-span-4 bg-slate-50 p-8 rounded-[3.5rem] border border-slate-100 shadow-inner overflow-y-auto custom-scrollbar">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Ready for Deployment</h3>
                     <div className="space-y-4">
                        {mockCandidates.map(c => (
                            <button 
                                key={c.id} 
                                onClick={() => setSelectedCandidate(c)}
                                className={`w-full p-6 rounded-[2.5rem] border-2 text-left transition-all ${selectedCandidate?.id === c.id ? 'bg-white border-primary shadow-xl scale-[1.03]' : 'bg-white border-transparent hover:border-slate-200 opacity-80'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-black text-slate-800 text-xl uppercase tracking-tight">{c.name}</p>
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full ${c.stability > 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{c.stability}% STABLE</span>
                                </div>
                                <div className="flex items-center gap-3 mt-4">
                                     <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase"><MapPinIcon className="h-3 w-3"/> {c.location}</div>
                                     <div className="w-px h-2 bg-slate-200"></div>
                                     <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase"><HeartIcon className="h-3 w-3"/> {c.status}</div>
                                </div>
                            </button>
                        ))}
                     </div>
                </div>

                {/* Analysis Area */}
                <div className="lg:col-span-8">
                     {selectedCandidate ? (
                         <div className="bg-white p-12 rounded-[5rem] border-4 border-slate-50 shadow-3xl h-full flex flex-col animate-pop-in relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-5"><SparklesIcon className="h-48 w-48"/></div>
                             
                             <div className="flex justify-between items-start mb-12 relative z-10 border-b pb-8 border-slate-100">
                                 <div>
                                     <h3 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">{selectedCandidate.name}</h3>
                                     <p className="text-primary font-black text-xs uppercase tracking-[0.5em] mt-3">Advanced Behavioral Profile</p>
                                 </div>
                                 <div className="bg-slate-950 p-6 rounded-3xl text-center shadow-2xl border-b-4 border-primary group">
                                      <p className="text-[10px] font-black text-slate-500 uppercase">Hiring Rank</p>
                                      <p className="text-4xl font-black text-white italic group-hover:scale-110 transition-transform">#1</p>
                                 </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                 {/* DNA Block */}
                                 <div className="space-y-8">
                                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3"><StarIcon className="h-5 w-5 text-primary"/> Candidate DNA</h4>
                                     <div className="space-y-4">
                                         {selectedCandidate.dna.map((tag: string) => (
                                             <div key={tag} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-5 group hover:bg-white hover:shadow-xl transition-all">
                                                  <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:bg-primary transition-all"><CheckCircleIcon className="h-6 w-6 text-green-500 group-hover:text-slate-950"/></div>
                                                  <span className="font-black text-slate-700 text-sm uppercase tracking-wide">{tag}</span>
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                 {/* Stability Block */}
                                 <div className="bg-slate-900 p-10 rounded-[4rem] text-white flex flex-col justify-between shadow-3xl relative overflow-hidden border-l-[12px] border-primary">
                                     <div className="absolute top-0 right-0 p-8 opacity-10"><BoltIcon className="h-24 w-24 text-primary animate-pulse"/></div>
                                     <div>
                                         <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-10">Stability Scorecard</h4>
                                         <div className="text-9xl font-black italic tracking-tighter mb-4">{selectedCandidate.stability}<span className="text-2xl text-primary opacity-50 ml-2">%</span></div>
                                         <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Predicted Longevity Index</p>
                                     </div>
                                     <div className="mt-12 space-y-6">
                                          <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distance Factor</span>
                                              <span className="text-lg font-black text-green-400">{selectedCandidate.distanceFactor}</span>
                                          </div>
                                          <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Longevity Score</span>
                                              <span className="text-lg font-black text-primary">{selectedCandidate.longevity}</span>
                                          </div>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="mt-12 flex gap-6 relative z-10 pt-10 border-t border-slate-100">
                                 <button className="flex-1 py-6 bg-primary text-slate-950 font-black rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-[0.2em]">DEPLOY TO COMPANY FOR INTERVIEW</button>
                                 <button className="px-12 py-6 bg-slate-950 text-white font-black rounded-3xl shadow-xl hover:bg-slate-800 transition-all text-sm uppercase tracking-[0.2em]">VIEW SCIENTIFIC CV</button>
                             </div>
                         </div>
                     ) : (
                         <div className="h-full bg-slate-50 rounded-[5rem] border-8 border-dashed border-white flex flex-col items-center justify-center text-center p-20 opacity-20">
                              <UsersIcon className="h-40 w-40 text-slate-300 mb-10" />
                              <h3 className="text-3xl font-black text-slate-400 uppercase tracking-[0.3em] italic">Analyze DNA Node</h3>
                              <p className="text-lg text-slate-400 mt-4 font-hindi font-bold">डेटा विश्लेषण शुरू करने के लिए किसी उम्मीदवार को चुनें।</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default AuthorityDashboard777;
