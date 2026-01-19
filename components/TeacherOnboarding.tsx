
import React, { useState } from 'react';
import { User } from '../types';
import { 
    SparklesIcon, AcademicCapIcon, PaintBrushIcon, 
    ArrowRightIcon, CheckCircleIcon, VideoCameraIcon,
    PencilSquareIcon, ShieldCheckIcon
} from './icons/AllIcons';

interface Props {
    user: User;
    onComplete: () => void;
}

const TeacherOnboarding: React.FC<Props> = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);

    const steps = [
        {
            id: 1,
            title: "नमस्ते उस्ताद जी! (Welcome Guru)",
            hindi: "एजुकेशन सार्थी परिवार में आपका स्वागत है।",
            icon: <AcademicCapIcon className="h-12 w-12 text-primary" />,
            desc: "हम शिक्षकों की ताकत को AI से कई गुना बढ़ा देते हैं। चलिए, आपका स्मार्ट सेटअप शुरू करते हैं।"
        },
        {
            id: 2,
            title: "स्मार्ट क्लास का जादू (Smart Classroom)",
            hindi: "बिना चौक-डस्टर के पढ़ाएं!",
            icon: <PaintBrushIcon className="h-12 w-12 text-blue-500" />,
            desc: "आपका 'AI Smart Board' आपके द्वारा लिखे गए धुंधले अक्षरों को भी सुंदर बना देगा और बच्चों को नोट्स व्हाट्सएप कर देगा।"
        },
        {
            id: 3,
            title: "डिजिटल सिग्नेचर (Digital Tools)",
            hindi: "समय बचाएं, एआई का साथ पाएं।",
            icon: <ShieldCheckIcon className="h-12 w-12 text-green-500" />,
            desc: "मार्कशीट साइन करना हो या अटेंडेंस लेना - अब सब कुछ एक क्लिक में होगा। आप एआई से वीडियो लेसन भी बना सकते हैं।"
        }
    ];

    const currentData = steps.find(s => s.id === step)!;

    return (
        <div className="h-full flex items-center justify-center p-6 animate-pop-in">
            <div className="bg-white rounded-[4rem] shadow-3xl max-w-4xl w-full overflow-hidden border-8 border-slate-50 flex flex-col md:flex-row min-h-[500px]">
                {/* Visual Guide Side */}
                <div className="md:w-2/5 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                    <div className="relative z-10 text-center">
                        <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-inner border border-white/10 animate-bounce-slow">
                            {currentData.icon}
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-2">Step {step} of 3</h4>
                        <p className="font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Teacher Orientation</p>
                    </div>
                    
                    <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm text-center">
                         <p className="text-[10px] font-black uppercase mb-2">Sarthi Tip</p>
                         <p className="text-xs text-slate-400 font-hindi italic">"AI शिक्षक का विकल्प नहीं, बल्कि उनका सबसे शक्तिशाली औजार है।"</p>
                    </div>
                </div>

                {/* Interaction Side */}
                <div className="md:w-3/5 p-12 lg:p-20 flex flex-col justify-center text-center md:text-left space-y-8 bg-slate-50/30">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{currentData.title}</h2>
                        <h3 className="text-2xl font-hindi font-black text-primary">{currentData.hindi}</h3>
                        <p className="text-lg text-slate-500 font-hindi font-medium leading-relaxed">{currentData.desc}</p>
                    </div>

                    <div className="pt-10 flex flex-col sm:flex-row gap-4">
                        {step < 3 ? (
                            <button 
                                onClick={() => setStep(step + 1)}
                                className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 text-xl group"
                            >
                                आगे बढ़ें (Next) <ArrowRightIcon className="h-7 w-7 group-hover:translate-x-2 transition-transform"/>
                            </button>
                        ) : (
                            <button 
                                onClick={onComplete}
                                className="w-full py-6 bg-primary text-slate-950 font-black rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(245,158,11,0.5)] hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-4 text-2xl uppercase group animate-pulse"
                            >
                                <CheckCircleIcon className="h-8 w-8" /> सेटअप पूर्ण करें (Done)
                            </button>
                        )}
                        <button onClick={onComplete} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest px-4">Skip Introduction</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherOnboarding;
