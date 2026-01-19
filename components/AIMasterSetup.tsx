
import React, { useState } from 'react';
import { 
    ShieldCheckIcon, SparklesIcon, CheckCircleIcon, 
    ArrowPathIcon, DocumentTextIcon, GlobeAltIcon,
    BoltIcon, SignalIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const AIMasterSetup: React.FC = () => {
    const toast = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const constitution = [
        { title: "Matching Logic", desc: "Prioritize local hires (10-15km radius) based on Pin-Code data. Reduces commute fatigue by 40%." },
        { title: "Stability Factor", desc: "AI ranks 'Local/Married' candidates with 20% higher reliability scores based on historical data." },
        { title: "Anti-Fraud Shield", desc: "100% Block on MLM/Chain system jobs, pay-to-work schemes, and suspicious foreign recruiters." },
        { title: "Educational Alignment", desc: "Sync all job descriptions with state-specific board patterns and vocational ITI standards." }
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("MGM Group AI Constitution Updated & Synced Across All Nodes!");
        }, 1500);
    };

    return (
        <div className="space-y-12 animate-pop-in">
            {/* Header Branding */}
            <div className="bg-[#020617] p-12 lg:p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden border-b-[15px] border-primary">
                <div className="absolute top-0 right-0 p-40 bg-primary/10 rounded-full blur-[150px] -mr-32 -mt-32 animate-pulse"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-3 bg-primary/20 px-6 py-2 rounded-full border border-primary/30 mb-10 backdrop-blur-md">
                         <ShieldCheckIcon className="h-5 w-5 text-primary"/>
                         <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Master System Governance Protocol v7.0</span>
                    </div>
                    <h2 className="text-6xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none">MGM <br/> <span className="text-primary not-italic">CONSTITUTION.</span></h2>
                    <p className="text-2xl text-slate-400 font-hindi mt-8 max-w-3xl leading-relaxed font-medium">
                        समूह के नीति-नियमों और एआई की कार्यप्रणाली का मुख्य नियंत्रण केंद्र। यहाँ आप ग्रुप-वाइड 'मैचिंग और फिल्टरिंग' रूल्स सेट कर सकते हैं।
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Policy Cards */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {constitution.map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3.5rem] border-4 border-slate-50 shadow-sm hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all transform translate-x-4 -translate-y-4">
                                     <CheckCircleIcon className="h-32 w-32"/>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-8 shadow-inner group-hover:bg-primary group-hover:text-slate-950 transition-all">
                                     <DocumentTextIcon className="h-8 w-8"/>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight italic leading-none">{item.title}</h4>
                                <p className="text-lg text-slate-500 font-hindi font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 p-12 rounded-[4rem] border-4 border-dashed border-slate-200 text-center flex flex-col items-center">
                         <div className="p-6 bg-white rounded-full shadow-lg mb-8"><SignalIcon className="h-12 w-12 text-slate-300"/></div>
                         <h4 className="text-2xl font-black text-slate-400 uppercase tracking-widest italic">Global Protocol Synced</h4>
                         <p className="text-sm text-slate-400 mt-4 font-hindi max-w-md">सभी 184 फ्रेंचाइजी और कंपनी नोड्स इन नियमों का पालन करने के लिए एआई द्वारा बाध्य हैं।</p>
                    </div>
                </div>

                {/* AI Controller Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-10 rounded-[4rem] border-[10px] border-slate-50 shadow-3xl flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/30"><BoltIcon className="h-6 w-6 text-slate-950"/></div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">AI Core Instructions</h4>
                        </div>
                        
                        <div className="flex-1 p-6 bg-slate-900 rounded-[2.5rem] text-xs font-mono text-green-400 leading-relaxed mb-10 shadow-inner overflow-hidden relative">
                             <div className="absolute top-4 right-6 text-slate-700 font-black tracking-widest">STRICT-MODE</div>
                             <div className="space-y-2 opacity-80">
                                 <p className="text-indigo-400">// Initialization sequence...</p>
                                 <p>SET rules.mlm_filter = 'STRICT';</p>
                                 <p>SET rules.local_range = 15; // km</p>
                                 <p>IF candidate.is_married THEN score += 20;</p>
                                 <p>IF candidate.is_local THEN score += 30;</p>
                                 <p>BLOCK keywords: ['chain', 'mlm', 'investment'];</p>
                                 <p>ACTIVATE auto_fee_dialer = TRUE;</p>
                                 <p className="text-indigo-400">// MGM Protocol Active</p>
                             </div>
                        </div>
                        
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full py-6 bg-slate-950 text-white font-black rounded-3xl shadow-2xl shadow-slate-900/40 hover:bg-primary hover:text-slate-950 transition-all transform active:scale-95 flex items-center justify-center gap-4 uppercase tracking-widest text-base"
                        >
                            {isSaving ? <Loader message="" /> : <><ArrowPathIcon className="h-6 w-6"/> SYNC ACROSS GROUP</>}
                        </button>
                    </div>

                    <div className="p-10 bg-indigo-600 border-[10px] border-indigo-100 rounded-[4rem] text-white relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000"><GlobeAltIcon className="h-32 w-32"/></div>
                         <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-6 opacity-70">Director's Memo</h4>
                         <p className="text-xl font-hindi font-bold leading-relaxed">
                            "एआई सार्थी केवल एक टूल नहीं, यह हमारे मूल्यों का डिजिटल रक्षक है। यह सुनिश्चित करता है कि शिक्षा का व्यापार न हो।"
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIMasterSetup;
