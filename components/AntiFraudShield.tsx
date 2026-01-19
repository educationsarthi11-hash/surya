
import React, { useState } from 'react';
import { ShieldCheckIcon, ExclamationTriangleIcon, TrashIcon, CheckCircleIcon, SignalIcon, LockClosedIcon, SparklesIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const AntiFraudShield: React.FC = () => {
    const toast = useToast();
    const blockedList = [
        { id: 1, name: 'Easy Money India Ltd', reason: 'MLM / Chain System', date: 'Just Now', status: 'BLACKLISTED' },
        { id: 2, name: 'Quick Wealth Hub', reason: 'Suspicious Domain', date: '1 Hour Ago', status: 'BLOCKED' }
    ];

    return (
        <div className="space-y-12 animate-pop-in pb-20">
            <div className="bg-[#1e1b4b] p-12 lg:p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden border-b-[15px] border-red-500">
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="text-center lg:text-left space-y-6">
                        <div className="inline-flex items-center gap-3 bg-red-500/20 text-red-400 px-6 py-2 rounded-full border border-red-500/30 backdrop-blur-md">
                             <ShieldCheckIcon className="h-5 w-5 animate-pulse"/>
                             <span className="text-xs font-black uppercase tracking-[0.4em]">Sarthi Guardian Firewall Active</span>
                        </div>
                        <h2 className="text-6xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none">MGM <span className="text-red-500 not-italic">SHIELD.</span></h2>
                        <p className="text-2xl text-slate-400 font-hindi max-w-2xl leading-relaxed font-medium">
                            हमारा एआई गार्डियन पोर्टल पर फर्जी नौकरियों और नेटवर्क मार्केटिंग (MLM) को ब्लॉक करता है।
                        </p>
                    </div>
                    <div className="w-48 h-48 rounded-[3.5rem] bg-white/5 border-4 border-white/10 flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl">
                         <LockClosedIcon className="h-16 w-16 text-red-500 mb-2" />
                         <span className="text-3xl font-black">SECURE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 space-y-6">
                     <h3 className="text-3xl font-black text-slate-900 uppercase italic px-6">Intrusion log</h3>
                     <div className="space-y-4">
                         {blockedList.map(item => (
                             <div key={item.id} className="p-8 bg-white rounded-[3rem] border-4 border-slate-50 shadow-sm flex flex-col sm:flex-row items-center justify-between group hover:border-red-500/20 transition-all">
                                 <div className="flex items-center gap-8">
                                     <div className="p-6 bg-red-50 text-red-600 rounded-[2rem]"><ExclamationTriangleIcon className="h-8 w-8"/></div>
                                     <div>
                                         <p className="font-black text-slate-900 text-2xl tracking-tighter uppercase">{item.name}</p>
                                         <p className="text-base text-red-500 font-bold uppercase">{item.reason}</p>
                                     </div>
                                 </div>
                                 <span className="bg-red-900 text-white text-[10px] font-black px-4 py-1 rounded-full tracking-widest mt-4 sm:mt-0">{item.status}</span>
                             </div>
                         ))}
                     </div>
                 </div>
                 <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[4rem] text-white shadow-3xl relative overflow-hidden">
                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><SparklesIcon className="h-5 w-5"/> Security AI</h4>
                    <p className="text-2xl font-hindi font-medium leading-relaxed">"एआई 'सार्थी गार्डियन' हर नौकरी की पोस्ट के पीछे की कंपनी की जांच करता है। फ्रॉड का कोई मौका नहीं।"</p>
                    <button className="mt-10 w-full py-4 bg-white text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all">VIEW FULL REPORT</button>
                 </div>
            </div>
        </div>
    );
};

export default AntiFraudShield;
