
import React, { useState, useEffect, useMemo } from 'react';
import { User, LocationType, UserRole } from '../types';
import { useClassroom } from '../contexts/ClassroomContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useToast } from '../hooks/useToast';
import { 
    AcademicCapIcon, ArrowRightIcon, BuildingLibraryIcon, 
    GlobeAltIcon, BookOpenIcon, CheckCircleIcon,
    BuildingOfficeIcon, StarIcon, SparklesIcon,
    WrenchScrewdriverIcon, HeartIcon, BriefcaseIcon, PlusIcon
} from './icons/AllIcons';
import { getLocalizedCourseList } from '../config/classroomData';

interface SetupScreenProps {
    onSetupComplete: () => void;
    user: User;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete, user }) => {
    const toast = useToast();
    const { updateConfig, setClasses, setSelectedClass } = useClassroom();
    const { setConfig: setAppConfig, selectedCountry } = useAppConfig();

    const [institutionType, setInstType] = useState<LocationType | null>(null);
    const [step, setStep] = useState(1);
    
    // State for Custom Course Entry
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [manualCourseName, setManualCourseName] = useState('');
    
    // Get Courses based on Country
    const dynamicCourses = useMemo(() => {
        if (!institutionType) return [];
        return getLocalizedCourseList(selectedCountry || "India", institutionType);
    }, [institutionType, selectedCountry]);

    const pathOptions = [
        { 
            type: LocationType.School, 
            label: 'School Student', 
            hindi: 'स्कूली छात्र (Nursery - 12th)', 
            icon: <AcademicCapIcon className="h-10 w-10" />, 
            color: 'from-blue-500 to-indigo-600',
            desc: 'बोर्ड के अनुसार अपनी कक्षा का चुनाव करें'
        },
        { 
            type: LocationType.CoachingCenter, 
            label: 'Competitive Prep', 
            hindi: 'प्रतियोगी परीक्षा', 
            icon: <SparklesIcon className="h-10 w-10" />, 
            color: 'from-orange-500 to-red-600',
            desc: 'JEE, NEET, UPSC और बैंकिंग कोर्सेज'
        },
        { 
            type: LocationType.College, 
            label: 'College (UG)', 
            hindi: 'कॉलेज / स्नातक', 
            icon: <BuildingLibraryIcon className="h-10 w-10" />, 
            color: 'from-purple-500 to-pink-600',
            desc: 'BA, BSc, BCom, BTech आदि'
        },
        { 
            type: LocationType.University, 
            label: 'University (PG/PhD)', 
            hindi: 'यूनिवर्सिटी / मास्टर्स / PhD', 
            icon: <GlobeAltIcon className="h-10 w-10" />, 
            color: 'from-indigo-600 to-violet-800',
            desc: 'MA, MSc, MBA, Research, Doctorate'
        },
        { 
            type: LocationType.ITI, 
            label: 'Vocational (ITI)', 
            hindi: 'तकनीकी ट्रेड (ITI)', 
            icon: <WrenchScrewdriverIcon className="h-10 w-10" />, 
            color: 'from-emerald-600 to-teal-800',
            desc: 'इलेक्ट्रीशियन, फिटर और अन्य तकनीकी स्किल्स'
        },
        { 
            type: LocationType.TechnicalInstitute, 
            label: 'Diploma / Skills', 
            hindi: 'डिप्लोमा / स्किल कोर्स', 
            icon: <BriefcaseIcon className="h-10 w-10" />, 
            color: 'from-cyan-500 to-blue-700',
            desc: 'Polytechnic, Aviation, Fashion, Computers'
        }
    ];

    const handlePathSelection = (type: LocationType) => {
        setInstType(type);
        setStep(2);
    };

    const handleFinish = (course: string) => {
        if (!institutionType) return;
        
        // If it's a manual entry, we treat it as a valid course
        const finalCourse = isManualEntry ? manualCourseName.trim() : course;
        
        if (!finalCourse) {
             toast.error("कृपया कोर्स का नाम लिखें।");
             return;
        }

        const standardCourses = dynamicCourses;
        // If manual entry, add it to the local list temporarily (or just set it)
        const updatedClasses = isManualEntry ? [finalCourse, ...standardCourses] : standardCourses;

        setClasses(updatedClasses);
        setSelectedClass(finalCourse);
        setAppConfig({ institutionType });
        updateConfig({ institutionType });

        toast.success(`${finalCourse} के लिए आपका AI कोर्स मैप कर दिया गया है!`);
        onSetupComplete();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans overflow-y-auto w-full">
            <div className="max-w-6xl w-full py-10">
                <div className="text-center mb-12 animate-pop-in">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase mb-4 tracking-widest">
                        <GlobeAltIcon className="h-4 w-4"/> Global Education Gateway
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        नमस्ते, {user.name.split(' ')[0]}! <br/>
                        <span className="text-primary">{step === 1 ? 'अपना शैक्षणिक स्तर चुनें' : 'अपनी कक्षा या ट्रेड चुनें'}</span>
                    </h1>
                    <p className="text-slate-500 font-hindi text-xl">सही चुनाव करने से AI सार्थी आपको आपके सिलेबस का सटीक कंटेंट दे पाएगा।</p>
                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Current Region: {selectedCountry}</p>
                </div>

                {step === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                        {pathOptions.map((opt) => (
                            <button
                                key={opt.type}
                                onClick={() => handlePathSelection(opt.type)}
                                className="group relative bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 hover:border-primary transition-all duration-500 shadow-sm hover:shadow-2xl text-left flex flex-col h-full overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${opt.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity`}></div>
                                <div className={`w-20 h-20 bg-gradient-to-br ${opt.color} rounded-3xl flex items-center justify-center text-white shadow-xl mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    {opt.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-1 leading-none">{opt.label}</h3>
                                <h4 className="text-lg font-bold text-primary font-hindi mb-4">{opt.hindi}</h4>
                                <p className="text-slate-400 text-sm font-medium mb-8 flex-grow">{opt.desc}</p>
                                <div className="flex items-center gap-2 font-black text-slate-900 group-hover:gap-4 transition-all">
                                    PROCEED <ArrowRightIcon className="h-5 w-5 text-primary"/>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && institutionType && (
                    <div className="max-w-5xl mx-auto animate-fade-in-up">
                        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative">
                            <button onClick={() => { setStep(1); setIsManualEntry(false); }} className="mb-8 text-slate-400 font-bold hover:text-primary flex items-center gap-2">
                                <ArrowRightIcon className="h-5 w-5 rotate-180"/> लेवल बदलें (Change Level)
                            </button>
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <BookOpenIcon className="h-8 w-8 text-orange-500"/> 
                                {institutionType === 'ITI' ? 'अपनी ट्रेड (Trade) का चुनाव करें:' : 'अपनी कक्षा या प्रोग्राम चुनें:'}
                            </h3>

                            {isManualEntry ? (
                                <div className="max-w-md mx-auto space-y-6 text-center animate-pop-in bg-slate-50 p-8 rounded-[2rem] border-2 border-primary/20">
                                    <h4 className="text-lg font-bold text-slate-800">अपना कोर्स लिखें (Custom Course)</h4>
                                    <input 
                                        type="text" 
                                        value={manualCourseName}
                                        onChange={e => setManualCourseName(e.target.value)}
                                        placeholder="उदाहरण: Diploma in Cyber Security..."
                                        className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-primary outline-none font-bold text-lg"
                                        autoFocus
                                    />
                                    <div className="flex gap-4">
                                        <button onClick={() => setIsManualEntry(false)} className="flex-1 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold">List देखें</button>
                                        <button onClick={() => handleFinish(manualCourseName)} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">Save & Next</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {dynamicCourses.map((course) => (
                                            <button
                                                key={course}
                                                onClick={() => handleFinish(course)}
                                                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all text-sm sm:text-base animate-pop-in text-left flex items-center justify-between group"
                                            >
                                                {course}
                                                <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                        
                                        {/* "Other" Option for flexibility */}
                                        <button 
                                            onClick={() => setIsManualEntry(true)}
                                            className="p-4 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl font-black text-indigo-600 hover:bg-indigo-100 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                                        >
                                            <PlusIcon className="h-5 w-5"/> Other / अपना कोर्स लिखें
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SetupScreen;
