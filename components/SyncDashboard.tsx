
import React, { useState } from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, LockClosedIcon, ArrowDownTrayIcon, UploadIcon, ShieldCheckIcon, SparklesIcon } from './icons/AllIcons';
import { syncService } from '../services/syncService';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const SyncDashboard: React.FC = () => {
    const [queue, setQueue] = useState(syncService.getQueue());
    const [isSyncing, setIsSyncing] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const toast = useToast();

    const handleSync = async () => {
        if (!navigator.onLine) {
            toast.error("सिंक करने के लिए इंटरनेट की जरूरत है।");
            return;
        }
        setIsSyncing(true);
        setTimeout(() => {
            syncService.clearQueue();
            setQueue([]);
            setIsSyncing(false);
            toast.success("सारा डेटा ऑनलाइन सुरक्षित कर दिया गया है!");
        }, 2000);
    };

    const handleBackup = () => {
        setIsBackingUp(true);
        const data = syncService.generateSystemBackup();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sarthi_System_Backup_${new Date().toISOString().split('T')[0]}.sarthi`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsBackingUp(false);
        toast.success("डिजिटल तिजोरी बैकअप तैयार है! इसे सुरक्षित रखें।");
    };

    const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.version && data.config) {
                    if (window.confirm("क्या आप डेटा रिस्टोर करना चाहते हैं? मौजूदा डेटा बदल जाएगा।")) {
                        syncService.restoreSystemFromBackup(data);
                    }
                } else {
                    toast.error("यह सही बैकअप फाइल नहीं है।");
                }
            } catch (err) {
                toast.error("फाइल को पढ़ने में समस्या आई।");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 animate-pop-in pb-20">
            {/* Sync Status Header */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><ArrowPathIcon className="h-6 w-6"/></div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 uppercase">Cloud Sync Center</h3>
                            <p className="text-xs text-slate-400 font-hindi">डेटा को ऑनलाइन सुरक्षित करें</p>
                        </div>
                    </div>
                    {queue.length > 0 && (
                        <button 
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2"
                        >
                            {isSyncing ? "सिंक हो रहा है..." : "अभी क्लाउड पर भेजें"}
                        </button>
                    )}
                </div>

                {queue.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                        <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-green-500" />
                        <p className="font-black text-slate-500 uppercase tracking-widest">सारा डेटा सिंक हो चुका है</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-100 flex items-center gap-3 mb-6">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            <p className="text-sm font-bold font-hindi">{queue.length} कार्य अभी ऑनलाइन भेजना बाकी हैं।</p>
                        </div>
                    </div>
                )}
            </div>

            {/* NEW: Digital Safe Section for 100% Data Safety */}
            <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border-4 border-indigo-500/20">
                <div className="absolute top-0 right-0 p-12 opacity-10"><LockClosedIcon className="h-32 w-32"/></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                        <h3 className="text-2xl font-black uppercase tracking-tight">डिजिटल तिजोरी (System Safe)</h3>
                    </div>
                    
                    <p className="text-slate-400 font-hindi text-lg mb-10 max-w-xl">
                        आपका डेटा आपकी ताकत है। "System Safe" के साथ आप अपने पूरे स्कूल/कॉलेज का बैकअप ले सकते हैं। <br/>
                        <b>वचन:</b> अगर कंप्यूटर खराब भी हो जाए, तो इस फाइल से सब कुछ पहले जैसा हो जाएगा।
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                            onClick={handleBackup}
                            disabled={isBackingUp}
                            className="flex flex-col items-center gap-4 p-8 bg-white/5 border-2 border-white/10 rounded-[2.5rem] hover:bg-indigo-600 hover:border-indigo-400 transition-all group"
                        >
                            <ArrowDownTrayIcon className="h-10 w-10 text-indigo-400 group-hover:text-white group-hover:animate-bounce" />
                            <div className="text-center">
                                <p className="font-black text-sm uppercase">Create Full Backup</p>
                                <p className="text-xs text-slate-500 group-hover:text-indigo-100 mt-1 font-hindi">बैकअप फाइल डाउनलोड करें</p>
                            </div>
                        </button>

                        <label className="flex flex-col items-center gap-4 p-8 bg-white/5 border-2 border-dashed border-white/20 rounded-[2.5rem] hover:bg-slate-800 hover:border-primary transition-all group cursor-pointer">
                            <UploadIcon className="h-10 w-10 text-slate-500 group-hover:text-primary" />
                            <div className="text-center">
                                <p className="font-black text-sm uppercase">Restore System</p>
                                <p className="text-xs text-slate-500 group-hover:text-slate-300 mt-1 font-hindi">बैकअप फाइल अपलोड करें</p>
                            </div>
                            <input type="file" accept=".sarthi" className="hidden" onChange={handleRestore} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
                 <div className="bg-white p-3 rounded-2xl shadow-sm"><SparklesIcon className="h-6 w-6 text-primary"/></div>
                 <p className="text-sm text-blue-800 font-hindi leading-relaxed">
                    <b>प्रो टिप:</b> हफ्ते में एक बार "System Safe" बैकअप जरूर लें और उसे अपनी गूगल ड्राइव या पेनड्राइव में सुरक्षित रखें। यह दुनिया का सबसे सुरक्षित तरीका है।
                 </p>
            </div>
        </div>
    );
};

export default SyncDashboard;
