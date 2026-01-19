import React, { Suspense, useMemo, useState } from 'react';
import { UserRole, ServiceName, User } from '../types';
import ServicesPanel from './ServicesPanel';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { 
    ArrowLeftIcon, UsersIcon, BriefcaseIcon, DocumentTextIcon, 
    SparklesIcon, CurrencyRupeeIcon, ChartBarIcon,
    UserPlusIcon, PhoneIcon, RectangleStackIcon,
    AcademicCapIcon
} from './icons/AllIcons';
import Loader from './Loader';
import AiGlanceWidget from './AiGlanceWidget';
import QuickActionsWidget from './QuickActionsWidget';
import { useFilteredServices } from '../hooks/useFilteredServices';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white p-5 rounded-2xl shadow-sm flex items-center space-x-4 border border-slate-100 hover:shadow-lg transition-all`}>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>{icon}</div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <p className="text-xl font-black text-slate-800">{value}</p>
        </div>
    </div>
);

interface CoachingCenterDashboardProps {
  user: User;
  activeService: ServiceName | 'overview';
  setActiveService: (service: ServiceName | 'overview') => void;
}

const CoachingCenterDashboard: React.FC<CoachingCenterDashboardProps> = ({ user, activeService, setActiveService }) => {
  const coachingServices = useFilteredServices(user.role);
  
  // कोचिंग के लिए सबसे जरूरी टूल्स
  const quickActionServiceNames: ServiceName[] = useMemo(() => [
      'Smart Admissions', 
      'Fee Management', 
      'Test Paper Guru', 
      'Recruitment Prep Guru',
      'Auto-Dialer',
      'Online Exam'
  ], []);

  const [activeBatch, setActiveBatch] = useState('All Batches');

  if (activeService === 'overview') {
    return (
      <div className="space-y-8 animate-pop-in pb-20">
        {/* Coaching Branded Header */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 bg-blue-600/20 rounded-full blur-[100px]"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <AcademicCapIcon className="h-8 w-8 text-blue-400" />
                    <h2 className="text-3xl font-black tracking-tight uppercase">Coaching Command Center</h2>
                </div>
                <p className="text-slate-400 font-hindi text-lg font-medium">मल्टी-कोर्स और बैच मैनेजमेंट सिस्टम</p>
            </div>
            <div className="flex gap-3 relative z-10">
                 <button onClick={() => setActiveService('Smart Admissions')} className="px-6 py-3 bg-blue-600 hover:bg-blue-50 text-white rounded-xl font-bold text-sm shadow-xl flex items-center gap-2">
                    <UserPlusIcon className="h-5 w-5"/> न्यू एडमिशन
                 </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
                <AiGlanceWidget user={user} />
                
                {/* Real-time stats for coaching */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard title="कुल छात्र" value="480" icon={<UsersIcon className="h-6 w-6"/>} color="bg-blue-500" />
                    <StatCard title="आज की इंक्वायरी" value="12" icon={<PhoneIcon className="h-6 w-6"/>} color="bg-orange-500" />
                    {/* Fixed: Replaced non-existent BookmarkSquareIcon with RectangleStackIcon */}
                    <StatCard title="सक्रिय बैच" value="15" icon={<RectangleStackIcon className="h-6 w-6"/>} color="bg-purple-500" />
                    <StatCard title="फीस कलेक्शन" value="₹2.4L" icon={<CurrencyRupeeIcon className="h-6 w-6"/>} color="bg-emerald-500" />
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <SparklesIcon className="h-5 w-5 text-primary"/>
                            मैनेजमेंट टूल्स (All Tools)
                        </h3>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-primary">प्रशासन</button>
                            <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500">एकेडमिक</button>
                        </div>
                    </div>
                    <ServicesPanel services={coachingServices} onServiceSelect={setActiveService} gridClassName="grid grid-cols-2 sm:grid-cols-3 gap-4" />
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <QuickActionsWidget 
                    onActionClick={setActiveService} 
                    serviceNames={quickActionServiceNames} 
                    title="Quick Tools"
                    hindiTitle="कोचिंग के लिए"
                />

                {/* Batch Switcher / Course Overview */}
                <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl">
                    <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-slate-400">कोर्स के अनुसार स्थिति</h4>
                    <div className="space-y-4">
                        {[
                            { name: 'JEE Advanced', students: 45, color: 'bg-blue-500' },
                            { name: 'NEET Batch B', students: 62, color: 'bg-emerald-500' },
                            { name: 'Class 10th Foundation', students: 120, color: 'bg-orange-500' },
                            { name: 'SSC CGL Prep', students: 85, color: 'bg-purple-500' }
                        ].map(course => (
                            <div key={course.name} className="group cursor-pointer">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{course.name}</span>
                                    <span className="text-xs font-bold text-slate-400">{course.students} छात्र</span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className={`${course.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${(course.students/150)*100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10 uppercase tracking-widest">
                        सभी कोर्सेज देखें
                    </button>
                </div>

                <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-3">AI इन्क्वायरी असिस्टेंट</h4>
                    <p className="text-xs text-blue-700 leading-relaxed mb-4">
                        पिछले 24 घंटों में 12 नई पूछताछ आई हैं। AI के अनुसार, इनमें से 5 छात्र एडमिशन लेने के लिए अत्यधिक इच्छुक हैं।
                    </p>
                    <button onClick={() => setActiveService('Auto-Dialer')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-700">
                        उनको अभी कॉल करें
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  const ServiceComponent = SERVICE_COMPONENTS[activeService];
  const serviceInfo = coachingServices.find(s => s.name === activeService);
  
  return (
    <div className="animate-pop-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-[50]">
        <button 
          onClick={() => setActiveService('overview')}
          className="p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeftIcon className="h-6 w-6" /> <span className="font-hindi">वापस डैशबोर्ड</span>
        </button>
        <div className="text-right">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{activeService}</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">Coaching Tool Live</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-6 min-h-[800px]">
        {ServiceComponent && (
            <Suspense fallback={<div className="flex justify-center items-center h-full min-h-[300px]"><Loader message="Loading Coaching Tool..." /></div>}>
                <ServiceComponent user={user} setActiveService={setActiveService} />
            </Suspense>
        )}
      </div>
    </div>
  );
};

export default CoachingCenterDashboard;