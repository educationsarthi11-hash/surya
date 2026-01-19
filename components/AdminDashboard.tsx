
import React, { useState, Suspense, useEffect } from 'react';
import { ServiceName, User } from '../types';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { ArrowLeftIcon, SignalIcon, Squares2X2Icon } from './icons/AllIcons';
import Loader from './Loader';
import { useFilteredServices } from '../hooks/useFilteredServices';
import ServicesPanel from './ServicesPanel';

const AdminDashboard: React.FC<{ user: User; activeService: ServiceName | 'overview'; setActiveService: (s: any) => void }> = ({ user, activeService, setActiveService }) => {
    const adminServices = useFilteredServices(user.role);

    useEffect(() => {
        if (activeService === 'overview') {
            document.title = "Admin Tools";
        }
    }, [activeService]);

    if (activeService === 'overview') {
        return (
            <div className="space-y-6 animate-pop-in pb-24 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                     <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                        <Squares2X2Icon className="h-8 w-8"/>
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Admin Tools</h2>
                        <p className="text-sm text-slate-500 font-bold">Select a tool to manage your institution</p>
                     </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <ServicesPanel services={adminServices} onServiceSelect={setActiveService} />
                </div>
            </div>
        );
    }

    const ServiceComponent = SERVICE_COMPONENTS[activeService];
    return (
        <div className="animate-pop-in pb-24 h-full flex flex-col">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-50 rounded-xl px-2">
                <button onClick={() => setActiveService('overview')} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 hover:text-primary transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm font-bold">
                    <ArrowLeftIcon className="h-5 w-5" /> 
                    <span>BACK TO TOOLS</span>
                </button>
                <div className="text-right">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{activeService}</h2>
                </div>
            </header>
            <div className="flex-1 bg-white rounded-[3rem] shadow-xl border border-slate-100 p-6 relative overflow-hidden min-h-[600px]">
                {ServiceComponent ? (
                    <Suspense fallback={<div className="h-full flex items-center justify-center p-20"><Loader message="Loading Module..." /></div>}>
                        <ServiceComponent user={user} setActiveService={setActiveService} />
                    </Suspense>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                         <SignalIcon className="h-20 w-20 mb-4 animate-pulse" />
                         <p className="font-black uppercase tracking-widest">Module Not Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
