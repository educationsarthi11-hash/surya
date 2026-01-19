
import React, { useState, memo, useEffect } from 'react';
import { User, ServiceName, UserRole } from '../types';
import { 
    EduSarthiLogo, Squares2X2Icon, 
    Cog6ToothIcon, ChartBarIcon, 
    ChevronLeftIcon, ChevronRightIcon, 
    UserPlusIcon, UsersIcon, 
    ArchiveBoxIcon, BanknotesIcon, SignalIcon, SunIcon,
    BuildingOfficeIcon, CheckCircleIcon, XIcon, BoltIcon,
    ShieldCheckIcon
} from './icons/AllIcons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import { usageService } from '../services/usageService';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeService: ServiceName | 'overview';
  setActiveService: (service: ServiceName | 'overview') => void;
}

const NavigationItem = memo(({ name, label, icon, isActive, isHindi, onClick, primaryColor }: { name: ServiceName | 'overview', label: string, icon: React.ReactNode, isActive: boolean, isHindi: boolean, onClick: () => void, primaryColor: string }) => {
    
    const activeStyle = {
        backgroundColor: isActive ? primaryColor : 'transparent',
        color: isActive ? '#ffffff' : '#94a3b8',
        boxShadow: isActive ? `0 4px 20px 0 ${primaryColor}60` : 'none',
        border: isActive ? `1px solid rgba(255,255,255,0.2)` : 'none'
    };

    const navItemClass = `
      group flex items-center px-4 py-4 text-sm font-bold rounded-2xl transition-all duration-300 mb-2 mx-3 relative overflow-hidden
      hover:bg-white/5 hover:text-white
      ${isHindi ? 'font-hindi tracking-wide' : ''}
    `;
    
    return (
        <button onClick={onClick} className={navItemClass} style={activeStyle}>
            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-30 pointer-events-none"></div>}
            <div className="flex-shrink-0 relative z-10 mr-4">
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { 
                    className: `h-6 w-6 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors duration-300'}` 
                })}
            </div>
            <span className="truncate uppercase tracking-wider text-xs sm:text-sm antialiased font-black relative z-10">{label}</span>
        </button>
    );
});

const UsageMeter: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const [stats, setStats] = useState(usageService.getUsageStats(userRole));

    // Refresh stats periodically or on open
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(usageService.getUsageStats(userRole));
        }, 5000);
        return () => clearInterval(interval);
    }, [userRole]);

    const percentage = Math.min(100, (stats.text.used / stats.text.total) * 100);
    
    return (
        <div className="px-5 py-4 mt-2 mb-4 mx-3 bg-slate-800/50 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <BoltIcon className="h-3 w-3 text-yellow-400"/> Daily Limit
                </span>
                <span className="text-[10px] font-mono text-white">{stats.text.used}/{stats.text.total}</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 text-center uppercase tracking-wider">Plan: {stats.plan}</p>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, setIsOpen, activeService, setActiveService }) => {
  const { t, language } = useLanguage();
  const { logoUrl, primaryColor, institutionName } = useAppConfig();
  const isHindi = language === 'hi' || language === 'hr';
  const isAdmin = [UserRole.Admin, UserRole.School, UserRole.College, UserRole.University, UserRole.TechnicalInstitute].includes(user.role);

  // Changed to fixed positioning for ALL screens (Mobile & Desktop)
  const sidebarClasses = `
    bg-[#020617]/95 backdrop-blur-xl text-white flex flex-col flex-shrink-0 h-full no-print border-r border-white/10
    fixed top-0 inset-y-0 left-0 z-[200] shadow-[10px_0_50px_rgba(0,0,0,0.8)]
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    w-80
  `;

  const handleNavClick = (name: ServiceName | 'overview') => {
      setActiveService(name);
      setIsOpen(false); // Auto close on click for better UX since it's an overlay now
  };

  const renderNavItem = (name: ServiceName | 'overview', labelKey: string, icon: React.ReactNode) => (
      <NavigationItem 
          key={name} name={name} label={t(labelKey, labelKey)} icon={icon}
          isActive={activeService === name}
          isHindi={isHindi}
          primaryColor={primaryColor}
          onClick={() => handleNavClick(name)}
      />
  );

  return (
    <>
      {/* Backdrop for clicking outside to close */}
      {isOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-[190] backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setIsOpen(false)}
          ></div>
      )}
      
      <aside className={sidebarClasses}>
        {/* Close Button for easy exit */}
        <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full transition-colors z-50"
        >
            <XIcon className="h-6 w-6" />
        </button>

        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50"></div>
        
        {/* Header */}
        <div className="relative z-20 pt-8 pb-6 px-4">
            <div className="relative bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl p-5 flex items-center gap-4 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="relative shrink-0">
                    <div className="absolute -inset-1 bg-primary rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                    <div className="relative bg-slate-900 rounded-2xl flex items-center justify-center border-2 border-white/10 shadow-inner overflow-hidden w-14 h-14">
                        {logoUrl ? (
                            <img src={logoUrl} className="w-full h-full object-contain p-1" alt="Logo" />
                        ) : (
                            <EduSarthiLogo className="w-8 h-8 text-white" />
                        )}
                    </div>
                </div>

                <div className="flex flex-col min-w-0">
                    <h1 className="font-black text-sm uppercase tracking-tight leading-none text-white drop-shadow-md truncate">
                        {institutionName.split(',')[0]}
                    </h1>
                    <p className="text-[10px] text-slate-400 truncate">{institutionName.split(',')[1] || 'Smart System'}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheckIcon className="h-3 w-3" /> Smart Cache Active
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar px-1 scroll-smooth">
            <UsageMeter userRole={user.role} />
            
            {renderNavItem("overview", "ALL TOOLS", <Squares2X2Icon />)}
            
            {isAdmin && (
                <>
                    <div className="mt-8 px-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3 flex items-center gap-3">
                        <span>MANAGEMENT</span><div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    {renderNavItem("Smart Admissions", "ADMISSIONS", <UserPlusIcon />)}
                    {renderNavItem("Student Database", "STUDENT RECORDS", <UsersIcon />)}
                    {renderNavItem("Fee Management", "ACCOUNTS & FEE", <BanknotesIcon />)}
                    
                    <div className="mt-8 px-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.25em] mb-3 flex items-center gap-3">
                         <span>SYSTEM</span><div className="h-px bg-slate-800 flex-1"></div>
                    </div>
                    {renderNavItem("Analytics Dashboard", "REPORTS", <ChartBarIcon />)}
                    {renderNavItem("Franchise Configurator", "BRAND SETUP", <Cog6ToothIcon />)}
                    {renderNavItem("Sync Center" as any, "CLOUD SYNC", <SignalIcon />)}
                </>
            )}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="h-10 w-10 rounded-xl p-0.5 overflow-hidden shadow-lg bg-slate-800 flex items-center justify-center border-2" style={{borderColor: primaryColor}}>
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} alt="User" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate text-white leading-tight">{user.name}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{user.role}</p>
                </div>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
