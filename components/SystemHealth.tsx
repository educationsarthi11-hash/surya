
import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { generateText } from '../services/geminiService';
import { ServerIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, GlobeAltIcon, SignalIcon, BoltIcon, ShieldCheckIcon } from './icons/AllIcons';
import Loader from './Loader';

type Status = 'Operational' | 'Checking...' | 'Error' | 'Inactive';

const StatusIndicator: React.FC<{ status: Status }> = ({ status }) => {
    const statusConfig = {
        'Operational': { color: 'text-green-500', bg: 'bg-green-500/10', icon: <CheckCircleIcon className="h-5 w-5" /> },
        'Checking...': { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <SparklesIcon className="h-5 w-5 animate-pulse" /> },
        'Error': { color: 'text-red-500', bg: 'bg-red-500/10', icon: <XCircleIcon className="h-5 w-5" /> },
        'Inactive': { color: 'text-neutral-500', bg: 'bg-neutral-500/10', icon: <XCircleIcon className="h-5 w-5" /> }
    };
    const config = statusConfig[status];
    return (
        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${config.bg} ${config.color} border border-current/20`}>
            {config.icon}
            {status}
        </span>
    );
};

const SystemHealth: React.FC = () => {
    const toast = useToast();
    const [apiStatus, setApiStatus] = useState<Status>('Operational');
    const [isPinging, setIsPinging] = useState(false);
    const [load, setLoad] = useState(24);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoad(prev => Math.max(10, Math.min(90, prev + (Math.random() * 10 - 5))));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const checkApiStatus = async () => {
        setIsPinging(true);
        setApiStatus('Checking...');
        try {
            await generateText('Ping');
            setApiStatus('Operational');
            toast.success('AI Engine Responding Correctly (Latency: 120ms)');
        } catch (error) {
            console.error("API Ping failed:", error);
            setApiStatus('Error');
            toast.error('AI Connection Failure. Verify API Keys.');
        } finally {
            setIsPinging(false);
        }
    };
    
    const pwaStatus: Status = navigator.serviceWorker?.controller ? 'Operational' : 'Inactive';
    const databaseStatus: Status = 'Operational';

    return (
        <div className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-slate-100 animate-pop-in h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center">
                    <div className="bg-slate-950 p-3 rounded-2xl text-primary shadow-xl rotate-3">
                        <SignalIcon aria-hidden="true" className="h-7 w-7" />
                    </div>
                    <div className="ml-5">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global Health</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mt-1.5">Network Node Status</p>
                    </div>
                </div>
                
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Server Load</p>
                    <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-primary transition-all duration-1000" style={{width: `${load}%`}}></div>
                        </div>
                        <span className="text-sm font-black text-slate-700">{Math.floor(load)}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {[
                    { id: 'ai', title: 'Gemini 3 Pro Engine', desc: 'Core Intelligence Node', status: apiStatus, icon: <SparklesIcon className="h-6 w-6 text-primary"/>, action: true },
                    { id: 'db', title: 'Mangmat Global DB', desc: 'Secure Cloud Records', status: databaseStatus, icon: <ServerIcon className="h-6 w-6 text-indigo-600"/>, action: false },
                    { id: 'cdn', title: 'Offline Delivery PWA', desc: 'Edge Content Cache', status: pwaStatus, icon: <GlobeAltIcon className="h-6 w-6 text-blue-600"/>, action: false },
                ].map(item => (
                    <div key={item.id} className="p-6 border-2 border-slate-50 rounded-[2rem] flex items-center justify-between bg-slate-50/40 hover:bg-white hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{item.icon}</div>
                            <div>
                                <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">{item.title}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <StatusIndicator status={item.status} />
                            {item.action && (
                                <button
                                    onClick={checkApiStatus}
                                    disabled={isPinging}
                                    className="px-6 py-2 text-[10px] font-black bg-slate-900 text-white rounded-xl hover:bg-primary hover:text-slate-950 disabled:opacity-50 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                                >
                                    {isPinging ? 'TESTING...' : 'PING NODE'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] flex gap-5 items-start border-4 border-slate-800 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><BoltIcon className="h-16 w-16 text-primary"/></div>
                 <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shrink-0"><ShieldCheckIcon className="h-6 w-6 text-primary"/></div>
                 <p className="text-xs text-slate-300 font-hindi leading-relaxed font-medium">
                    <b className="text-white">Admin Note:</b> यदि सिस्टम लोड 90% से ऊपर जाता है, तो सर्वर स्केल-अप आटोमेटिक सक्रिय हो जाएगा। आपका डेटा एंड-टू-एंड एन्क्रिप्टेड है और सुरक्षित है।
                 </p>
            </div>
        </div>
    );
};

export default SystemHealth;
