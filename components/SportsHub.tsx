
import React, { useState } from 'react';
import { User, SportsRegistrationData } from '../types';
import { useToast } from '../hooks/useToast';
import { TrophyIcon, CalendarDaysIcon, UploadIcon, CheckCircleIcon, ArrowRightIcon, CameraIcon, PencilSquareIcon } from './icons/AllIcons';
import { analyzeMultipleImagesAndGetJson, extractImageFromPdf } from '../services/geminiService';
import { Type } from '@google/genai';
import Loader from './Loader';

const sportsOptions = ['Cricket', 'Football', 'Basketball', 'Chess', 'Kabaddi', 'Athletics', 'Badminton'];

const mockEvents = [
    { name: 'Inter-School Cricket Tournament Trials', date: 'August 15, 2024', description: 'Trials for the upcoming district-level cricket tournament. Bring your own kit.' },
    { name: 'Annual Sports Day', date: 'September 5, 2024', description: 'The main event of the year! All students are encouraged to participate in various track and field events.' },
    { name: 'Chess Championship Registration', date: 'Deadline: August 20, 2024', description: 'Register now to compete in the school-wide chess championship.' },
];

interface SportsHubProps {
    user: User;
}

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ['Upload Docs', 'Review Details', 'Confirmation'];
    return (
      <nav aria-label="Registration Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-12 sm:pr-20' : ''}`}>
              {stepIdx < currentStep ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-0.5 w-full bg-primary" /></div>
                  <div className="relative flex h-8 w-8 items-center justify-center bg-primary rounded-full"><CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" /></div>
                </>
              ) : stepIdx === currentStep ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-0.5 w-full bg-neutral-200" /></div>
                  <div className="relative flex h-8 w-8 items-center justify-center bg-white border-2 border-primary rounded-full" aria-current="step"><span className="h-2.5 w-2.5 bg-primary rounded-full" aria-hidden="true" /></div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="h-0.5 w-full bg-neutral-200" /></div>
                  <div className="group relative flex h-8 w-8 items-center justify-center bg-white border-2 border-neutral-300 rounded-full"><span className="h-2.5 w-2.5 bg-transparent rounded-full" aria-hidden="true" /></div>
                </>
              )}
               <span className="absolute -bottom-7 left-1/2 -ml-10 w-20 text-center text-[10px] sm:text-xs">{step}</span>
            </li>
          ))}
        </ol>
      </nav>
    );
  };

