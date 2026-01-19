
import React, { Suspense } from 'react';
import { ServiceName, User } from '../types';
import ServicesPanel from './ServicesPanel';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { ArrowLeftIcon, SparklesIcon, CheckCircleIcon, BookOpenIcon, StarIcon, FireIcon, ClockIcon } from './icons/AllIcons';
import Loader from './Loader';
import { useFilteredServices } from '../hooks/useFilteredServices';
import { useLanguage } from '../contexts/LanguageContext';
import { useClassroom } from '../contexts/ClassroomContext';
import { useAppConfig } from '../contexts/AppConfigContext';

// Widgets
import AiGlanceWidget from './AiGlanceWidget';
import SuryanshuAstroWidget from './student_dashboard/SuryanshuAstroWidget';
import GamificationWidget from './student_dashboard/GamificationWidget';
import TodaysAgendaWidget from './student_dashboard/TodaysAgendaWidget';
import LearningPathWidget from './student_dashboard/LearningPathWidget';
import ParentBridgeWidget from './student_dashboard/ParentBridgeWidget';
import JumpBackInWidget from './student_dashboard/JumpBackInWidget';
import DailyQuestWidget from './student_dashboard/DailyQuestWidget';

interface StudentDashboardProps {
  user: User;
  activeService: ServiceName | 'overview';
  setActiveService: (service: ServiceName | 'overview') => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, activeService, setActiveService }) => {
  const studentServices = useFilteredServices(user.role);
  const { t } = useLanguage();
  const { selectedClass } = useClassroom();
  const { institutionName } = useAppConfig();

  if (activeService === 'overview') {
    return (
        <div className="space-y-8 animate-pop-in pb-32 h-full flex flex-col">
            
            {/* Top 'Stories' Row - Quick Status */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                <div className="min-w-[140px] h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-4 text-white flex flex-col justify-between shadow-lg hover:scale-105 transition-transform cursor-pointer">
                    <StarIcon className="h-6 w-6 text-yellow-300"/>
                    <div>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Level 7</p>
                        <p className="font-black text-lg">Prodigy</p>
                    </div>
                </div>
                <div className="min-w-[140px] h-32 bg-white border border-slate-100 rounded-[2rem] p-4 text-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <FireIcon className="h-6 w-6 text-orange-500"/>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak</p>
                        <p className="font-black text-lg">12 Days</p>
                    </div>
                </div>
                <div className="min-w-[140px] h-32 bg-slate-900 rounded-[2rem] p-4 text-white flex flex-col justify-between shadow-lg cursor-pointer">
                    <ClockIcon className="h-6 w-6 text-green-400"/>
                    <div>
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Study Time</p>
                        <p className="font-black text-lg">4.5 Hrs</p>
                    </div>
                </div>
                 {/* Active Plan Pill */}
                 <div className="min-w-[200px] h-32 bg-white border-2 border-slate-100 rounded-[2rem] p-5 flex flex-col justify-center relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 bg-primary/10 rounded-full blur-xl -mr-4 -mt-4"></div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{institutionName}</p>
                     <h3 className="text-xl font-black text-slate-900">{selectedClass}</h3>
                     <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit mt-2">
                         <CheckCircleIcon className="h-3 w-3" /> Active
                     </span>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Feed Column */}
                <div className="lg:col-span-8 space-y-8">
                    <AiGlanceWidget user={user} />
                    
                    {/* Featured Tools Grid (Bento Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div onClick={() => setActiveService('AI Tutor')} className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                             <BookOpenIcon className="h-10 w-10 mb-4 text-white/90"/>
                             <h3 className="text-2xl font-black mb-1">AI Tutor</h3>
                             <p className="text-blue-100 text-sm font-medium">Ask doubts in Hindi/Hinglish</p>
                         </div>
                         <div onClick={() => setActiveService('Online Exam')} className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] text-slate-900 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group">
                             <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-4 group-hover:rotate-12 transition-transform">
                                 <SparklesIcon className="h-6 w-6"/>
                             </div>
                             <h3 className="text-2xl font-black mb-1">Exam Prep</h3>
                             <p className="text-slate-500 text-sm font-medium">Practice tests & AI analysis</p>
                         </div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-soft">
                        <div className="flex items-center gap-3 mb-8">
                             <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                                <SparklesIcon className="h-6 w-6"/>
                             </div>
                             <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Student Toolkit</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">All Apps & Services</p>
                             </div>
                        </div>
                        <ServicesPanel services={studentServices} onServiceSelect={setActiveService} />
                    </div>
                </div>
                
                {/* Right Sidebar - Widgets */}
                <div className="lg:col-span-4 space-y-6">
                    <DailyQuestWidget />
                    <GamificationWidget user={user} onNavigate={setActiveService} />
                    <TodaysAgendaWidget user={user} onNavigate={setActiveService} />
                    <JumpBackInWidget onNavigate={setActiveService} />
                    <SuryanshuAstroWidget />
                    <ParentBridgeWidget />
                </div>
            </div>
        </div>
    );
  }

  const ServiceComponent = SERVICE_COMPONENTS[activeService];
  return (
    <div className="animate-pop-in-up h-full flex flex-col relative pb-20">
      <header className="flex items-center justify-between mb-6 sticky top-0 z-50 pt-2">
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-2 pr-6 rounded-full shadow-lg flex items-center gap-4">
              <button onClick={() => setActiveService('overview')} className="p-3 bg-slate-900 rounded-full text-white hover:scale-105 transition-transform shadow-md">
                  <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex flex-col">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">{activeService}</h2>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Module</span>
              </div>
          </div>
      </header>
      <div className="flex-1 bg-white rounded-[3rem] shadow-2xl border-4 border-slate-50 overflow-hidden relative min-h-[600px]">
          {ServiceComponent ? (
            <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader message="Loading Module..." /></div>}>
                <ServiceComponent user={user} setActiveService={setActiveService} />
            </Suspense>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 font-hindi text-xl">Module loading...</div>
          )}
      </div>
    </div>
  );
};

export default StudentDashboard;
