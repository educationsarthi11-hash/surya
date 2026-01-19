
import React, { Suspense } from 'react';
import { ServiceName, User } from '../types';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { ArrowLeftIcon, ShieldCheckIcon, ChartBarIcon } from './icons/AllIcons';
import Loader from './Loader';
import ManagementPanel from './ManagementPanel';

const DirectorDashboard: React.FC<{ user: User; activeService: ServiceName | 'overview'; setActiveService: (s: any) => void }> = ({ user, activeService, setActiveService }) => {
    
    const config = {
        panelTitle: "Director / Executive Tools",
        sections: [
            {
                title: "Business Intelligence (व्यापारिक बुद्धि)",
                services: ['AI Profit Forecaster', 'Smart Matching Engine', 'Chief Talent Scientist', '777 Authority Dashboard'] as ServiceName[]
            },
            {
                title: "Global Operations (ग्रुप विस्तार)",
                services: ['Franchise Configurator', 'World Expansion Planner', 'Franchise Plans', 'Lead Generator', 'AI Website Builder'] as ServiceName[]
            },
            {
                title: "Financial Governance (वित्त एवं ऑडिट)",
                services: ['Profit Calculator', 'AI Business Manager', 'Fee Management', 'Auto-Dialer', 'Smart HR Manager'] as ServiceName[]
            },
            {
                title: "System Integrity (सुरक्षा एवं नियम)",
                services: ['AI Master Setup', 'Anti-Fraud Shield', 'Stability Analyzer', 'Sync Center', 'Analytics Dashboard'] as ServiceName[]
            }
        ]
    };

    if (activeService === 'overview') {
        return (
            <div className="space-y-6 animate-pop-in pb-32 h-full flex flex-col">
                 <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl mb-6 relative overflow-hidden border-b-8 border-primary">
                    <div className="absolute top-0 right-0 p-24 bg-primary/10 rounded-full blur-[80px] -mr-10 -mt-10"></div>
                     <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                         <div className="p-4 bg-primary rounded-3xl text-slate-900 shadow-2xl rotate-3">
                            <ChartBarIcon className="h-10 w-10"/>
                         </div>
                         <div className="text-center md:text-left">
                            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Director <span className="text-primary not-italic">Command.</span></h2>
                            <p className="text-lg text-slate-400 font-hindi font-medium mt-2">ग्रुप के मुनाफे और विस्तार का मुख्य नियंत्रण केंद्र</p>
                         </div>
                     </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <ManagementPanel config={config} handleServiceSelect={setActiveService} />
                </div>
            </div>
        );
    }

    const ServiceComponent = SERVICE_COMPONENTS[activeService];
    return (
        <div className="animate-pop-in pb-32 h-full flex flex-col">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-xl py-4 z-[60] px-2 rounded-3xl shadow-sm border border-slate-200">
                <button onClick={() => setActiveService('overview')} className="px-8 py-3 bg-white border border-slate-200 rounded-3xl shadow-sm text-slate-900 hover:text-primary transition-all flex items-center gap-4 group active:scale-95 transform origin-left">
                    <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform text-primary" /> 
                    <span className="font-black text-xs uppercase tracking-widest">BACK TO HQ</span>
                </button>
                <div className="text-right px-6">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">{activeService}</h2>
                </div>
            </header>
            
            <div className="flex-1 bg-white rounded-[4rem] shadow-3xl border border-slate-100 p-8 lg:p-12 min-h-[900px] relative overflow-hidden">
                {ServiceComponent ? (
                    <Suspense fallback={<div className="h-full flex items-center justify-center p-20"><Loader message="Loading Module..." /></div>}>
                        <ServiceComponent user={user} setActiveService={setActiveService} />
                    </Suspense>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 p-20 text-center">
                         <ShieldCheckIcon className="h-32 w-32 mb-8 text-slate-300 animate-pulse" />
                         <p className="text-3xl font-black uppercase tracking-[0.5em]">System Offline</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DirectorDashboard;
