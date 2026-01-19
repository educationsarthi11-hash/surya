
import React, { Suspense } from 'react';
import { ServiceName, User } from '../types';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import Loader from './Loader';
import { ArrowLeftIcon, MicrophoneIcon, SparklesIcon, CalendarDaysIcon } from './icons/AllIcons';
import ParentPortal from './ParentPortal';

const ParentDashboard: React.FC<{ user: User; activeService: ServiceName | 'overview'; setActiveService: (s: any) => void }> = ({ user, activeService, setActiveService }) => {
    if (activeService === 'overview') {
        return (
            <div className="space-y-8">
                {/* Highlighted Voice Hub for Parents */}
                <div className="bg-gradient-to-br from-orange-600 to-red-600 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/20 animate-pop-in">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                        <MicrophoneIcon className="h-32 w-32 text-white" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full border border-white/30 mb-6">
                            <SparklesIcon className="h-4 w-4 text-yellow-300 animate-pulse"/>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">New Accessible Mode</span>
                        </div>
                        <h3 className="text-4xl font-black mb-2 font-hindi leading-tight">बोलकर रिपोर्ट सुनें</h3>
                        <p className="text-orange-50 text-lg font-hindi opacity-90 max-w-lg mb-8">
                            यदि आप पढ़ना नहीं चाहते, तो बस बटन दबाएं और अपनी भाषा में बच्चे की प्रोग्रेस सुनें।
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => setActiveService('AI Parent Voice Hub')}
                                className="px-10 py-5 bg-white text-orange-600 font-black rounded-3xl shadow-xl hover:bg-slate-900 hover:text-white transition-all flex items-center gap-4 text-xl transform active:scale-95"
                            >
                                <MicrophoneIcon className="h-8 w-8" /> वॉयस हब खोलें
                            </button>
                             <button 
                                onClick={() => setActiveService('Smart PTM Scheduler')}
                                className="px-8 py-5 bg-orange-800/40 text-white font-black rounded-3xl border-2 border-white/20 hover:bg-white hover:text-orange-600 transition-all flex items-center gap-3 active:scale-95"
                            >
                                <CalendarDaysIcon className="h-6 w-6" /> टीचर से मिलें (PTM)
                            </button>
                        </div>
                    </div>
                </div>
                <ParentPortal user={user} setActiveService={setActiveService} />
            </div>
        );
    }

    const ServiceComponent = SERVICE_COMPONENTS[activeService];
    return (
        <div className="animate-pop-in pb-20">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-50">
                <button onClick={() => setActiveService('overview')} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-900 hover:text-primary transition-all active:scale-90 flex items-center justify-center gap-3">
                    <ArrowLeftIcon className="h-6 w-6" /> <span className="font-hindi text-sm font-bold">वापस डैशबोर्ड</span>
                </button>
                <div className="text-right">
                    <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none">{activeService}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sarthi Safety Network</p>
                </div>
            </header>
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 p-8 min-h-[800px]">
                {ServiceComponent && (
                    <Suspense fallback={<Loader message="लोड हो रहा है..." />}>
                        <ServiceComponent user={user} setActiveService={setActiveService} />
                    </Suspense>
                )}
            </div>
        </div>
    );
};

export default ParentDashboard;
