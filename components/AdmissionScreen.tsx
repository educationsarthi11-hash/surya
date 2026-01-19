
import React, { useState } from 'react';
import { 
    ArrowLeftIcon, EduSarthiLogo, BuildingOfficeIcon, 
    UserCircleIcon, SparklesIcon, ArrowRightIcon, 
    BriefcaseIcon, KeyIcon, ShieldCheckIcon, UserPlusIcon
} from './icons/AllIcons';
import FranchiseRegistrationForm from './FranchiseRegistrationForm';
import UserRegistrationForm from './UserRegistrationForm';
import Login from './Login';
import { useLanguage } from '../contexts/LanguageContext';

interface AdmissionScreenProps {
  onBack: () => void;
  onLoginSuccess: (user: any) => void;
}

const AdmissionScreen: React.FC<AdmissionScreenProps> = ({ onBack, onLoginSuccess }) => {
  const { t } = useLanguage();
  const [view, setView] = useState<'portal-home' | 'login' | 'reg-hub' | 'reg-user'>('portal-home');

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-10 font-sans selection:bg-primary overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12 p-6 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
            <EduSarthiLogo className="h-12" />
            <button 
                onClick={view === 'portal-home' ? onBack : () => setView('portal-home')}
                className="inline-flex items-center px-8 py-4 bg-slate-900 text-white text-[10px] font-black rounded-2xl shadow-xl hover:bg-primary hover:text-slate-950 uppercase tracking-widest active:scale-95 transition-all"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                {view === 'portal-home' ? 'BACK TO WEBSITE' : 'BACK TO CONSOLE'}
            </button>
        </header>

        <main className="pb-20">
          {view === 'portal-home' && (
              <div className="max-w-5xl mx-auto space-y-12 animate-pop-in">
                  <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-primary/20">Executive Management Hub</div>
                      <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">MGM <span className="text-primary not-italic">ENTERPRISE.</span></h2>
                      <p className="text-2xl text-slate-500 font-hindi max-w-2xl mx-auto font-medium">कंपनी डायरेक्टर्स और प्रोफेशनल भर्ती के लिए सुरक्षित प्रवेश</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* OPTION 1: EXECUTIVE LOGIN */}
                      <button 
                        onClick={() => setView('login')}
                        className="group relative bg-slate-900 p-12 rounded-[4rem] shadow-2xl border-4 border-slate-800 hover:border-primary transition-all duration-500 text-left overflow-hidden flex flex-col h-full"
                      >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                          <div className="w-20 h-20 bg-primary text-slate-950 rounded-3xl flex items-center justify-center mb-10 shadow-2xl relative z-10 group-hover:rotate-6 transition-transform">
                              <KeyIcon className="h-10 w-10"/>
                          </div>
                          <h3 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic relative z-10 leading-none">EXECUTIVE <br/> <span className="text-primary">PORTAL LOGIN</span></h3>
                          <p className="text-slate-400 font-hindi text-xl font-medium relative z-10 flex-grow">डायरेक्टर और भारी मैनेजर्स अपनी आईडी से यहाँ प्रवेश करें।</p>
                          <div className="mt-10 flex items-center justify-between w-full relative z-10 border-t border-white/10 pt-6">
                               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Biometric ID Synced</span>
                               <div className="p-3 bg-primary text-slate-900 rounded-full group-hover:translate-x-2 transition-transform shadow-lg"><ArrowRightIcon className="h-5 w-5"/></div>
                          </div>
                      </button>

                      {/* OPTION 2: REGISTRATION (CORPORATE ROLES) */}
                      <div className="space-y-4">
                          <button 
                            onClick={() => setView('reg-user')}
                            className="w-full group relative bg-white p-8 rounded-[3rem] shadow-xl border-4 border-slate-50 hover:border-blue-500 transition-all duration-500 text-left overflow-hidden flex items-center gap-6"
                          >
                             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><ShieldCheckIcon className="h-8 w-8"/></div>
                             <div className="flex-1">
                                 <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">CANDIDATE SIGNUP</h3>
                                 <p className="text-sm text-slate-500 font-hindi font-bold mt-1">उम्मीदवार / छात्र पंजीकरण</p>
                             </div>
                             <ArrowRightIcon className="h-6 w-6 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"/>
                          </button>

                          <button 
                            onClick={() => setView('reg-hub')}
                            className="w-full group relative bg-white p-8 rounded-[3rem] shadow-xl border-4 border-slate-50 hover:border-orange-500 transition-all duration-500 text-left overflow-hidden flex items-center gap-6"
                          >
                             <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><BuildingOfficeIcon className="h-8 w-8"/></div>
                             <div className="flex-1">
                                 <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">COMPANY / HUB</h3>
                                 <p className="text-sm text-slate-500 font-hindi font-bold mt-1">नई कंपनी या शाखा का सेटअप करें</p>
                             </div>
                             <ArrowRightIcon className="h-6 w-6 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"/>
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {view === 'login' && <Login onLoginSuccess={onLoginSuccess} onBackToWebsite={() => setView('portal-home')} onNavigateToAdmission={() => setView('reg-hub')} />}
          {view === 'reg-hub' && <FranchiseRegistrationForm onComplete={(user) => onLoginSuccess(user)} onBack={() => setView('portal-home')} />}
          {view === 'reg-user' && <UserRegistrationForm onComplete={() => setView('portal-home')} onBack={() => setView('portal-home')} />}
        </main>
      </div>
    </div>
  );
};

export default AdmissionScreen;
