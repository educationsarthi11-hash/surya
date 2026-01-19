
import React, { useState } from 'react';
import { 
    BriefcaseIcon, DocumentTextIcon, MicrophoneIcon, 
    ChartBarIcon, BoltIcon, ArrowLeftIcon, 
    RocketLaunchIcon
} from './icons/AllIcons';
import { User, ServiceName } from '../types';

// Import sub-tools
import PlacementForum from './PlacementForum';
import CVGenerator from './CVGenerator';
import AIInterviewCoach from './AIInterviewCoach';
import CareerPredictor from './CareerPredictor';
import SkillMarketplace from './SkillMarketplace';

const TOOLS = [
    { id: 'jobs', title: 'Placement Forum', hindi: 'नौकरी खोजें', icon: <BriefcaseIcon/>, color: 'from-emerald-500 to-green-600', component: PlacementForum },
    { id: 'cv', title: 'CV Generator', hindi: 'प्रोफेशनल रिज्यूमे', icon: <DocumentTextIcon/>, color: 'from-blue-500 to-indigo-600', component: CVGenerator },
    { id: 'interview', title: 'AI Interview Coach', hindi: 'इंटरव्यू तैयारी', icon: <MicrophoneIcon/>, color: 'from-violet-500 to-purple-600', component: AIInterviewCoach },
    { id: 'predict', title: 'Career Predictor', hindi: 'भविष्यवाणी', icon: <ChartBarIcon/>, color: 'from-amber-400 to-orange-500', component: CareerPredictor },
    { id: 'skills', title: 'Skill Marketplace', hindi: 'फ्रीलांस प्रोजेक्ट्स', icon: <BoltIcon/>, color: 'from-cyan-400 to-blue-500', component: SkillMarketplace },
];

const FutureCareerHub: React.FC<{ user: User; setActiveService: (s: ServiceName | 'overview') => void }> = ({ user, setActiveService }) => {
    const [activeToolId, setActiveToolId] = useState<string | null>(null);

    const ActiveComponent = TOOLS.find(t => t.id === activeToolId)?.component;

    if (activeToolId && ActiveComponent) {
        return (
            <div className="h-full flex flex-col animate-fade-in">
                <div className="flex items-center justify-between mb-4 px-2">
                    <button 
                        onClick={() => setActiveToolId(null)} 
                        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-black uppercase text-xs tracking-widest bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-all hover:shadow-md"
                    >
                        <ArrowLeftIcon className="h-4 w-4"/> Back to Hub
                    </button>
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Career Mode</span>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 bg-white">
                    <ActiveComponent user={user} setActiveService={setActiveService} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0f172a] p-6 sm:p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col overflow-hidden relative border-8 border-slate-800">
            {/* Cool Grid BG */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="relative z-10 text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-6 py-2 rounded-full border border-emerald-500/20 mb-6 backdrop-blur-md shadow-glow">
                    <RocketLaunchIcon className="h-4 w-4 animate-pulse"/>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Launchpad to Success</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
                    Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Career Hub</span>
                </h2>
                <p className="text-slate-400 font-hindi mt-4 text-lg max-w-2xl mx-auto font-medium">
                    "आपकी ड्रीम जॉब का रास्ता यहीं से शुरू होता है। सीवी बनाने से लेकर प्लेसमेंट तक।"
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar pb-20">
                {TOOLS.map((tool) => (
                    <button 
                        key={tool.id}
                        onClick={() => setActiveToolId(tool.id)}
                        className={`group relative h-64 rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${tool.color} p-[2px] transition-all hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/20`}
                    >
                        <div className="h-full w-full bg-slate-900 rounded-[2.3rem] p-6 relative overflow-hidden flex flex-col justify-between group-hover:bg-slate-900/90 transition-colors">
                            {/* Colorful Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-20 blur-2xl rounded-full -mr-10 -mt-10`}></div>
                            
                            <div className="flex justify-between items-start relative z-10">
                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} text-white shadow-lg`}>
                                    {React.cloneElement(tool.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" })}
                                </div>
                                <ArrowLeftIcon className="h-5 w-5 text-slate-500 rotate-[135deg] group-hover:text-white transition-colors" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">{tool.title}</h3>
                                <p className="text-sm font-hindi text-slate-300 font-bold">{tool.hindi}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FutureCareerHub;
