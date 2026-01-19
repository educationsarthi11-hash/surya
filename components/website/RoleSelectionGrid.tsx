import React from 'react';
import { 
    AcademicCapIcon, BuildingOfficeIcon, BuildingLibraryIcon, 
    BriefcaseIcon, UsersIcon, SparklesIcon, ArrowRightIcon,
    BoltIcon, GlobeAltIcon, UserCircleIcon
} from '../icons/AllIcons';

interface RoleCardProps {
    title: string;
    hindiTitle: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, hindiTitle, desc, icon, color, onClick }) => (
    <button 
        onClick={onClick}
        className="group relative bg-white p-10 rounded-[3.5rem] shadow-sm border-2 border-slate-50 hover:border-primary hover:shadow-3xl transition-all duration-500 text-left flex flex-col h-full overflow-hidden active:scale-95"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-20 rounded-bl-full transition-all duration-500`}></div>
        
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-6`}>
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-10 w-10" })}
        </div>
        
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <h4 className="text-3xl font-black text-slate-900 font-hindi mb-4">{hindiTitle}</h4>
        <p className="text-base text-slate-500 font-medium leading-relaxed flex-grow">{desc}</p>
        
        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between w-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Enter Hub</span>
            <div className="p-2 bg-slate-900 text-white rounded-full group-hover:bg-primary transition-colors">
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </button>
);

const RoleSelectionGrid: React.FC<{ onAction: () => void }> = ({ onAction }) => {
    const roles = [
        {
            title: "Learner Hub",
            hindiTitle: "छात्र और अभिभावक",
            desc: "एआई ट्यूटर, होमवर्क हेल्प और प्रोग्रेस रिपोर्ट के लिए यहाँ क्लिक करें।",
            icon: <UserCircleIcon />,
            color: "from-blue-500 to-indigo-600"
        },
        {
            title: "School Node",
            hindiTitle: "स्कूल और शिक्षक",
            desc: "हाजिरी, फीस, टेस्ट पेपर और क्लास मैनेजमेंट के आधुनिक टूल्स।",
            icon: <BuildingOfficeIcon />,
            color: "from-orange-500 to-red-600"
        },
        {
            title: "Campus Elite",
            hindiTitle: "कॉलेज व यूनिवर्सिटी",
            desc: "हायर एजुकेशन, रिसर्च और एलुमनाई नेटवर्क का एकीकृत प्लेटफॉर्म।",
            icon: <BuildingLibraryIcon />,
            color: "from-purple-500 to-pink-600"
        },
        {
            title: "Recruiter Hub",
            hindiTitle: "कंपनी और प्लेसमेंट",
            desc: "कुशल छात्रों को खोजें, जॉब पोस्ट करें और अपना ब्रांड बनाएं।",
            icon: <BriefcaseIcon />,
            color: "from-emerald-500 to-teal-600"
        }
    ];

    return (
        <section className="py-32 bg-[#fffdf7] relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        <SparklesIcon className="h-4 w-4" /> Comprehensive Digital Ecosystem
                    </div>
                    <h2 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-none italic">
                        ONE SYSTEM. <span className="text-primary not-italic">EVERY ROLE.</span>
                    </h2>
                    <p className="text-2xl text-slate-500 font-hindi max-w-2xl mx-auto font-medium">
                        अपनी पहचान चुनें और शिक्षा के भविष्य में प्रवेश करें।
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {roles.map((role, idx) => (
                        <RoleCard key={idx} {...role} onClick={onAction} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoleSelectionGrid;