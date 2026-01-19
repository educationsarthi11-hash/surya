
import React, { useState } from 'react';
import { 
    CurrencyRupeeIcon, UsersIcon, ArchiveBoxIcon, 
    IdentificationIcon, TruckIcon, ArrowLeftIcon, 
    BuildingOfficeIcon, ShieldCheckIcon, BoltIcon
} from './icons/AllIcons';
import { User, ServiceName } from '../types';

// Import sub-tools
import FeeManagement from './FeeManagement';
import SmartHR from './SmartHR';
import InventoryManager from './InventoryManager';
import VisitorManagement from './VisitorManagement';
import SmartTransport from './SmartTransport';
import AntiFraudShield from './AntiFraudShield';

const TOOLS = [
    { id: 'fees', title: 'Fee Management', hindi: 'फीस और खाते', icon: <CurrencyRupeeIcon/>, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', iconBg: 'bg-emerald-100', component: FeeManagement },
    { id: 'hr', title: 'Smart HR (Staff)', hindi: 'स्टाफ और वेतन', icon: <UsersIcon/>, bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', iconBg: 'bg-blue-100', component: SmartHR },
    { id: 'security', title: 'Anti-Fraud Shield', hindi: 'सुरक्षा गार्ड', icon: <ShieldCheckIcon/>, bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', iconBg: 'bg-red-100', component: AntiFraudShield },
    { id: 'inventory', title: 'Inventory Manager', hindi: 'स्टोर और स्टॉक', icon: <ArchiveBoxIcon/>, bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', iconBg: 'bg-orange-100', component: InventoryManager },
    { id: 'visitor', title: 'Visitor Management', hindi: 'गेट पास सिस्टम', icon: <IdentificationIcon/>, bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', iconBg: 'bg-purple-100', component: VisitorManagement },
    { id: 'transport', title: 'Smart Transport', hindi: 'बस ट्रैकिंग', icon: <TruckIcon/>, bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', iconBg: 'bg-indigo-100', component: SmartTransport },
];

const SmartAdminOffice: React.FC<{ user: User; setActiveService: (s: ServiceName | 'overview') => void }> = ({ user, setActiveService }) => {
    const [activeToolId, setActiveToolId] = useState<string | null>(null);

    const ActiveComponent = TOOLS.find(t => t.id === activeToolId)?.component;

    if (activeToolId && ActiveComponent) {
        return (
            <div className="h-full flex flex-col animate-fade-in">
                <div className="flex items-center justify-between mb-4 px-2">
                    <button 
                        onClick={() => setActiveToolId(null)} 
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-700 font-black uppercase text-xs tracking-widest bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-all hover:shadow-md"
                    >
                        <ArrowLeftIcon className="h-4 w-4"/> Back to Office
                    </button>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Mode</span>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 bg-white">
                    <ActiveComponent user={user} setActiveService={setActiveService} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-slate-50 to-white p-6 sm:p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col overflow-hidden relative border-8 border-slate-100">
            <div className="relative z-10 text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-2 rounded-full border border-blue-200 mb-6 shadow-sm">
                    <BuildingOfficeIcon className="h-4 w-4"/>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Central Administration</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                    Smart <span className="text-blue-600">Admin Office</span>
                </h2>
                <p className="text-slate-500 font-hindi mt-4 text-lg max-w-2xl mx-auto font-medium">
                    "स्कूल का सारा कागजी काम और सुरक्षा अब एक ही डिजिटल ऑफिस में।"
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar pb-20">
                {TOOLS.map((tool) => (
                    <button 
                        key={tool.id}
                        onClick={() => setActiveToolId(tool.id)}
                        className={`group ${tool.bg} border-2 ${tool.border} p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col items-center text-center hover:scale-[1.02]`}
                    >
                        <div className={`p-5 rounded-[1.5rem] ${tool.iconBg} ${tool.text} shadow-inner mb-6 group-hover:scale-110 transition-transform duration-500`}>
                            {React.cloneElement(tool.icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                        </div>
                        <h3 className={`text-xl font-black ${tool.text} uppercase tracking-tight mb-1`}>{tool.title}</h3>
                        <p className="text-sm font-hindi text-slate-500 font-bold">{tool.hindi}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SmartAdminOffice;
