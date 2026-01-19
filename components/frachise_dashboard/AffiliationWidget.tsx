
import React from 'react';
import { BuildingLibraryIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon } from '../icons/AllIcons';

const AffiliationWidget: React.FC = () => {
    const affiliations = [
        { name: 'Sunrise Institute of Tech', status: 'Pending Review', date: '2 days ago', color: 'orange' },
        { name: 'City Law College', status: 'In Inspection', date: '5 days ago', color: 'blue' },
        { name: 'Global Management Inst.', status: 'Verified', date: 'Yesterday', color: 'green' }
    ];

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-soft border border-slate-100 h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Affiliations</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Pending Approval Queue</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><BuildingLibraryIcon className="h-6 w-6"/></div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {affiliations.map((aff, i) => (
                    <div key={i} className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-${aff.color}-500`}></div>
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <p className="font-black text-slate-800 text-sm truncate uppercase">{aff.name}</p>
                                <p className="text-[10px] text-slate-400 mt-1 font-bold flex items-center gap-1"><ClockIcon className="h-3 w-3"/> {aff.date}</p>
                            </div>
                            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter bg-${aff.color}-100 text-${aff.color}-700 border border-${aff.color}-200`}>
                                {aff.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-8 w-full py-4 bg-slate-950 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-slate-950 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                VIEW ALL REQUESTS <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </button>
        </div>
    );
};

export default AffiliationWidget;
