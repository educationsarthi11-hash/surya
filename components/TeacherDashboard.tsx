
import React, { Suspense } from 'react';
import { ServiceName, User } from '../types';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { ArrowLeftIcon, AcademicCapIcon } from './icons/AllIcons';
import Loader from './Loader';
import ManagementPanel from './ManagementPanel';

const TeacherDashboard: React.FC<{ user: User; activeService: ServiceName | 'overview'; setActiveService: (s: any) => void }> = ({ user, activeService, setActiveService }) => {
    
    const config = {
        panelTitle: "Teacher Tools",
        sections: [
            {
                title: "Teaching Tools (पढ़ाना और बोर्ड)",
                services: ['AI Smart Board', 'Classroom', 'AI Video Generator', 'Smart Library', 'Interactive 3D Lab'] as ServiceName[]
            },
            {
                title: "Student & Parent Connect (संपर्क)",
                services: ['Smart PTM Scheduler', 'Smart Digital Diary', 'Attendance Log', 'Face Attendance', 'Progress Monitor'] as ServiceName[]
            },
            {
                title: "Academic Admin (मैनेजमेंट कार्य)",
                services: ['AI Homework Hub', 'Test Paper Guru', 'Syllabus Tracker', 'Lesson Planner', 'Automated Timetable Generator'] as ServiceName[]
            },
            {
                title: "My Office (स्टाफ टूल्स)",
                services: ['Smart HR Manager', 'Smart Proxy Manager', 'Change Password', 'Video Guide'] as ServiceName[]
            }
        ]
    };

    if (activeService === 'overview') {
        return (
            <div className="space-y-6 animate-pop-in pb-32 h-full flex flex-col">
                 <div className="flex items-center gap-3 mb-4">
                     <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                        <AcademicCapIcon className="h-8 w-8"/>
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Teacher Console</h2>
                        <p className="text-sm text-slate-500 font-bold">Manage your class and lessons</p>
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
        <div className="animate-pop-in-up h-full flex flex-col relative pb-20">
            <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-50">
                <button onClick={() => setActiveService('overview')} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-900 hover:text-primary transition-all active:scale-90 flex items-center justify-center gap-3 font-bold group">
                    <ArrowLeftIcon className="h-6 w-6 group-hover:-translate-x-1 transition-transform" /> <span className="font-hindi text-sm">BACK</span>
                </button>
                <div className="text-right">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{activeService}</h2>
                </div>
            </header>
            
            <div className="flex-1 bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative min-h-[800px]">
                {ServiceComponent && (
                    <Suspense fallback={<Loader message="Opening..." />}>
                        <ServiceComponent user={user} setActiveService={setActiveService} />
                    </Suspense>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
