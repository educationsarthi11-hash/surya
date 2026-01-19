
import React, { useState, useEffect, useRef } from 'react';
import { 
    CheckCircleIcon, ArrowLeftIcon, PrinterIcon, UserCircleIcon, 
    SparklesIcon, PhotoIcon, AcademicCapIcon,
    ArrowRightIcon, CameraIcon, PhoneIcon, ShieldCheckIcon,
    BuildingOfficeIcon, MapPinIcon, CurrencyRupeeIcon, KeyIcon, BoltIcon,
    UserPlusIcon, UploadIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import UnifiedScanner from './UnifiedScanner';
import { franchiseService } from '../services/franchiseService';
import { studentService } from '../services/studentService';
import { Franchise, LocationType, User, UserRole } from '../types';
import { courseCatalog } from '../config/classroomData';

type RegStep = 'details' | 'otp' | 'security' | 'success';

interface AdmissionFormProps {
    onBack?: () => void;
    onLoginSuccess?: (user: User) => void; 
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ onBack, onLoginSuccess }) => {
  const toast = useToast();
  
  // Registration State
  const [step, setStep] = useState<RegStep>('details');
  const [loading, setLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    fatherName: '', 
    mobile: '', 
    aadhar: '',
    course: 'Class 5',
    otp: '',
    password: '',
    confirmPassword: '',
    generatedId: '',
    photoPreview: ''
  });

  const handleScanComplete = (result: any) => {
      // AI Scan Result Mapping
      setFormData(prev => ({ 
          ...prev, 
          name: result.name || prev.name, 
          fatherName: result.fatherName || prev.fatherName,
          aadhar: result.aadharNumber || prev.aadhar 
      }));
      toast.success("AI ने आधार कार्ड पढ़ लिया है! (Details Auto-filled)");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const previewUrl = URL.createObjectURL(file);
          setFormData(prev => ({ ...prev, photoPreview: previewUrl }));
      }
  };

  const sendOTP = () => {
      if (formData.mobile.length < 10) { toast.error("सही मोबाइल नंबर भरें"); return; }
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          toast.success("OTP आपके मोबाइल पर भेज दिया गया है (123456)");
          setStep('otp');
      }, 1500);
  };

  const verifyOTP = () => {
      if (formData.otp === '123456') {
          toast.success("नंबर वेरिफाई हो गया!");
          setStep('security');
      } else {
          toast.error("गलत OTP, कृपया 123456 डालें");
      }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
          toast.error("पासवर्ड मैच नहीं हो रहे");
          return;
      }
      
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          const newId = `MGM-STU-${Math.floor(1000 + Math.random() * 9000)}`;
          
          // Save to student service for demo persistence
          studentService.addStudent({
              id: newId,
              name: formData.name,
              fatherName: formData.fatherName,
              mobileNumber: formData.mobile,
              className: formData.course,
              address: 'Mangmat Village', 
              age: '12', 
              email: '',
              motherName: '',
              photoUrl: formData.photoPreview // Save the photo URL
          });

          setFormData(prev => ({ ...prev, generatedId: newId }));
          
          // --- AUTO LOGIN & PERSISTENCE ---
          const userObj: User = {
              id: newId,
              name: formData.name,
              role: UserRole.Student,
              username: newId,
              mobileNumber: formData.mobile,
              fatherName: formData.fatherName,
              photoUrl: formData.photoPreview
          };
          
          setStep('success');
          toast.success("अकाउंट बन गया! Mangmat School में आपका स्वागत है।");
          
          // Optional: Auto login after 2 seconds
          setTimeout(() => {
             if (onLoginSuccess) onLoginSuccess(userObj);
          }, 2000);

      }, 2000);
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl max-w-5xl mx-auto relative overflow-hidden min-h-[700px] border-8 border-slate-50 font-sans selection:bg-primary">
        {loading && <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center rounded-[3rem]"><Loader message="AI प्रोसेसिंग कर रहा है..." /></div>}

        {/* Header - Progress */}
        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-6">
             <div className="absolute top-0 right-0 p-20 bg-primary/10 rounded-full blur-[80px]"></div>
             <div className="relative z-10 flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-slate-950 shadow-lg"><UserPlusIcon className="h-8 w-8"/></div>
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">MANGMAT <span className="text-primary not-italic">ADMISSION</span></h3>
                    <p className="text-[10px] font-bold text-slate-50 uppercase tracking-widest mt-1">Education Sarthi School • No Cost Plan</p>
                </div>
             </div>
             
             <div className="flex gap-2 relative z-10">
                 <span className="px-4 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-[10px] font-black uppercase tracking-widest text-green-400 flex items-center gap-2">
                     <CheckCircleIcon className="h-3 w-3"/> Zero Fee
                 </span>
                 <span className="px-4 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                     <BoltIcon className="h-3 w-3"/> AI Verified
                 </span>
             </div>
        </div>

        <div className="p-8 sm:p-12">
            {step === 'details' && (
                <div className="space-y-8 animate-slide-in-right">
                     <button onClick={() => setIsScannerOpen(true)} className="w-full p-6 bg-blue-50 border-4 border-dashed border-blue-200 rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-blue-100 transition-all group">
                        <CameraIcon className="h-10 w-10 text-blue-500 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                            <span className="block font-hindi font-black text-blue-800 text-xl italic tracking-tighter">AI आधार स्कैन</span>
                            <span className="block text-xs font-bold text-blue-600 uppercase tracking-widest">Auto-fill Form (Recommended)</span>
                        </div>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                             <div>
                                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Student Name</label>
                                 <div className="relative">
                                     <UserCircleIcon className="absolute left-5 top-4 h-6 w-6 text-slate-300"/>
                                     <input 
                                        value={formData.name} 
                                        onChange={e => setFormData({...formData, name: e.target.value})} 
                                        className="w-full pl-14 p-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-3xl font-bold text-lg outline-none transition-all shadow-inner" 
                                        placeholder="Full Name"
                                     />
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Father's Name</label>
                                 <input 
                                    value={formData.fatherName} 
                                    onChange={e => setFormData({...formData, fatherName: e.target.value})} 
                                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-3xl font-bold outline-none transition-all shadow-inner" 
                                    placeholder="Father Name"
                                 />
                             </div>
                             <div>
                                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Course / Class</label>
                                 <select 
                                    value={formData.course} 
                                    onChange={e => setFormData({...formData, course: e.target.value})} 
                                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-3xl font-bold outline-none transition-all shadow-inner appearance-none"
                                 >
                                     <option>Class 5</option>
                                     <option>Class 6</option>
                                     <option>Class 7</option>
                                     <option>Class 8</option>
                                     <option>Class 9</option>
                                     <option>Class 10</option>
                                 </select>
                             </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Mobile Number</label>
                                 <div className="relative">
                                     <PhoneIcon className="absolute left-5 top-4 h-6 w-6 text-slate-300"/>
                                     <input 
                                        value={formData.mobile} 
                                        onChange={e => setFormData({...formData, mobile: e.target.value})} 
                                        className="w-full pl-14 p-4 bg-slate-50 border-2 border-transparent focus:border-primary rounded-3xl font-bold text-lg outline-none transition-all shadow-inner" 
                                        placeholder="98XXXXXXXX"
                                     />
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Upload Photo</label>
                                 <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-slate-100 relative overflow-hidden"
                                 >
                                     {formData.photoPreview ? (
                                         <img src={formData.photoPreview} className="w-full h-full object-cover" alt="Preview"/>
                                     ) : (
                                         <div className="text-center text-slate-400">
                                             <PhotoIcon className="h-8 w-8 mx-auto mb-1"/>
                                             <span className="text-xs font-bold uppercase">Click to Upload</span>
                                         </div>
                                     )}
                                     <input type="file" ref={fileInputRef} className="hidden" onChange={handlePhotoUpload} accept="image/*"/>
                                 </div>
                             </div>
                        </div>
                    </div>

                    <button onClick={sendOTP} className="w-full py-6 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 text-xl uppercase tracking-widest active:scale-95">
                        Verify Mobile <ArrowRightIcon className="h-6 w-6"/>
                    </button>
                </div>
            )}

            {step === 'otp' && (
                <div className="max-w-md mx-auto space-y-8 text-center animate-slide-in-right">
                    <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <ShieldCheckIcon className="h-12 w-12"/>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">Verify OTP</h3>
                    <p className="text-slate-500 font-hindi">हमने {formData.mobile} पर कोड भेजा है (Demo: 123456)</p>
                    
                    <input 
                        value={formData.otp} 
                        onChange={e => setFormData({...formData, otp: e.target.value})} 
                        className="w-full p-6 text-center text-4xl tracking-[0.5em] font-black border-2 border-slate-200 rounded-3xl focus:border-primary outline-none"
                        maxLength={6}
                        placeholder="000000"
                    />
                    
                    <button onClick={verifyOTP} className="w-full py-5 bg-green-600 text-white font-black rounded-3xl shadow-xl hover:bg-green-700 transition-all uppercase tracking-widest text-lg">
                        Verify & Proceed
                    </button>
                    <button onClick={() => setStep('details')} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Change Number</button>
                </div>
            )}

            {step === 'security' && (
                <div className="max-w-md mx-auto space-y-8 animate-slide-in-right">
                    <div className="text-center">
                        <h3 className="text-3xl font-black text-slate-900">Set Password</h3>
                        <p className="text-slate-500 font-hindi mt-2">अपने अकाउंट के लिए सुरक्षित पासवर्ड चुनें</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">New Password</label>
                            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-3xl font-bold outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Confirm Password</label>
                            <input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-primary rounded-3xl font-bold outline-none" />
                        </div>
                    </div>

                    <button onClick={handleFinalSubmit} className="w-full py-6 bg-primary text-slate-950 font-black rounded-[2.5rem] shadow-2xl hover:bg-white transition-all text-xl uppercase tracking-widest flex items-center justify-center gap-3">
                        <CheckCircleIcon className="h-6 w-6"/> Complete Admission
                    </button>
                </div>
            )}

            {step === 'success' && (
                <div className="text-center py-20 space-y-8 animate-pop-in">
                    <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/30">
                        <CheckCircleIcon className="h-16 w-16"/>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Admission Successful!</h2>
                        <p className="text-xl font-hindi text-slate-500 mt-4 max-w-lg mx-auto">
                            बधाई हो! आपका दाखिला <b>Education Sarthi School, Mangmat</b> में हो गया है।
                        </p>
                    </div>
                    
                    <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-200 max-w-md mx-auto relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl">ACTIVE</div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Student ID</p>
                        <p className="text-4xl font-mono font-black text-slate-900 tracking-wider">{formData.generatedId}</p>
                        <p className="text-xs text-slate-400 mt-4">Username: {formData.mobile}</p>
                    </div>

                    <button onClick={() => onLoginSuccess && onLoginSuccess({ id: formData.generatedId, name: formData.name, role: UserRole.Student, username: formData.generatedId })} className="px-12 py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-primary hover:text-slate-950 transition-all uppercase tracking-widest text-sm">
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>

        <UnifiedScanner 
            isOpen={isScannerOpen} 
            onClose={() => setIsScannerOpen(false)} 
            onScanComplete={handleScanComplete}
            title="Aadhar Scanner"
        />
    </div>
  );
};

export default AdmissionForm;
