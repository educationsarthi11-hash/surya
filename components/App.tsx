import React, { Component, useState, useEffect, Suspense, ReactNode, ErrorInfo } from 'react'; 
import { UserRole, User, ServiceName } from '../types';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import { MenuIcon, WrenchScrewdriverIcon, EduSarthiLogo } from './icons/AllIcons';
import AdmissionScreen from './AdmissionScreen';
import Website from './Website';
import SetupScreen from './SetupScreen'; 
import { useAppConfig } from '../contexts/AppConfigContext';
import VoiceNavigation from './VoiceNavigation';
import { useLanguage } from '../contexts/LanguageContext'; 
import { ThemeCustomizer } from './ThemeCustomizer'; 
import GlobalReader from './GlobalReader';
import SOSButton from './SOSButton';
import LocalizationModal from './LocalizationModal';
import OfflineIndicator from './OfflineIndicator';
import Loader from './Loader';
import SystemCheck from './SystemCheck';

interface ErrorBoundaryProps { children?: ReactNode; } 
interface ErrorBoundaryState { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null; }

const GlobalWatermark = () => {
  const { logoUrl } = useAppConfig();
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center select-none opacity-[0.02] transition-opacity duration-1000">
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

// Fix: Correctly define types in Component extension
class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { hasError: true, error, errorInfo: null }; }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { 
    // Fix: setState now exists on typed Component
    this.setState({ error, errorInfo }); 
  }
  
  handleReload = () => { window.location.reload(); }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center text-white font-sans">
          <div className="bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] shadow-3xl max-w-lg w-full border-4 border-red-500/30 animate-pop-in">
            <WrenchScrewdriverIcon className="h-16 w-16 text-red-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl font-black mb-4 font-hindi tracking-tighter italic">सिस्टम रिपेयरिंग...</h1>
            <p className="text-slate-400 mb-8 text-base leading-relaxed">क्षमा करें, एक तकनीकी त्रुटि हुई है।</p>
            <button onClick={this.handleReload} className="w-full py-4 bg-primary text-slate-950 rounded-2xl font-black shadow-2xl hover:bg-white transition-all uppercase tracking-widest text-base">REBOOT SYSTEM</button>
          </div>
        </div>
      );
    }
    // Fix: props now exists on typed Component
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
    const hasSetRegion = localStorage.getItem('sarthi_country');
    if (!hasSetRegion) setIsLocalizationModalOpen(true);
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
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden w-full relative">
      <GlobalWatermark />
      <OfflineIndicator />
      
      {/* System Health Check - Enabled for Full Smart System Experience */}
      <SystemCheck />
      
      <LocalizationModal isOpen={isLocalizationModalOpen} onClose={() => setIsLocalizationModalOpen(false)} />

      <div className="relative z-10 w-full h-full flex overflow-hidden">
          {appState === 'website' && (
            <div className="w-full h-full overflow-y-auto bg-slate-950/20 scroll-smooth">
                <Website onNavigateToLogin={handleNavigateToLogin} onNavigateToAdmission={() => setAppState('portal')} />
            </div>
          )}

          {appState === 'portal' && (
            <div className="w-full h-full overflow-y-auto animate-pop-in">
                <AdmissionScreen onBack={() => setAppState('website')} onLoginSuccess={handleLoginSuccess} />
            </div>
          )}

          {appState === 'setup' && currentUser && (
             <div className="w-full h-full overflow-y-auto bg-slate-50">
                <SetupScreen user={currentUser} onSetupComplete={() => setAppState('dashboard')} />
             </div>
          )}
          
          {appState === 'dashboard' && currentUser && (
            <>
              {/* Sidebar is now an overlay, doesn't take space in flex layout */}
              <Sidebar 
                user={currentUser} 
                isOpen={isSidebarOpen} 
                setIsOpen={setSidebarOpen} 
                activeService={activeService} 
                setActiveService={(s) => {setActiveService(s); setSidebarOpen(false);}} 
              />
              
              <main className="flex-1 flex flex-col h-full overflow-hidden bg-transparent relative transition-all duration-300 w-full">
                <header className="h-16 lg:h-20 bg-slate-950/40 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 shadow-lg shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(!isSidebarOpen)} 
                            className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <MenuIcon className="h-6 w-6 text-primary" />
                        </button>
                        
                        <div className="flex flex-col">
                             <h2 className="font-black text-white tracking-tighter uppercase truncate max-w-[200px] sm:max-w-[250px] lg:max-w-md text-lg lg:text-xl italic leading-none">
                                {activeService === 'overview' ? institutionName : activeService}
                            </h2>
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-1 opacity-60 hidden sm:block">Secure Connection Stable</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-50 animate-pulse"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentUser.role}</span>
                        </div>
                        <button onClick={handleLogout} className="text-[10px] font-black text-red-400 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 hover:bg-red-50 hover:text-white transition-all uppercase tracking-widest active:scale-95 shadow-xl">
                             {t('Logout', 'लॉग आउट')}
                        </button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar flex flex-col w-full">
                    <div className="w-full h-full flex flex-col">
                        <Suspense fallback={<div className="h-full flex items-center justify-center p-20"><Loader message="Syncing Node Data..." /></div>}>
                            <Dashboard user={currentUser} activeService={activeService} setActiveService={setActiveService} />
                        </Suspense>
                    </div>
                </div>

                <div className="fixed bottom-24 left-4 z-[100] no-print scale-75 sm:scale-100 origin-bottom-left">
                     <SOSButton />
                </div>
                
                <div className="fixed bottom-6 left-4 z-[100] no-print scale-75 sm:scale-100 origin-bottom-left">
                     <GlobalReader />
                </div>

                <div className="fixed bottom-6 right-4 z-[100] no-print scale-75 sm:scale-100 origin-bottom-right">
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