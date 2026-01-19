import React, { useState } from 'react';
import { UserRole, LocationType } from '../types';
import { useToast } from '../hooks/useToast';
import { 
    UserCircleIcon, AcademicCapIcon, FaceSmileIcon, 
    CameraIcon, ShieldCheckIcon, KeyIcon, ArrowRightIcon,
    SparklesIcon, UserPlusIcon, MapPinIcon, HomeIcon,
    BuildingOfficeIcon, GlobeAltIcon, PhoneIcon, CheckCircleIcon
} from './icons/AllIcons';
import UnifiedScanner from './UnifiedScanner';
import Loader from './Loader';
import PricingPage from './PricingPage';
import { useAppConfig } from '../contexts/AppConfigContext';
import { stateBoardMapping } from '../config/classroomData';

interface Props {
    onComplete: (user: any) => void;
    onBack: () => void;
}

const UserRegistrationForm: React.FC<Props> = ({ onComplete, onBack }) => {
    const toast = useToast();
    const { setConfig } = useAppConfig();
    const [role, setRole] = useState<UserRole>(UserRole.Student);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        instituteName: '', 
        mobile: '',
        aadhar: '',
        address: '',
        pinCode: '',
        password: '',
        confirmPassword: '',
        state: 'Haryana',
        board: 'HBSE (BSEH)'
    });

    const handleScanComplete = (data: any) => {
        setFormData({ 
            ...formData, 
            name: data.name || '', 
            aadhar: data.aadharNumber || '',
            address: data.address || '' 
        });
        toast.success("AI ने आधार से एड्रेस और नाम पढ़ लिया है!");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Save the student's self-selected board to the app config
        if (role === UserRole.Student) {
            setConfig({
                selectedState: formData.state,
                selectedBoard: formData.board,
                institutionType: LocationType.School // Defaulting to school context for self-registered students
            });
            toast.success(`Board Preferences Saved: ${formData.board}`);
        }

        setStep(3); // Move to Pricing View after details
    };

    const handleFinalComplete = () => {
        // Construct user object for auto-login
        const newUser = {
            id: `USER-${Date.now()}`,
            name: formData.name,
            role: role,
            username: formData.mobile,
            mobileNumber: formData.mobile
        };
        onComplete(newUser);
    };

    const availableBoards = stateBoardMapping[formData.state] || ["CBSE", "ICSE", "State Board"];

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-[4rem] shadow-2xl border-8 border-slate-50 overflow-hidden animate-pop-in">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 bg-primary/10 rounded-full blur-[80px]"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-slate-950 shadow-lg"><ShieldCheckIcon className="h-7 w-7"/></div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Verified <span className="text-primary not-italic">Professional</span></h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">onboarding & verification</p>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-2.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-primary' : 'w-6 bg-white/10'}`}></div>
                    ))}
                </div>
            </div>

            <div className="p-10 sm:p-16">
                {step === 1 && (
                    <div className="space-y-10 animate-fade-in text-center">
                        <h4 className="text-4xl font-black text-slate-900 mb-2 font-hindi uppercase tracking-tighter italic">अपनी पहचान चुनें</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { id: UserRole.Student, label: 'Student', hindi: 'छात्र / छात्रा', icon: <AcademicCapIcon /> },
                                { id: UserRole.Teacher, label: 'Teacher', hindi: 'शिक्षक / शिक्षिका', icon: <UserCircleIcon /> },
                                { id: UserRole.Parent, label: 'Parent', hindi: 'अभिभावक (Parents)', icon: <FaceSmileIcon /> },
                            ].map(r => (
                                <button key={r.id} onClick={() => setRole(r.id)} className={`p-8 rounded-[3rem] border-4 transition-all flex flex-col items-center gap-4 ${role === r.id ? 'border-primary bg-primary/5 shadow-xl scale-105' : 'border-slate-50 bg-slate-50 opacity-60'}`}>
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${role === r.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-400'}`}>
                                        {React.cloneElement(r.icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                                    </div>
                                    <p className="text-lg font-hindi font-black text-slate-800 leading-none">{r.hindi}</p>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setStep(2)} className="w-full py-6 bg-slate-950 text-white font-black rounded-3xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-4 text-xl group uppercase tracking-widest">
                            विवरण भरें (Next) <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-8 animate-slide-in-right">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <button type="button" onClick={() => setIsScannerOpen(true)} className="w-full p-6 bg-blue-50 border-4 border-dashed border-blue-200 rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-blue-100 transition-all group">
                                    <CameraIcon className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="font-hindi font-black text-blue-700 text-xl italic tracking-tighter">AI आधार ऑटो-फिल (Auto-Fill Address)</span>
                                </button>
                            </div>
                            
                            <div className="relative">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-4">Full Name</label>
                                <div className="relative">
                                    <UserCircleIcon className="absolute left-5 top-5 h-6 w-6 text-slate-300"/>
                                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="आपका पूरा नाम" className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold focus:border-primary outline-none text-lg" required />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-4">Mobile Number</label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-5 top-5 h-6 w-6 text-slate-300"/>
                                    <input value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="98XXXXXXXX" className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold focus:border-primary outline-none text-lg" required />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="relative">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-4">State (राज्य)</label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-5 top-5 h-6 w-6 text-slate-300"/>
                                    <select value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold focus:border-primary outline-none text-lg appearance-none">
                                        <option value="Haryana">Haryana</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                        <option value="Bihar">Bihar</option>
                                        <option value="International / Global">International</option>
                                    </select>
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-4">Education Board</label>
                                <div className="relative">
                                    <AcademicCapIcon className="absolute left-5 top-5 h-6 w-6 text-slate-300"/>
                                    <select value={formData.board} onChange={e => setFormData({...formData, board: e.target.value})} className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold focus:border-primary outline-none text-lg appearance-none">
                                        {availableBoards.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-4">Address</label>
                            <div className="relative">
                                <HomeIcon className="absolute left-5 top-5 h-6 w-6 text-slate-300"/>
                                <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="House No, Street, City" className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold focus:border-primary outline-none text-lg" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-4">Password</label>
                                <div className="relative">
                                    <KeyIcon className="absolute left-5 top-5 h-6 w-6 text-slate-300"/>
                                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Secret Code" className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold focus:border-primary outline-none text-lg" />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-4">Confirm Password</label>
                                <div className="relative">
                                    <KeyIcon className="absolute left-5 top-5 h-6 w-6 text-slate-300"/>
                                    <input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="Repeat Code" className="w-full p-5 pl-14 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary outline-none text-lg" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-500 font-bold rounded-[2rem] hover:bg-slate-200">Back</button>
                            <button type="submit" className="flex-[2] py-6 bg-slate-950 text-white font-black rounded-[2rem] shadow-2xl hover:bg-primary transition-all text-xl uppercase tracking-widest">
                                Proceed to Plan
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="animate-pop-in space-y-8">
                         <PricingPage studentAddress={formData.address} studentPinCode={formData.pinCode} />
                         
                         <div className="flex justify-center gap-4">
                             <button onClick={() => setStep(2)} className="px-8 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl">Back to Details</button>
                             <button onClick={handleFinalComplete} className="px-12 py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 uppercase tracking-widest flex items-center gap-3">
                                 <CheckCircleIcon className="h-6 w-6"/> Complete Registration
                             </button>
                         </div>
                    </div>
                )}
            </div>
            
            <UnifiedScanner 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScanComplete={(data) => { handleScanComplete(data); setIsScannerOpen(false); }}
                title="Aadhaar Auto-Fill"
                prompt="Extract Name, Address, and Date of Birth from this ID card."
            />
        </div>
    );
};

export default UserRegistrationForm;