
import React, { Suspense, useState } from 'react';
import { User, ServiceName, UserRole } from '../types';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { 
    BriefcaseIcon, SparklesIcon, BuildingOfficeIcon, 
    UsersIcon, ArrowLeftIcon, MagnifyingGlassIcon,
    BellIcon, ChartBarIcon, StarIcon, PlusIcon,
    ShieldCheckIcon, DocumentTextIcon, ClipboardIcon,
    GlobeAltIcon, PhoneIcon, BoltIcon, SignalIcon,
    XCircleIcon, MapPinIcon, HeartIcon, ArrowPathIcon
} from './icons/AllIcons';
import AiGlanceWidget from './AiGlanceWidget';
import ServicesPanel from './ServicesPanel';
import { useFilteredServices } from '../hooks/useFilteredServices';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';

const CompanyDashboard: React.FC<{ user: User; activeService: ServiceName | 'overview'; setActiveService: (s: any) => void }> = ({ user, activeService, setActiveService }) => {
    const companyServices = useFilteredServices(user.role);
    const toast = useToast();

    if (activeService === 'overview') {
        return (
            <div className="space-y-12 animate-pop-in pb-32 max-w-7xl mx-auto">
                {/* Executive Command Header */}
                <div className="bg-[#020617] p-12 lg:p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden border-b-[15px] border-primary">
                    <div className="absolute top-0 right-0 p-40 bg-primary/10 rounded-full blur-[150px] -mr-32 -mt-32 animate-pulse"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                        <div className="text-center lg:text-left space-y-8">
                            <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                 <BriefcaseIcon className="h-5 w-5 text-primary"/>
                                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">MGM Corporate Hub v7.0</span>
                            </div>
                            <h2 className="text-7xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none">POST <br/> <span className="text-primary not-italic">TALENT.</span></h2>
                            <p className="text-2xl text-slate-400 font-hindi max-w-2xl leading-relaxed font-medium">
                                "डांस, कला और तकनीक के बेहतरीन छात्रों तक सीधे पहुंचें।" <br/> 
                                <span className="text-primary-light">Zero Fraud Guarantee. Verified Candidates Only.</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => setActiveService('Placement Forum')}
                                className="px-12 py-8 bg-primary text-slate-950 font-black rounded-[2.5rem] shadow-[0_25px_60px_-10px_rgba(245,158,11,0.6)] hover:bg-white hover:scale-105 transition-all flex flex-col items-center gap-2 active:scale-95 group"
                            >
                                <PlusIcon className="h-10 w-10 group-hover:rotate-90 transition-transform duration-500" />
                                <span className="uppercase tracking-widest text-lg">Post Requirement</span>
                            </button>
                            <button className="px-8 py-4 bg-white/5 border-2 border-white/10 text-white font-black rounded-3xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs flex items-center gap-3">
                                <ShieldCheckIcon className="h-5 w-5"/> Compliance Status
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Tools Area */}
                    <div className="lg:col-span-8 space-y-10">
                        <AiGlanceWidget user={user} />
                        
                        <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100">
                             <div className="flex justify-between items-center mb-10 border-b pb-8 border-slate-50">
                                 <div>
                                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Hiring <span className="text-primary">Ecosystem</span></h3>
                                     <p className="text-slate-400 font-hindi font-bold mt-2">हुनरमंद उम्मीदवारों के लिए विशेष डिजिटल उपकरण</p>
                                 </div>
                             </div>
                             <ServicesPanel services={companyServices} onServiceSelect={setActiveService} gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
                        </div>
                    </div>

                    {/* Elite Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-3xl border-l-[12px] border-indigo-600 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><StarIcon className="h-48 w-48"/></div>
                            <h4 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                                <SparklesIcon className="h-4 w-4"/> AI Recruitment Intelligence
                            </h4>
                            <p className="font-hindi text-2xl font-bold leading-relaxed mb-10">भविष्य के सुपरस्टार्स (Dance & Arts) का चयन एआई के माध्यम से करें।</p>
                            <button onClick={() => setActiveService('Talent Scout' as any)} className="w-full py-6 bg-white text-slate-950 font-black rounded-3xl text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-4">
                                <UsersIcon className="h-6 w-6 text-primary"/> OPEN TALENT SCOUT
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-[3.5rem] border-4 border-slate-50 shadow-sm relative overflow-hidden">
                             <div className="flex justify-between items-center mb-8">
                                <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Active Alerts</h4>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                             </div>
                             <p className="font-hindi text-xl font-bold text-slate-800 leading-relaxed mb-8">आज 12 नए डांसर्स ने अपना डिजिटल पोर्टफोलियो अपडेट किया है।</p>
                             <button onClick={() => setActiveService('Placement Forum')} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-md">NOTIFY THEM NOW</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const ServiceComponent = SERVICE_COMPONENTS[activeService];
    return (
        <div className="animate-pop-in min-h-[600px] pb-24">
             <button onClick={() => setActiveService('overview')} className="mb-10 px-12 py-6 bg-white border border-slate-200 rounded-[2.5rem] font-black text-xs flex items-center gap-4 hover:bg-slate-950 hover:text-white shadow-xl transition-all active:scale-95 group uppercase tracking-widest">
                 <ArrowLeftIcon className="h-6 w-6 group-hover:-translate-x-2 transition-transform"/> BACK TO EXECUTIVE CONSOLE
             </button>
             <div className="bg-white p-8 lg:p-14 rounded-[5rem] shadow-3xl border border-slate-100 min-h-[900px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-slate-950 via-primary to-slate-950"></div>
                {ServiceComponent && (
                    <Suspense fallback={<div className="h-full flex items-center justify-center p-20"><Loader message="Initializing Recruiter Node..." /></div>}>
                        <ServiceComponent user={user} setActiveService={setActiveService} />
                    </Suspense>
                )}
             </div>
        </div>
    );
};

export default CompanyDashboard;
