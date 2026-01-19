
import React, { useState } from 'react';
import { BoltIcon, ShieldCheckIcon, UsersIcon, MapPinIcon, SparklesIcon, SignalIcon, CheckCircleIcon, ArrowPathIcon } from './icons/AllIcons';
import Loader from './Loader';

const SmartMatchingEngine: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [step, setStep] = useState(0);

    const runEngine = () => {
        setIsScanning(true);
        setStep(1);
        
        const sequence = [
            { t: 1000, msg: "SCANNING Student_Database..." },
            { t: 2500, msg: "FILTERING (Pin_Code == Company_Pin_Code)..." },
            { t: 4000, msg: "SORTING BY (Stability_Score + Skill_Match)..." },
            { t: 5500, msg: "CHECKING (Anti_MLM_Filter == Clean)..." },
            { t: 7000, msg: "GENERATING (Custom_Training_Plan)..." },
            { t: 8500, msg: "COMPLETED: Ready for WhatsApp_Notification." }
        ];

        sequence.forEach((s, idx) => {
            setTimeout(() => {
                setStep(idx + 1);
                if (idx === sequence.length - 1) setIsScanning(false);
            }, s.t);
        });
    };

    return (
        <div className="h-full flex flex-col space-y-10 animate-pop-in">
            <div className="bg-slate-50 p-10 rounded-[4rem] border-l-[15px] border-primary shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-8">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-primary shadow-2xl rotate-3">
                        <BoltIcon className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Smart <span className="text-primary">Matching Engine</span></h2>
                        <p className="text-xl font-hindi font-bold text-slate-400 mt-2">AI Logic: Hire - Train - Deploy</p>
                    </div>
                </div>
                <button 
                    onClick={runEngine}
                    disabled={isScanning}
                    className="px-12 py-5 bg-primary text-slate-950 font-black rounded-3xl shadow-xl hover:bg-slate-950 hover:text-white transition-all transform active:scale-95 text-xl flex items-center gap-4 disabled:opacity-50"
                >
                    {isScanning ? <Loader message="" /> : <><ArrowPathIcon className="h-6 w-6"/> RUN LOGIC</>}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-hidden">
                {/* Visualization of the Logic */}
                <div className="lg:col-span-7 bg-slate-900 rounded-[4rem] p-12 shadow-3xl border-4 border-slate-800 relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                     <div className="relative z-10 space-y-8">
                        {[
                            { icon: <UsersIcon/>, label: "SCAN Student_Database", id: 1 },
                            { icon: <MapPinIcon/>, label: "FILTER Pin_Code == Company_Pin", id: 2 },
                            { icon: <SignalIcon/>, label: "SORT Stability + Skill_Match", id: 3 },
                            { icon: <ShieldCheckIcon/>, label: "CHECK Anti_MLM_Filter == Clean", id: 4 },
                            { icon: <SparklesIcon/>, label: "GENERATE Custom_Training_Plan", id: 5 }
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all duration-700 ${step >= s.id ? 'bg-primary/20 border-primary text-white scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-600 opacity-30'}`}>
                                 <div className={`p-4 rounded-2xl ${step >= s.id ? 'bg-primary text-slate-950 shadow-glow' : 'bg-slate-800'}`}>
                                     {React.cloneElement(s.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" })}
                                 </div>
                                 <span className="font-mono text-lg font-black tracking-tight uppercase">{s.label}</span>
                                 {step >= s.id && <CheckCircleIcon className="ml-auto h-8 w-8 text-green-400 animate-pop-in"/>}
                            </div>
                        ))}
                     </div>
                </div>

                {/* Final Result Container */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    {step === 6 ? (
                        <div className="bg-white p-12 rounded-[5rem] border-8 border-slate-50 shadow-3xl animate-pop-in text-center space-y-8">
                            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner animate-bounce">
                                <CheckCircleIcon className="h-16 w-16"/>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Perfect Match Found!</h3>
                                <p className="text-xl font-hindi font-bold text-slate-400 mt-2 italic">12 Trained Students Identified</p>
                            </div>
                            <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3">System Action Triggered</p>
                                <p className="text-base font-bold">SENDING WhatsApp_Notification_Via_9817776765...</p>
                            </div>
                            <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">VIEW MATCHED CANDIDATES</button>
                        </div>
                    ) : (
                        <div className="text-center opacity-10">
                            <SignalIcon className="h-40 w-40 mx-auto mb-6 text-slate-300"/>
                            <p className="font-black text-2xl uppercase tracking-[0.5em]">Engine Offline</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartMatchingEngine;
