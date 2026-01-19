import React, { Component, useState, useEffect, Suspense, ReactNode, ErrorInfo } from 'react'; 
import { UserRole, User, ServiceName } from './types';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { MenuIcon, WrenchScrewdriverIcon, EduSarthiLogo } from './components/icons/AllIcons';
import AdmissionScreen from './components/AdmissionScreen';
import Website from './components/Website';
import SetupScreen from './components/SetupScreen'; 
import { useAppConfig } from './contexts/AppConfigContext';
import VoiceNavigation from './components/VoiceNavigation';
import { useLanguage } from './contexts/LanguageContext'; 
import { ThemeCustomizer } from './components/ThemeCustomizer'; 
import GlobalReader from './components/GlobalReader';
import SOSButton from './components/SOSButton';
import LocalizationModal from './components/LocalizationModal';
import OfflineIndicator from './components/OfflineIndicator';
import Loader from './components/Loader';
import SystemCheck from './components/SystemCheck';

interface ErrorBoundaryProps { children?: ReactNode; } 
interface ErrorBoundaryState { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null; }

const GlobalWatermark = () => {
  const { logoUrl } = useAppConfig();
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center select-none opacity-[0.05] transition-opacity duration-1000">
        {logoUrl ? (
            <img src={logoUrl} className="w-[80vw] h-[80vw] object-contain grayscale" alt="" />
        ) : (
            <div className="scale-[8] rotate-[-10deg]">
                <EduSarthiLogo />
            </div>
        )}
    </div>
  );
};

