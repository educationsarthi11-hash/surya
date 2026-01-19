import React, { useState, useRef } from 'react';
import { GlobeAltIcon, SparklesIcon, CheckCircleIcon, BuildingOfficeIcon, PhoneIcon, MapPinIcon, AcademicCapIcon, WrenchScrewdriverIcon, ArrowRightIcon, KeyIcon, BriefcaseIcon, DocumentTextIcon, PhotoIcon, UploadIcon, XCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { LocationType, UserRole } from '../types';
import Loader from './Loader';
import { franchiseService } from '../services/franchiseService';
import { useAppConfig } from '../contexts/AppConfigContext';
import { stateBoardMapping } from '../config/classroomData';

interface Props {
    onComplete: (data: any) => void;
    onBack: () => void;
}

const FranchiseRegistrationForm: React.FC<Props> = ({ onComplete, onBack }) => {
    const toast = useToast();
    const { setConfig } = useAppConfig();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        ownerName: '',
        institutionName: '',
        type: LocationType.School,
        city: '',
        address: '', 
        description: '', 
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        state: 'Haryana', // Default State
        board: 'HBSE (BSEH)' // Default Board
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Get boards based on selected state (Dynamic)
    const availableBoards = stateBoardMapping[formData.state] || ["CBSE", "ICSE", "State Board"];

    const handleNext = () => {
        if (step === 1 && (!formData.institutionName || !formData.ownerName)) {
            toast.error("कृपया संस्था/कंपनी और अपना नाम भरें।");
            return;
        }
        setStep(prev => prev + 1);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size too large. Max 5MB.");
                return;
            }
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("पासवर्ड मैच नहीं हो रहे हैं।");
            return;
        }
        if (!formData.address || !formData.mobile) {
            toast.error("कृपया पता और मोबाइल नंबर भरें।");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            
            // Generate Dynamic ID
            const prefix = formData.type === LocationType.Corporate ? 'CMP' : formData.type.toUpperCase().substring(0,3);
            const masterId = `MGM-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
            
            // Save Franchise
            franchiseService.registerNewFranchise({
                id: masterId,
                name: formData.institutionName,
                type: formData.type,
                ownerName: formData.ownerName,
                address: formData.address, 
                description: formData.description, 
                password: formData.password,
                mobile: formData.mobile,
                logoUrl: logoPreview || undefined, 
                studentCount: 0,
                revenue: 0,
                board: formData.board, // Saving Board info
                state: formData.state
            });

            // Set Global Config immediately so the panel reflects this School's settings
            setConfig({ 
                logoUrl: logoPreview || undefined, 
                institutionName: formData.institutionName,
                selectedBoard: formData.board, // Automatic Board Selection for all students in this school
                selectedState: formData.state,
                institutionType: formData.type
            });

            toast.success(`पंजीकरण सफल! बोर्ड: ${formData.board} सेट हो गया है।`);
            
            // Auto-login data prep
            const newUser = {
                id: masterId,
                name: formData.institutionName,
                role: formData.type === LocationType.Corporate ? UserRole.Company : UserRole.Admin,
                username: masterId
            };
            
            onComplete(newUser);
        }, 2000);
    };

    const isCorporate = formData.type === LocationType.Corporate;
    const nameLabel = isCorporate ? "Company Name (कंपनी का नाम)" : "Institution Name (संस्था का नाम)";
    const ownerLabel = isCorporate ? "HR Manager / Director Name" : "Owner / Principal Name";
    const descLabel = isCorporate ? "About Company (कंपनी का विवरण)" : "About Institution (संस्था का विवरण)";

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-[4rem] shadow-2xl border-8 border-slate-50 overflow-hidden animate-pop-in">
            <div className="p-10 bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-primary/20 rounded-full blur-[100px] -mr-16 -mt-16"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-5 bg-primary rounded-[2rem] shadow-2xl shadow-primary/40 rotate-3 transition-transform hover:rotate-0">
                        {isCorporate ? <BriefcaseIcon className="h-12 w-12 text-slate-950"/> : <BuildingOfficeIcon className="h-12 w-12 text-slate-950"/>}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">{isCorporate ? 'CORPORATE' : 'INSTITUTION'} <span className="text-primary not-italic">REGISTRATION</span></h3>
                        <p className="text-sm text-slate-400 font-hindi mt-1 font-bold opacity-70">
                            {isCorporate ? 'नई कंपनी या रिक्रूटर जोड़ें' : 'नई शाखा या स्कूल जोड़ें'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10">
                    {[1, 2].map(i => (
                        <div key={i} className={`h-2.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-primary shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'w-6 bg-white/10'}`}></div>
                    ))}
                </div>
            </div>

            <div className="p-12 sm:p-20">
                {step === 1 && (
                    <div className="space-y-10 animate-slide-in-right">
                        <div className="text-center">
                            <h4 className="text-4xl font-black text-slate-900 mb-4 font-hindi tracking-tighter uppercase leading-none">Category Selection</h4>
                            <p className="text-slate-500 text-lg">आप किस प्रकार की संस्था रजिस्टर कर रहे हैं?</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { type: LocationType.School, label: 'School', hindi: 'स्कूल (K-12)', icon: <BuildingOfficeIcon /> },
                                { type: LocationType.Corporate, label: 'Company', hindi: 'कंपनी / रिक्रूटर', icon: <BriefcaseIcon /> },
                                { type: LocationType.College, label: 'College', hindi: 'कॉलेज (UG/PG)', icon: <AcademicCapIcon /> },
                                { type: LocationType.ITI, label: 'Institute/ITI', hindi: 'आईटीआई / टेक्निकल', icon: <WrenchScrewdriverIcon /> },
                            ].map(opt => (
                                <button 
                                    key={opt.type}
                                    onClick={() => setFormData({...formData, type: opt.type})}
                                    className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center gap-6 group relative overflow-hidden ${formData.type === opt.type ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'}`}
                                >
                                    <div className={`p-4 rounded-2xl ${formData.type === opt.type ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'} transition-all`}>
                                        {React.cloneElement(opt.icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-xs uppercase tracking-widest mb-1">{opt.label}</p>
                                        <p className="text-xl font-hindi font-black text-slate-500">{opt.hindi}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-2">{nameLabel}</label>
                                <input value={formData.institutionName} onChange={e => setFormData({...formData, institutionName: e.target.value})} placeholder="Ex: Tech Solutions Pvt Ltd" className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-2">{ownerLabel}</label>
                                <input value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} placeholder="Ex: Rajesh Verma" className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary outline-none" />
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-6 bg-slate-950 text-white font-black rounded-[2rem] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-4 text-xl">
                            अगला चरण (Next) <ArrowRightIcon className="h-6 w-6" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-right">
                        <div className="text-center mb-8">
                            <h4 className="text-4xl font-black text-slate-900 mb-2 font-hindi tracking-tighter uppercase">विवरण और सुरक्षा</h4>
                            <p className="text-slate-500">Complete profile for {formData.institutionName}</p>
                        </div>
                        
                        {/* Logo Upload */}
                        <div className="flex justify-center mb-8">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-32 h-32 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all relative overflow-hidden group"
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className="text-center p-4">
                                        <PhotoIcon className="h-8 w-8 text-slate-300 mx-auto mb-1 group-hover:text-primary"/>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight group-hover:text-primary">Upload Logo</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                {logoPreview && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <UploadIcon className="h-6 w-6 text-white"/>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- NEW: BOARD & STATE SELECTION (Crucial for School Admin) --- */}
                        {!isCorporate && (
                            <div className="p-6 bg-blue-50 rounded-[2rem] border-2 border-blue-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <GlobeAltIcon className="h-5 w-5 text-blue-600"/>
                                    <h4 className="font-black text-blue-900 uppercase text-sm tracking-widest">Academic Configuration</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">State (राज्य)</label>
                                        <select 
                                            value={formData.state} 
                                            onChange={e => setFormData({...formData, state: e.target.value})} 
                                            className="w-full p-4 bg-white border-2 border-transparent rounded-2xl font-bold text-slate-800 outline-none"
                                        >
                                            {Object.keys(stateBoardMapping).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Board (शिक्षा बोर्ड)</label>
                                        <select 
                                            value={formData.board} 
                                            onChange={e => setFormData({...formData, board: e.target.value})} 
                                            className="w-full p-4 bg-white border-2 border-transparent rounded-2xl font-bold text-slate-800 outline-none"
                                        >
                                            {availableBoards.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <p className="text-[10px] text-blue-600 mt-3 font-bold ml-2">
                                    * Note: This Board will be automatically applied to all students under this school.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                             <div className="relative">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-2">Full Address (पूरा पता)</label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-4 top-4 h-6 w-6 text-slate-300"/>
                                    <textarea 
                                        value={formData.address} 
                                        onChange={e => setFormData({...formData, address: e.target.value})} 
                                        placeholder="Enter complete address..." 
                                        className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary outline-none resize-none h-24" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="relative">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-2">Mobile Number</label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-4 top-5 h-6 w-6 text-slate-300"/>
                                    <input value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="Contact Number" className="w-full p-5 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary outline-none" required />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-2">City / HQ</label>
                                <div className="relative">
                                    <GlobeAltIcon className="absolute left-4 top-5 h-6 w-6 text-slate-300"/>
                                    <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City / Headquarters" className="w-full p-5 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary outline-none" required />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-2">Password</label>
                                <div className="relative">
                                    <KeyIcon className="absolute left-4 top-5 h-6 w-6 text-slate-300"/>
                                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Set Password" className="w-full p-5 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary outline-none" required />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-2">Confirm Password</label>
                                <div className="relative">
                                    <KeyIcon className="absolute left-4 top-5 h-6 w-6 text-slate-300"/>
                                    <input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="Confirm Password" className="w-full p-5 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold focus:border-primary outline-none" required />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl">वापस</button>
                            <button type="submit" disabled={loading} className="flex-[2] py-5 bg-primary text-slate-950 font-black rounded-[2.5rem] shadow-2xl hover:bg-slate-950 hover:text-white transition-all text-xl uppercase tracking-widest">
                                {loading ? <Loader message="" /> : 'पंजीकरण पूर्ण करें'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FranchiseRegistrationForm;