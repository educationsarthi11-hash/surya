
import React, { Suspense } from 'react';
import { ServiceName, User } from '../types';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { ArrowLeftIcon, BuildingLibraryIcon, BriefcaseIcon, AcademicCapIcon, SparklesIcon } from './icons/AllIcons';
import Loader from './Loader';
import ManagementPanel from './ManagementPanel';

const CollegeDashboard: React.FC<{ user: User; activeService: ServiceName | 'overview'; setActiveService: (s: any) => void }> = ({ user, activeService, setActiveService }) => {
    
    const config = {
        panelTitle: "College Command Center",
        sections: [
            {
                title: "Placement & Careers (करियर)",
                services: ['Placement Forum', 'Placement Reporting', 'CV Generator', 'AI Interview Coach', 'Talent Scout'] as ServiceName[]
            },
            {
                title: "Academic Admin (एकेडमिक)",
                services: ['Student Database', 'Online Exam', 'Test Paper Guru', 'Alumni Connect', 'Syllabus Tracker'] as ServiceName[]
            },
            {
                title: "Campus Services (कैंपस)",
                services: ['Fee Management', 'Inventory Manager', 'Smart Canteen', 'Digital Notice Board', 'Campus Radio'] as ServiceName[]
            }
        ]
    };

    if (activeService === 'overview') {
        return (
            <div className="space-y-8 animate-pop-in pb-20">
                <div className="bg-indigo-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="absolute top-0 right-0 p-24 bg-primary/20 rounded-full blur-[100px] -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 mb-4">
                             <AcademicCapIcon className="h-4 w-4 text-primary"/>
                             <span className="text-[10px] font-black uppercase tracking-widest">Higher Education Portal</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none italic">{user.name}</h2>
                        <p className="text-indigo-200 font-hindi text-xl mt-3">प्लेसमेंट, परीक्षा और एलुमनाई नेटवर्क प्रबंधन</p>
                    </div>
                    <div className="flex gap-4 relative z-10">
                         <div className="bg-white/10 px-6 py-4 rounded-[2rem] border border-white/10 backdrop-blur-md text-center">
                             <p className="text-xs font-black opacity-60 uppercase">Placement Rate</p>
                             <p className="text-2xl font-black text-green-400">82%</p>
                         </div>
                    </div>
                </div>
                <ManagementPanel config={config} handleServiceSelect={setActiveService} />
            </div>
        );
    }

    const ServiceComponent = SERVICE_COMPONENTS[activeService];
    return (
        <div className="animate-pop-in pb-20">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-50">
                <button onClick={() => setActiveService('overview')} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-900 hover:text-primary transition-all flex items-center justify-center gap-3 active:scale-95">
                    <ArrowLeftIcon className="h-6 w-6" /> <span className="font-hindi text-sm font-bold uppercase tracking-widest">BACK TO COMMAND</span>
                </button>
            </header>
            <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-10 min-h-[800px] relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                {ServiceComponent && (
                    <Suspense fallback={<Loader message="प्रवेश हो रहा है..." />}>
                        <ServiceComponent user={user} setActiveService={setActiveService} />
                    </Suspense>
                )}
            </div>
        </div>
    );
};

export default CollegeDashboard;
