
import React, { useState } from 'react';
import { 
    VideoCameraIcon, PaintBrushIcon, GlobeAltIcon, 
    MegaphoneIcon, FilmIcon, ArrowLeftIcon, SparklesIcon
} from './icons/AllIcons';
import { User, ServiceName } from '../types';

// Import sub-tools
import VideoGenerator from './VideoGenerator';
import AIAdGenerator from './AIAdGenerator';
import SmartDesignStudio from './SmartDesignStudio';
import EduReels from './EduReels';
import AIWebsiteBuilder from './AIWebsiteBuilder';

const TOOLS = [
    { id: 'video', title: 'AI Video Generator', hindi: 'वीडियो मेकर', icon: <VideoCameraIcon/>, color: 'from-red-500 to-pink-600', text: 'text-red-50', component: VideoGenerator },
    { id: 'ads', title: 'AI Ad Generator', hindi: 'विज्ञापन मेकर', icon: <MegaphoneIcon/>, color: 'from-orange-400 to-red-500', text: 'text-orange-50', component: AIAdGenerator },
    { id: 'design', title: 'Smart Design Studio', hindi: 'पोस्टर & लोगो', icon: <PaintBrushIcon/>, color: 'from-purple-500 to-indigo-600', text: 'text-purple-50', component: SmartDesignStudio },
    { id: 'reels', title: 'EduReels', hindi: 'शॉर्ट वीडियो', icon: <FilmIcon/>, color: 'from-pink-500 to-rose-500', text: 'text-pink-50', component: EduReels },
    { id: 'web', title: 'Website Builder', hindi: 'वेबसाइट बिल्डर', icon: <GlobeAltIcon/>, color: 'from-blue-400 to-cyan-500', text: 'text-blue-50', component: AIWebsiteBuilder },
];

const CreativeStudio: React.FC<{ user: User; setActiveService: (s: ServiceName | 'overview') => void }> = ({ user, setActiveService }) => {
    const [activeToolId, setActiveToolId] = useState<string | null>(null);

    const ActiveComponent = TOOLS.find(t => t.id === activeToolId)?.component;

    if (activeToolId && ActiveComponent) {
        return (
            <div className="h-full flex flex-col animate-fade-in">
                <div className="flex items-center justify-between mb-4 px-2">
                    <button 
                        onClick={() => setActiveToolId(null)} 
                        className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-black uppercase text-xs tracking-widest bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-all hover:shadow-md"
                    >
                        <ArrowLeftIcon className="h-4 w-4"/> Back to Studio
                    </button>
                    <div className="flex items-center gap-2 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">Creation Mode</span>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden rounded-[2rem] shadow-2xl border border-slate-200 bg-white">
                    <ActiveComponent user={user} setActiveService={setActiveService} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-fuchsia-50 via-purple-50 to-pink-50 p-6 sm:p-10 rounded-[3.5rem] shadow-2xl h-full flex flex-col overflow-hidden relative border-8 border-white">
            <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
            
            <div className="relative z-10 text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-2 rounded-full shadow-lg mb-6 transform hover:scale-105 transition-transform cursor-default">
                    <SparklesIcon className="h-5 w-5 animate-spin-slow"/>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Digital Production House</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tighter italic leading-none drop-shadow-sm">
                    Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Studio 360</span>
                </h2>
                <p className="text-slate-500 font-hindi mt-4 text-lg max-w-2xl mx-auto font-medium">
                    "रंगों और एआई की दुनिया में आपका स्वागत है। यहाँ वीडियो, पोस्टर और वेबसाइट बनाएं।"
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pr-2 custom-scrollbar pb-20">
                {TOOLS.map((tool) => (
                    <button 
                        key={tool.id}
                        onClick={() => setActiveToolId(tool.id)}
                        className={`group relative h-72 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 text-left bg-gradient-to-br ${tool.color} p-1`}
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        
                        <div className="h-full w-full bg-white/10 backdrop-blur-sm rounded-[2.3rem] p-6 flex flex-col justify-between relative overflow-hidden">
                            {/* Decorative Circle */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-inner backdrop-blur-md border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                                {React.cloneElement(tool.icon as React.ReactElement<{ className?: string }>, { className: "h-8 w-8" })}
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1 shadow-black/5 drop-shadow-md">{tool.title}</h3>
                                <p className={`text-sm font-hindi font-bold ${tool.text} opacity-90`}>{tool.hindi}</p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/10 px-3 py-1 rounded-full">Open Tool</span>
                                <div className="p-2 bg-white text-pink-600 rounded-full opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
                                    <ArrowLeftIcon className="h-4 w-4 rotate-180"/>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CreativeStudio;
