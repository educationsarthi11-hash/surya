
import React, { useState, useEffect } from 'react';
import { User, StatusItem, UserRole } from '../types';
import { statusService } from '../services/statusService';
import { PlusIcon, XIcon, UserCircleIcon, SparklesIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const StatusBar: React.FC<{ user: User }> = ({ user }) => {
    const [statuses, setStatuses] = useState<StatusItem[]>([]);
    const [viewingStatus, setViewingStatus] = useState<StatusItem | null>(null);
    const toast = useToast();

    useEffect(() => {
        const update = () => setStatuses(statusService.getAllStatuses());
        update();
        return statusService.subscribe(update);
    }, []);

    const handleAddUpdate = () => {
        if (user.role !== UserRole.Admin && user.role !== UserRole.School) {
            toast.info("केवल एडमिन नए अपडेट डाल सकते हैं।");
            return;
        }
        const text = prompt("नया अपडेट लिखें (जैसे: कल छुट्टी है):");
        if (text) {
            statusService.addStatus({
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                contentText: text,
                userAvatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`
            });
            toast.success("सॉफ्टवेयर अपडेट पब्लिश हुआ!");
        }
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 overflow-hidden no-print">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Live Updates</h3>
                <button onClick={handleAddUpdate} className="text-[10px] font-black text-primary hover:underline">NEW POST</button>
            </div>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
                {/* My Status Add Button */}
                <div className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px]" onClick={handleAddUpdate}>
                    <div className="relative group">
                        <div className="w-14 h-14 rounded-full border-2 border-slate-200 p-1 bg-white flex items-center justify-center overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} className="w-full h-full object-cover rounded-full opacity-50" />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                            <PlusIcon className="h-3 w-3"/>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Add Update</span>
                </div>

                {/* Other Statuses */}
                {statuses.map(s => (
                    <div key={s.id} className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px]" onClick={() => setViewingStatus(s)}>
                        <div className={`w-14 h-14 rounded-full border-2 p-1 transition-all ${s.isViewed ? 'border-slate-200' : 'border-primary ring-2 ring-primary/10'}`}>
                            <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden">
                                {s.userAvatar ? <img src={s.userAvatar} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-[8px] font-black uppercase text-slate-400 text-center p-2">Sarthi</div>}
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 truncate w-16 text-center">{s.userName.split(' ')[0]}</span>
                    </div>
                ))}
            </div>

            {/* Viewer Overlay */}
            {viewingStatus && (
                <div className="fixed inset-0 z-[250] bg-black flex items-center justify-center animate-fade-in" onClick={() => setViewingStatus(null)}>
                    <div className="relative w-full max-w-md h-full sm:h-[80vh] bg-slate-900 sm:rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                            <div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden"><div className="h-full bg-white animate-[loading_5s_linear_forwards]"></div></div>
                        </div>
                        <button className="absolute top-8 right-6 text-white z-20 p-2" onClick={() => setViewingStatus(null)}><XIcon className="h-8 w-8"/></button>
                        <div className="h-full flex flex-col items-center justify-center p-10 text-center relative">
                            {viewingStatus.contentImage && <img src={viewingStatus.contentImage} className="absolute inset-0 w-full h-full object-cover opacity-40" />}
                            <div className="relative z-10 space-y-6">
                                <span className="px-3 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest">{viewingStatus.userRole}</span>
                                <h4 className="text-white text-3xl font-black font-hindi leading-relaxed drop-shadow-lg">{viewingStatus.contentText}</h4>
                                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
                                    <SparklesIcon className="h-4 w-4 text-orange-400"/>
                                    <span className="text-white text-xs font-bold">{viewingStatus.userName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusBar;
