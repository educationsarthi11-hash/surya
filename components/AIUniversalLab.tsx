
import React, { useState } from 'react';
import { 
    BeakerIcon, RocketLaunchIcon, CpuChipIcon, 
    LeafIcon, HeartIcon, WrenchScrewdriverIcon, 
    CubeIcon, ArrowLeftIcon, SparklesIcon,
    BoltIcon, FlaskConicalIcon
} from './icons/AllIcons';
import { User, ServiceName } from '../types';

// Import all sub-labs
import AiVirtualLab from './AiVirtualLab';
import AIRoboticsLab from './AIRoboticsLab';
import AISpaceStation from './AISpaceStation';
import AIAnatomyLab from './AIAnatomyLab';
import AIMachineWorkshop from './AIMachineWorkshop';
import AIAgricultureLab from './AIAgricultureLab';
import Interactive3DLab from './Interactive3DLab';
import AIChemistryLab from './AIChemistryLab';

// Lab Definitions
const LABS = [
    { id: 'physics', title: 'Virtual Science Lab', hindi: 'विज्ञान प्रयोगशाला', icon: <BeakerIcon/>, gradient: 'from-blue-600 to-indigo-600', component: AiVirtualLab },
    { id: 'chemistry', title: 'Chemistry Lab', hindi: 'रसायन विज्ञान', icon: <FlaskConicalIcon/>, gradient: 'from-teal-500 to-emerald-600', component: AIChemistryLab },
    { id: 'space', title: 'Space Station', hindi: 'अंतरिक्ष केंद्र', icon: <RocketLaunchIcon/>, gradient: 'from-purple-600 to-pink-600', component: AISpaceStation },
    { id: 'robotics', title: 'Robotics & IoT', hindi: 'रोबोटिक्स लैब', icon: <CpuChipIcon/>, gradient: 'from-cyan-500 to-blue-600', component: AIRoboticsLab },
    { id: 'anatomy', title: 'Human Anatomy', hindi: 'मानव शरीर विज्ञान', icon: <HeartIcon/>, gradient: 'from-red-500 to-rose-600', component: AIAnatomyLab },
    { id: 'agriculture', title: 'Smart Agriculture', hindi: 'कृषि विज्ञान', icon: <LeafIcon/>, gradient: 'from-green-500 to-lime-600', component: AIAgricultureLab },
    { id: 'machines', title: 'Machine Workshop', hindi: 'मशीन वर्कशॉप (ITI)', icon: <WrenchScrewdriverIcon/>, gradient: 'from-orange-500 to-amber-600', component: AIMachineWorkshop },
    { id: 'metaverse', title: '3D Metaverse', hindi: '3D मॉडल्स', icon: <CubeIcon/>, gradient: 'from-violet-600 to-fuchsia-600', component: Interactive3DLab },
];

const AIUniversalLab: React.FC<{ user: User; setActiveService: (s: ServiceName | 'overview') => void }> = ({ user, setActiveService }) => {
    const [activeLabId, setActiveLabId] = useState<string | null>(null);

    const ActiveComponent = LABS.find(l => l.id === activeLabId)?.component;

    if (activeLabId && ActiveComponent) {
        return (
            <div className="h-full flex flex-col animate-fade-in">
                {/* Internal Navigation Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <button 
                        onClick={() => setActiveLabId(null)} 
                        className="flex items-center gap-2 text-slate-500 hover:text-white font-black uppercase text-xs tracking-widest bg-slate-900 border border-slate-700 hover:bg-slate-800 px-4 py-2 rounded-full shadow-lg transition-all"
                    >
                        <ArrowLeftIcon className="h-4 w-4"/> Back to Hub
                    </button>
                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Lab Active</span>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden rounded-[2rem] shadow-2xl border border-slate-800 bg-black">
                    <ActiveComponent user={user} setActiveService={setActiveService} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0b0f19] p-6 sm:p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col overflow-hidden relative border-8 border-slate-900">
            {/* Background FX */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-black"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            
            {/* Header */}
            <div className="relative z-10 text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white/5 px-6 py-2 rounded-full border border-white/10 mb-6 backdrop-blur-md shadow-glow">
                    <SparklesIcon className="h-4 w-4 text-cyan-400 animate-spin-slow"/>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Central Research Node</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-lg">
                    Universal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">Science Hub</span>
                </h2>
                <p className="text-slate-400 font-hindi mt-4 text-lg max-w-2xl mx-auto">
                    "एक ही जगह पर विज्ञान, तकनीक, अंतरिक्ष और मशीनरी की दुनिया। अपनी पसंद की लैब चुनें।"
                </p>
            </div>

            {/* Lab Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pr-2 custom-scrollbar pb-20">
                {LABS.map((lab) => (
                    <button 
                        key={lab.id}
                        onClick={() => setActiveLabId(lab.id)}
                        className={`group relative h-64 rounded-[2.5rem] overflow-hidden transition-all duration-500 text-left shadow-lg hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br ${lab.gradient} p-[2px]`}
                    >
                        <div className="h-full w-full bg-slate-950 rounded-[2.3rem] relative overflow-hidden group-hover:bg-slate-950/80 transition-colors">
                            {/* Icon */}
                            <div className={`absolute top-6 right-6 p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 group-hover:scale-110 transition-transform duration-500 text-white shadow-inner`}>
                                {React.cloneElement(lab.icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                            </div>

                            {/* Glow Effect */}
                            <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br ${lab.gradient} opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity`}></div>

                            {/* Text */}
                            <div className="absolute bottom-6 left-6 right-6 z-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1 drop-shadow-md">{lab.title}</h3>
                                <p className="text-sm font-hindi text-white/70 font-bold">{lab.hindi}</p>
                                
                                <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
                
                {/* Coming Soon Card */}
                <div className="relative h-64 rounded-[2.5rem] border-4 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-700 opacity-50 bg-slate-950/50">
                    <BoltIcon className="h-12 w-12 mb-4"/>
                    <p className="font-black uppercase tracking-widest text-xs">More Coming Soon</p>
                </div>
            </div>
        </div>
    );
};

export default AIUniversalLab;
