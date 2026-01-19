
import React, { useState } from 'react';
import { User, UserRole, LocationType } from '../types';
import { 
    UserCircleIcon, ShieldCheckIcon, SparklesIcon, 
    ArrowRightIcon, KeyIcon, ArrowLeftIcon, BriefcaseIcon,
    AcademicCapIcon, FaceSmileIcon, CheckCircleIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useAppConfig } from '../contexts/AppConfigContext';
import { MANGMAT_HUB_REGISTRY } from '../services/geminiService';
import { franchiseService } from '../services/franchiseService';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
    onBackToWebsite: () => void;
    onNavigateToAdmission?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBackToWebsite, onNavigateToAdmission }) => {
    const toast = useToast();
    const { setConfig, logoUrl, institutionName } = useAppConfig();
    const [loading, setLoading] = useState(false);
    
    // Role Selection
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    
    // Inputs
    const [loginId, setLoginId] = useState('');
    const [loginPass, setLoginPass] = useState('');
    
    // Persistent Login State - Default TRUE for convenience
    const [rememberMe, setRememberMe] = useState(true);

    const loginRoles = [
        { id: UserRole.Student, label: 'Student', hindi: 'छात्र / छात्रा', icon: <AcademicCapIcon />, desc: 'लर्निंग और होमवर्क' },
        { id: UserRole.Teacher, label: 'Teacher', hindi: 'शिक्षक / स्टाफ', icon: <UserCircleIcon />, desc: 'क्लास और अटेंडेंस' },
        { id: UserRole.Admin, label: 'Admin', hindi: 'प्रिंसिपल / एडमिन', icon: <ShieldCheckIcon />, desc: 'पूरा स्कूल मैनेजमेंट' },
        { id: UserRole.Company, label: 'Company', hindi: 'कंपनी / रिक्रूटर', icon: <BriefcaseIcon />, desc: 'हयरिंग और जॉब्स' },
        { id: UserRole.Parent, label: 'Parent', hindi: 'अभिभावक', icon: <FaceSmileIcon />, desc: 'बच्चे की रिपोर्ट' },
    ];

    const saveUserSession = (user: User) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('sarthi_logged_user', JSON.stringify(user));
        toast.success(rememberMe ? `Login Saved! (लॉगिन सुरक्षित)` : `Welcome ${user.name}`);
        onLoginSuccess(user);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if(!loginId || !loginPass) { toast.error("ID और पासवर्ड भरें"); return; }
        
        setLoading(true);
        setTimeout(() => {
            const upperId = loginId.toUpperCase();
            
            // 1. Check Dynamic Registry (Newly Registered Companies/Schools)
            const dynamicUser = franchiseService.authenticateFranchise(upperId, loginPass);
            
            if (dynamicUser) {
                if (dynamicUser.type === LocationType.Corporate) {
                     const companyUser: User = { 
                        id: dynamicUser.id, 
                        name: dynamicUser.name, 
                        role: UserRole.Company, 
                        username: dynamicUser.id 
                    };
                    saveUserSession(companyUser);
                    setLoading(false);
                    return;
                } else {
                     setConfig({ institutionName: dynamicUser.name, institutionType: dynamicUser.type, logoUrl: dynamicUser.logoUrl });
                     const adminUser: User = { 
                        id: dynamicUser.id, 
                        name: dynamicUser.name + ' Admin', 
                        role: UserRole.Admin, 
                        username: dynamicUser.id 
                    };
                    saveUserSession(adminUser);
                    setLoading(false);
                    return;
                }
            }

            // 2. Check Hardcoded Registry (Demo Accounts)
            const hub = MANGMAT_HUB_REGISTRY[upperId];
            if (hub && hub.pass === loginPass) {
                setConfig({ institutionName: hub.name, selectedState: hub.state, institutionType: hub.type });
                const adminUser: User = { id: upperId, name: `${hub.name} Admin`, role: UserRole.Admin, username: loginId };
                saveUserSession(adminUser);
            } 
            // 3. Special Hardcoded Company
            else if (upperId === 'MGM-CMP-001' && loginPass === 'admin123') {
                const companyUser: User = { id: 'MGM-CMP-001', name: 'MGM Enterprise HR', role: UserRole.Company, username: 'recruiter' };
                saveUserSession(companyUser);
            }
            // 4. Default/Student Login Fallback (For Demo simplicity)
            else {
                let finalRole = selectedRole || UserRole.Student;
                if (upperId.includes('TCH')) finalRole = UserRole.Teacher;
                if (upperId.includes('PAR')) finalRole = UserRole.Parent;

                const studentUser: User = { 
                    id: loginId, 
                    name: loginId.split('-')[0] || 'User', 
                    role: finalRole, 
                    username: loginId 
                };
                saveUserSession(studentUser);
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-primary">
            <div className="w-full max-w-6xl bg-white rounded-3xl sm:rounded-[4rem] shadow-[0_0_100px_rgba(245,158,11,0.2)] overflow-hidden border-4 sm:border-8 border-white/5 animate-pop-in relative">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
                    {/* Left Side: Branding */}
                    <div className="lg:col-span-5 p-8 sm:p-12 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20 animate-pulse"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                {logoUrl ? (
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <ShieldCheckIcon className="h-10 w-10 text-primary"/>
                                )}
                                
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Secure Access</span>
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none mb-4">{institutionName || 'MANGMAT'} <br/> <span className="text-primary not-italic">PORTAL</span></h2>
                            <p className="text-slate-400 font-hindi text-lg sm:text-xl leading-relaxed">"भविष्य की शिक्षा, <br/> आज का सार्थी।"</p>
                        </div>
                        
                        <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md mt-6 lg:mt-0">
                             <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="h-4 w-4 text-yellow-300"/>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Smart Cache Mode</p>
                             </div>
                             <p className="text-xs text-slate-400 font-hindi leading-relaxed">
                                 आपका डेटा लोकल कैश में सुरक्षित रहता है। इंटरनेट कम होने पर भी ऐप तेज़ चलेगा।
                             </p>
                        </div>
                    </div>

                    {/* Right Side: Role Selection & Form */}
                    <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center bg-slate-50/50 relative">
                        <div className="absolute top-6 right-6 z-20">
                             <button onClick={onBackToWebsite} className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                                <ArrowLeftIcon className="h-4 w-4"/> BACK TO HOME
                             </button>
                        </div>

                        {!selectedRole ? (
                            <div className="space-y-8 animate-fade-in mt-8 lg:mt-0">
                                <div>
                                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Who are you?</h3>
                                    <p className="text-slate-500 font-hindi mt-2 text-lg font-bold">आगे बढ़ने के लिए अपनी पहचान चुनें</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {loginRoles.map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => setSelectedRole(role.id)}
                                            className="group flex items-start gap-4 p-5 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-primary hover:shadow-xl transition-all text-left relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                                {React.cloneElement(role.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" })}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-800 uppercase text-sm">{role.label}</h4>
                                                <p className="text-sm font-hindi font-bold text-slate-500 mt-1">{role.hindi}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-2 group-hover:text-primary">{role.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-slide-in-right mt-8 lg:mt-0">
                                <button onClick={() => setSelectedRole(null)} className="text-xs font-bold text-slate-400 hover:text-primary flex items-center gap-1 mb-4">
                                    <ArrowLeftIcon className="h-3 w-3"/> CHANGE ROLE
                                </button>

                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-primary/20">
                                        Login as {selectedRole}
                                    </div>
                                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Credentials</h3>
                                    <p className="text-slate-500 font-hindi mt-2 text-lg">कृपया अपनी आईडी और पासवर्ड दर्ज करें</p>
                                </div>
                                
                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <UserCircleIcon className="absolute left-4 top-4 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors"/>
                                            <input value={loginId} onChange={e => setLoginId(e.target.value)} placeholder={`${selectedRole} ID / Username`} className="w-full p-4 pl-12 bg-white border-2 border-slate-100 rounded-3xl font-bold focus:border-primary outline-none shadow-sm transition-all" autoFocus />
                                        </div>
                                        <div className="relative group">
                                            <KeyIcon className="absolute left-4 top-4 h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors"/>
                                            <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Password" className="w-full p-4 pl-12 bg-white border-2 border-slate-100 rounded-3xl font-bold focus:border-primary outline-none shadow-sm transition-all" />
                                        </div>
                                        
                                        {/* REMEMBER ME TOGGLE - Auto Checked */}
                                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${rememberMe ? 'bg-primary border-primary' : 'bg-white border-slate-300'}`}>
                                                {rememberMe && <CheckCircleIcon className="h-4 w-4 text-white" />}
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 select-none font-hindi">
                                                मुझे याद रखें (बार-बार पासवर्ड न मांगें)
                                            </span>
                                        </div>
                                    </div>

                                    <button disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl hover:bg-primary hover:text-slate-950 transition-all flex items-center justify-center gap-3 text-xl uppercase active:scale-95">
                                        {loading ? "VERIFYING..." : "ENTER DASHBOARD"} <ArrowRightIcon className="h-6 w-6" />
                                    </button>
                                </form>

                                <div className="text-center pt-4 border-t border-slate-100">
                                    <button onClick={onNavigateToAdmission} className="text-xs font-black text-slate-400 hover:text-primary hover:underline uppercase tracking-widest">Don't have an ID? Register Now</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
