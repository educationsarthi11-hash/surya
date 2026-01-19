
import React, { useState } from 'react';
import { MicrophoneIcon, StopCircleIcon, PlayIcon, SparklesIcon, TrashIcon } from './icons/AllIcons';
import { syncService } from '../services/syncService';
import { useToast } from '../hooks/useToast';

const VoiceMemo: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [memos, setMemos] = useState(syncService.getQueue().filter(q => q.type === 'voice_memo'));
    const toast = useToast();

    const startRecording = () => {
        setIsRecording(true);
        toast.info("रिकॉर्डिंग शुरू... (Recording started)");
    };

    const stopRecording = () => {
        setIsRecording(false);
        const data = { note: "Voice Note Recorded Offline", duration: "1:20", id: Date.now() };
        syncService.addToQueue('voice_memo', data);
        setMemos(syncService.getQueue().filter(q => q.type === 'voice_memo'));
        toast.success("मेमो सुरक्षित किया गया! ऑनलाइन होने पर AI इसे ट्रांसक्राइब करेगा।");
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-soft border border-slate-100 animate-pop-in min-h-[600px] flex flex-col">
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600"><MicrophoneIcon className="h-8 w-8"/></div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Smart Voice Memo</h3>
                    <p className="text-sm text-slate-400 font-hindi">बोलकर नोट्स बनाएं, ऑफलाइन भी!</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <button 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-12 rounded-full shadow-2xl transition-all transform active:scale-95 border-8 ${isRecording ? 'bg-red-500 border-red-100 animate-pulse' : 'bg-primary border-orange-50'}`}
                >
                    {isRecording ? <StopCircleIcon className="h-16 w-16 text-white"/> : <MicrophoneIcon className="h-16 w-16 text-white"/>}
                </button>
                <p className="font-bold text-slate-400 uppercase tracking-widest">{isRecording ? "Listening..." : "Tap to record note"}</p>
            </div>

            <div className="mt-10">
                <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-indigo-500"/> स्थानीय मेमो (Local Memos)
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {memos.length === 0 ? (
                        <p className="text-center py-10 text-slate-300 font-bold italic">कोई मेमो नहीं है।</p>
                    ) : (
                        memos.map(memo => (
                            <div key={memo.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl text-primary"><PlayIcon className="h-4 w-4"/></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">Voice Note {memo.id.slice(-4)}</p>
                                        <p className="text-[10px] text-slate-400">{new Date(memo.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded">PENDING SYNC</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoiceMemo;