// Fix: Add proper generic types to Component
class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { hasError: true, error, errorInfo: null }; }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { 
    console.error("System Critical Error:", error);
    // Fix: setState now valid on typed Component
    this.setState({ error, errorInfo }); 
  }
  
  handleReload = () => { 
      const win = window as any;
      if (win.caches) {
        win.caches.keys().then((names: any[]) => {
            names.forEach((name: any) => win.caches.delete(name));
            win.location.reload();
        });
      } else {
        win.location.reload();
      }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center text-white font-sans">
          <div className="bg-slate-900/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-3xl max-w-lg w-full border-4 border-red-500/30 animate-pop-in">
            <WrenchScrewdriverIcon className="h-16 w-16 text-red-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl font-black mb-4 font-hindi tracking-tighter italic">सिस्टम रिपेयरिंग...</h1>
            <p className="text-slate-400 mb-8 text-base leading-relaxed font-hindi">
                क्षमा करें, एक तकनीकी त्रुटि हुई है। <br/>
                सिस्टम को रिबूट करने के लिए बटन दबाएं।
            </p>
            <div className="bg-black/40 p-4 rounded-xl mb-6 text-left overflow-hidden">
                <code className="text-xs text-red-300 font-mono break-all">
                    {this.state.error?.message || "Unknown Error"}
                </code>
            </div>
            <button onClick={this.handleReload} className="w-full py-4 bg-primary text-slate-950 rounded-2xl font-black shadow-2xl hover:bg-white hover:text-primary transition-all uppercase tracking-widest text-base">
                FORCE REBOOT (ठीक करें)
            </button>
          </div>
        </div>
      );
    }
    // Fix: props accessible on typed component
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<'website' | 'portal' | 'setup' | 'dashboard'>('website');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { institutionName } = useAppConfig();
  const [activeService, setActiveService] = useState<ServiceName | 'overview'>('overview');
  const { t } = useLanguage(); 

  const [isLocalizationModalOpen, setIsLocalizationModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('sarthi_logged_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setAppState('dashboard');
        } catch(e) { localStorage.removeItem('sarthi_logged_user'); }
    }
    // Only show localization modal if not already set AND not logged in
    const hasSetRegion = localStorage.getItem('sarthi_country');
    if (!hasSetRegion && !savedUser) setIsLocalizationModalOpen(true);
  }, []);

  const handleNavigateToLogin = (target?: string) => {
    if (currentUser) {
        setAppState('dashboard');
    } else {
        setAppState('portal');
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.Student || user.role === UserRole.JobSeeker) {
        setAppState('setup');
    } else {
        setAppState('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sarthi_logged_user');
    setCurrentUser(null);
    setAppState('website');
    setActiveService('overview');
  };

  return (
    <div className="flex h-[100dvh] w-screen bg-transparent text-slate-800 font-sans overflow-hidden relative selection:bg-primary selection:text-white">
      <GlobalWatermark />
      <OfflineIndicator />
      
      {/* CRITICAL FIX: Only run SystemCheck if user is logged in (Dashboard) */}
      {appState === 'dashboard' && <SystemCheck />}
      
      <LocalizationModal isOpen={isLocalizationModalOpen} onClose={() => setIsLocalizationModalOpen(false)} />

      <div className="relative z-10 w-full h-full flex overflow-hidden">
          {appState === 'website' && (
            <div className="w-full h-full overflow-y-auto bg-transparent scroll-smooth">
                <Website onNavigateToLogin={handleNavigateToLogin} onNavigateToAdmission={() => setAppState('portal')} />
            </div>
          )}

          {appState === 'portal' && (
            <div className="w-full h-full overflow-y-auto animate-pop-in bg-white/30 backdrop-blur-md">
                <AdmissionScreen onBack={() => setAppState('website')} onLoginSuccess={handleLoginSuccess} />
            </div>
          )}

          {appState === 'setup' && currentUser && (
             <div className="w-full h-full overflow-y-auto bg-white/80 backdrop-blur-md">
                <SetupScreen user={currentUser} onSetupComplete={() => setAppState('dashboard')} />
             </div>
          )}
          
          {appState === 'dashboard' && currentUser && (
            <>
              <Sidebar 
                user={currentUser} 
                isOpen={isSidebarOpen} 
                setIsOpen={setSidebarOpen} 
                activeService={activeService} 
                setActiveService={(s) => {setActiveService(s); setSidebarOpen(false);}} 
              />
              
              <main className="flex-1 flex flex-col h-full overflow-hidden bg-transparent relative transition-all duration-300 w-full">
                <header className="h-20 flex items-center justify-between px-6 z-30 shrink-0 mt-2">
                    <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-full px-2 py-2 flex items-center gap-4 shadow-lg w-full max-w-full sm:max-w-fit transition-all hover:bg-white/60">
                        <button 
                            onClick={() => setSidebarOpen(!isSidebarOpen)} 
                            className="p-3 bg-primary text-white rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        
                        <div className="flex flex-col pr-6">
                             <h2 className="font-black text-slate-800 tracking-tighter uppercase truncate text-lg italic leading-none drop-shadow-sm">
                                {activeService === 'overview' ? institutionName.split(',')[0] : activeService}
                            </h2>
                            <p className="text-[10px] font-bold text-primary-dark uppercase tracking-[0.3em] opacity-80">
                                {activeService === 'overview' ? 'DASHBOARD' : 'ACTIVE TOOL'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-full border border-white/40 backdrop-blur-md shadow-sm">
                             <div className="w-2 h-2 rounded-full bg-green-50 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{currentUser.role}</span>
                        </div>
                        <button onClick={handleLogout} className="text-[10px] font-black text-white bg-red-500 px-6 py-2.5 rounded-full shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all uppercase tracking-widest active:scale-95 border border-white/20">
                             {t('Logout', 'लॉग आउट')}
                        </button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar flex flex-col w-full">
                    <div className="w-full h-full flex flex-col">
                        <Suspense fallback={<div className="h-full flex items-center justify-center p-20"><Loader message="Loading System..." /></div>}>
                            <Dashboard user={currentUser} activeService={activeService} setActiveService={setActiveService} />
                        </Suspense>
                    </div>
                </div>

                <div className="fixed bottom-24 left-6 z-[100] no-print scale-90 sm:scale-100 origin-bottom-left transition-transform hover:scale-105">
                     <SOSButton />
                </div>
                <div className="fixed bottom-6 left-6 z-[100] no-print scale-90 sm:scale-100 origin-bottom-left transition-transform hover:scale-105">
                     <GlobalReader />
                </div>
                <div className="fixed bottom-6 right-6 z-[100] no-print scale-90 sm:scale-100 origin-bottom-right transition-transform hover:scale-105">
                     <VoiceNavigation onNavigate={setActiveService} />
                </div>
              </main>
            </>
          )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <AppContent />
      <ThemeCustomizer />
    </GlobalErrorBoundary>
  );
};

export default App;