const SportsHub: React.FC<SportsHubProps> = ({ user }) => {
    const toast = useToast();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [formData, setFormData] = useState<SportsRegistrationData>({
        studentName: user.name,
        selectedSports: [],
        achievements: '',
        contactNumber: '',
        idProof: null,
        certificates: null,
        photo: null,
        signature: null,
    });

    const handleFileUpload = async (file: File, fileType: keyof Omit<SportsRegistrationData, 'studentName' | 'selectedSports' | 'achievements' | 'contactNumber'>) => {
        if (!file) return;

        if ((fileType === 'photo' || fileType === 'signature') && file.type === 'application/pdf') {
            setLoading(true);
            setLoadingMessage(`AI is extracting ${fileType} from PDF...`);
            try {
                const imageFile = await extractImageFromPdf(file);
                setFormData(prev => ({ ...prev, [fileType]: imageFile }));
                toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} extracted successfully!`);
            } catch (error) {
                console.error(error);
                toast.error(`AI could not extract an image from the PDF for ${fileType}.`);
            } finally {
                setLoading(false);
            }
        } else {
            setFormData(prev => ({ ...prev, [fileType]: file }));
        }
    };
    
    const handleAnalyzeDocs = async () => {
        if (!formData.idProof) {
            toast.error("Please upload your ID proof (Aadhar Card) to proceed.");
            return;
        }
        setLoading(true);
        setLoadingMessage("AI is analyzing your documents...");
        
        try {
            const filesToAnalyze: File[] = [formData.idProof];
            if (formData.certificates) {
                filesToAnalyze.push(formData.certificates);
            }

            const prompt = `Analyze the provided ID document (like Aadhaar) and any sports certificates. Your output MUST be a JSON object. Extract the student's name and guardian's mobile number from the ID. Summarize any sports, events, or achievements mentioned in the certificates. The JSON must have three keys: "studentName" (a string), "contactNumber" (a string), and "achievements" (a string summarizing all sports achievements found). If a field isn't found, use an empty string.`;
            const schema = {
                type: Type.OBJECT,
                properties: {
                    studentName: { type: Type.STRING, description: "Student's full name from the ID." },
                    contactNumber: { type: Type.STRING, description: "Guardian's mobile number from the ID." },
                    achievements: { type: Type.STRING, description: "A summary of sports achievements from certificates." }
                },
                required: ["studentName", "contactNumber", "achievements"]
            };

            const result = await analyzeMultipleImagesAndGetJson(prompt, filesToAnalyze, schema);
            setFormData(prev => ({
                ...prev,
                studentName: result.studentName || prev.studentName,
                contactNumber: result.contactNumber || '',
                achievements: result.achievements || '',
            }));
            toast.info("AI has extracted details. Please review and complete your registration.");
            setStep(1);

        } catch (error) {
            console.error("AI analysis failed:", error);
            toast.error("AI could not read the documents. Please try again or fill the form manually.");
            setStep(1); // Move to next step even on failure so user can fill manually
        } finally {
            setLoading(false);
        }
    };

    const handleSportToggle = (sport: string) => {
        setFormData(prev => ({
            ...prev,
            selectedSports: prev.selectedSports.includes(sport)
                ? prev.selectedSports.filter(s => s !== sport)
                : [...prev.selectedSports, sport]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.studentName.trim()) {
            toast.error("Please provide the student's name.");
            return;
        }
        if (formData.selectedSports.length === 0) {
            toast.error("Please select at least one sport/game.");
            return;
        }
        if (!formData.contactNumber.trim()) {
            toast.error("Please provide a parent/guardian contact number.");
            return;
        }
        if (!formData.photo || !formData.signature) {
            toast.error("Please upload both your photo and signature.");
            return;
        }

        setLoading(true);
        setLoadingMessage("Submitting your registration...");
        // Simulate submission
        setTimeout(() => {
            console.log("Sports Registration Data:", {
                studentId: user.id,
                ...formData,
            });
            setLoading(false);
            toast.success("Your interest has been registered successfully!");
            setStep(2);
        }, 1500);
    };

    const resetForm = () => {
        setStep(0);
        setFormData({
            studentName: user.name,
            selectedSports: [],
            achievements: '',
            contactNumber: '',
            idProof: null,
            certificates: null,
            photo: null,
            signature: null,
        });
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-8"><Loader message={loadingMessage} /></div>;
        }
        switch (step) {
            case 0:
                return (
                    <div className="space-y-6 animate-pop-in mt-8">
                        <div className="p-4 border-2 border-dashed rounded-lg">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Upload ID Proof (Aadhar Card)</label>
                            <input type="file" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'idProof')} className="text-sm" accept="image/*,application/pdf" />
                        </div>
                        <div className="p-4 border-2 border-dashed rounded-lg">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Upload Sports Certificates (Optional)</label>
                            <input type="file" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'certificates')} className="text-sm" accept="image/*,application/pdf" />
                        </div>
                        <button onClick={handleAnalyzeDocs} className="w-full flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                            Analyze & Proceed <ArrowRightIcon className="h-5 w-5 ml-2"/>
                        </button>
                    </div>
                );
            case 1:
                return (
                    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-neutral-50 space-y-4 animate-pop-in mt-8">
                        <div>
                            <label htmlFor="studentName" className="block text-sm font-medium text-neutral-700">Student Name</label>
                            <input 
                                type="text"
                                id="studentName"
                                value={formData.studentName}
                                onChange={e => setFormData(p => ({ ...p, studentName: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <fieldset>
                                <legend className="block text-sm font-medium text-neutral-700 mb-2">Select Sport/Game(s)</legend>
                                <div className="flex flex-wrap gap-2">
                                    {sportsOptions.map(sport => (
                                        <div key={sport}>
                                            <input type="checkbox" id={`sport-${sport}`} checked={formData.selectedSports.includes(sport)} onChange={() => handleSportToggle(sport)} className="sr-only peer" />
                                            <label htmlFor={`sport-${sport}`} className="px-3 py-1.5 text-sm rounded-full border cursor-pointer peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary">{sport}</label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                        <div>
                            <label htmlFor="achievements" className="block text-sm font-medium text-neutral-700">Previous Experience / Achievements</label>
                            <textarea id="achievements" value={formData.achievements} onChange={e => setFormData(p => ({...p, achievements: e.target.value}))} rows={3} placeholder="AI will fill this from your certificates." className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 text-sm"></textarea>
                        </div>
                         <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-neutral-700">Parent/Guardian Contact Number</label>
                            <input type="tel" id="contactNumber" value={formData.contactNumber} onChange={e => setFormData(p => ({...p, contactNumber: e.target.value}))} placeholder="AI will fill this from your ID." className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 text-sm" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Upload Your Photo</label>
                                <div className="mt-1 flex items-center gap-2 p-2 border border-dashed rounded-md">
                                    <CameraIcon className="h-5 w-5 text-neutral-500"/>
                                    <input type="file" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'photo')} className="text-sm" accept="image/*,application/pdf" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Upload Signature</label>
                                 <div className="mt-1 flex items-center gap-2 p-2 border border-dashed rounded-md">
                                    <PencilSquareIcon className="h-5 w-5 text-neutral-500"/>
                                    <input type="file" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'signature')} className="text-sm" accept="image/*,application/pdf" />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                            Submit Registration
                        </button>
                    </form>
                );
            case 2:
                return (
                    <div className="text-center p-8 animate-pop-in">
                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
                        <h3 className="mt-4 text-2xl font-bold text-neutral-900">Registration Complete!</h3>
                        <p className="mt-2 text-neutral-600">Thank you, {formData.studentName}. The sports department will review your submission and contact you soon.</p>
                        <button onClick={resetForm} className="mt-6 px-6 py-2 bg-primary text-white font-semibold rounded-md">
                            Register Another Student
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-6">
                <TrophyIcon className="h-8 w-8 text-amber-500" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Sports & Games Hub</h2>
                    <p className="text-sm text-neutral-500 font-hindi">खेल-कूद केंद्र</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Registration Form */}
                <div className="lg:col-span-2">
                     <div className="mb-8 flex justify-center"><StepIndicator currentStep={step} /></div>
                     {renderContent()}
                </div>

                {/* Events & Information */}
                <div className="lg:col-span-3">
                     <h3 className="text-lg font-bold text-neutral-800 mb-4">Upcoming Events & News</h3>
                     <div className="space-y-4">
                        {mockEvents.map((event, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-white shadow-sm flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-2 rounded-full mt-1">
                                    <CalendarDaysIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-neutral-800">{event.name}</h4>
                                    <p className="text-sm font-semibold text-neutral-500">{event.date}</p>
                                    <p className="text-sm text-neutral-600 mt-1">{event.description}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default SportsHub;
