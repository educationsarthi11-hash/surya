
import React, { useState } from 'react';
import { ShieldCheckIcon, LockClosedIcon, CheckCircleIcon, UsersIcon, UserCircleIcon, MapPinIcon, DocumentTextIcon, XCircleIcon, SignalIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const EmployerPeaceOfMind: React.FC = () => {
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    
    const verificationLogs = [
        { id: 'ESS-STU-001', name: 'Aarav Sharma', aadhar: 'Verified', police: 'Clear', academic: 'Authentic', status: 'GREEN' },
        { id: 'ESS-STU-004', name: 'Sneha Verma', aadhar: 'Verified', police: 'Pending', academic: 'Authentic', status: 'YELLOW' },
        { id: 'ESS-STU-002', name: 'Priya Patel', aadhar: 'Verified', police: 'Clear', academic: 'Authentic', status: 'GREEN' },
    ];

    const filtered = verificationLogs.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="h-full flex flex-col space-y-10 animate-pop-in">
            <div className="bg-[#f8fafc] p-10 rounded-[4rem] border-l-[15px] border-green-500 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-green-500/5 rounded-full blur-[100px]"></div>
                <div className="relative z-10 flex items-center gap-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-green-100 animate-pulse-slow">
                        <ShieldCheckIcon className="h-12 w-12 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Employer <span className="text-green-600">Peace of Mind</span></h2>
                        <p className="text-xl font-hindi font-bold text-slate-400 mt-2 italic">100% वेरिफाइड और सुरक्षित उम्मीदवार</p>
                    </div>
                </div>
                <div className="bg-slate-900 px-10 py-5 rounded-[2.5rem] text-white flex items-center gap-4 relative z-10 shadow-3xl">
                     <div className="p-3 bg-green-500 rounded-2xl"><LockClosedIcon className="h-6 w-6 text-slate-950"/></div>
                     <div>
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Status</p>
                         <p className="text-lg font-black text-green-400 italic">VETTING ACTIVE</p>
                     </div>
                </div>
            </div>

            <div className="bg-white rounded-[4rem] border-4 border-slate-50 shadow-2xl overflow-hidden flex-1 flex flex-col">
                <div className="p-8 border-b bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Background Verification Vault</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Direct from National Identity APIs</p>
                    </div>
                    <div className="relative w-full sm:w-80">
                         <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by name or ID..."
                            className="w-full pl-6 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-green-500 outline-none font-bold text-sm shadow-sm"
                         />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-6">
                        {filtered.map(log => (
                            <div key={log.id} className="p-8 bg-white border-2 border-slate-50 rounded-[3rem] shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between group hover:border-green-500/20">
                                <div className="flex items-center gap-8 mb-6 md:mb-0">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 border-2 border-white shadow-inner overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${log.name}`} />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md ${log.status === 'GREEN' ? 'bg-green-500' : 'bg-amber-500'}`}>
                                            {log.status === 'GREEN' ? <CheckCircleIcon className="h-4 w-4 text-white"/> : <XCircleIcon className="h-4 w-4 text-white"/>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">{log.name}</h4>
                                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">{log.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-8 text-center flex-1 max-w-xl mx-8">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aadhaar (ID)</p>
                                        <p className="text-xs font-black text-green-600 uppercase italic flex items-center justify-center gap-1"><ShieldCheckIcon className="h-3 w-3"/> {log.aadhar}</p>
                                    </div>
                                    <div className="space-y-1 border-x border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Police Check</p>
                                        <p className={`text-xs font-black uppercase italic flex items-center justify-center gap-1 ${log.police === 'Clear' ? 'text-green-600' : 'text-amber-500'}`}>
                                            {log.police === 'Clear' ? <CheckCircleIcon className="h-3 w-3"/> : <SignalIcon className="h-3 w-3"/>} {log.police}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Academic Info</p>
                                        <p className="text-xs font-black text-green-600 uppercase italic flex items-center justify-center gap-1"><DocumentTextIcon className="h-3 w-3"/> {log.academic}</p>
                                    </div>
                                </div>

                                <button onClick={() => toast.info("Requesting PDF Export...")} className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg active:scale-95 group-hover:scale-105">
                                    EXPORT VETTING REPORT
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="p-10 bg-green-50 border-4 border-green-100 rounded-[4rem] flex flex-col md:flex-row items-center gap-10">
                 <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl text-green-600"><CheckCircleIcon className="h-10 w-10"/></div>
                 <div className="flex-1 text-center md:text-left">
                     <h4 className="text-2xl font-black text-green-900 uppercase italic leading-none">Security Pact</h4>
                     <p className="text-green-700 font-hindi font-medium text-lg mt-2 italic">"हमारा हर उम्मीदवार 3-लेयर वेरिफिकेशन से गुजरता है। आपकी कंपनी की सुरक्षा ही हमारा गौरव है।"</p>
                 </div>
                 <button className="px-10 py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 transition-all uppercase tracking-widest text-xs">Request Full Audit</button>
            </div>
        </div>
    );
};

export default EmployerPeaceOfMind;
