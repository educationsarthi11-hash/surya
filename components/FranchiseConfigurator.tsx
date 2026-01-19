
import React, { useState, useEffect, useRef } from 'react';
import { LocationType } from '../types';
import { useToast } from '../hooks/useToast';
import { getBoardsForType } from '../config/classroomData';
import { INDIAN_STATES } from '../config/institutions';
import { 
    Cog6ToothIcon, PhotoIcon, SparklesIcon, PaintBrushIcon, 
    GlobeAltIcon, AcademicCapIcon, CheckCircleIcon, SunIcon, 
    BuildingOfficeIcon, BuildingLibraryIcon, WrenchScrewdriverIcon,
    UploadIcon
} from './icons/AllIcons';
import { useAppConfig } from '../contexts/AppConfigContext';

const FranchiseConfigurator: React.FC = () => {
    const toast = useToast();
    const { institutionName, setConfig, institutionType, primaryColor, logoUrl, selectedState, selectedBoard } = useAppConfig();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [localInstName, setLocalInstName] = useState(institutionName);
    const [localColor, setLocalColor] = useState(primaryColor);
    const [localState, setLocalState] = useState(selectedState);
    const [selectedType, setSelectedType] = useState<LocationType>(institutionType);
    const [localLogo, setLocalLogo] = useState<string | undefined>(logoUrl);
    
    const availableBoards = getBoardsForType(selectedType, localState);
    const [localBoard, setLocalBoard] = useState(selectedBoard || availableBoards[0]);

    useEffect(() => {
        if (!availableBoards.includes(localBoard)) {
            setLocalBoard(availableBoards[0]);
        }
    }, [localState, selectedType, availableBoards]);

    const handleSaveAll = () => {
        setConfig({ 
            institutionName: localInstName, 
            institutionType: selectedType,
            primaryColor: localColor,
            selectedState: localState,
            selectedBoard: localBoard,
            logoUrl: localLogo
        });
        toast.success(`बधाई हो! अब यह सॉफ्टवेयर पूरी तरह से "${localInstName}" का है।`);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setLocalLogo(url);
            // Auto update context for immediate feel
            setConfig({ logoUrl: url }); 
            toast.success("लोगो अपलोड सफल! (Logo Uploaded)");
        }
    };

    // Pre-defined Brand Colors
    const brandColors = [
        '#f59e0b', // Sarthi Gold
        '#2563eb', // Royal Blue
        '#dc2626', // Red
        '#059669', // Emerald
        '#7c3aed', // Purple
        '#db2777', // Pink
        '#0f172a', // Slate Black
    ];

    const instOptions = [
        { type: LocationType.School, label: 'School', hindi: 'स्कूल', icon: <BuildingOfficeIcon className="h-5 w-5"/> },
        { type: LocationType.College, label: 'College', hindi: 'कॉलेज', icon: <AcademicCapIcon className="h-5 w-5"/> },
        { type: LocationType.University, label: 'University', hindi: 'यूनिवर्सिटी', icon: <GlobeAltIcon className="h-5 w-5"/> },
        { type: LocationType.ITI, label: 'Technical', hindi: 'तकनीकी', icon: <WrenchScrewdriverIcon className="h-5 w-5"/> },
    ];

    return (
        <div className="bg-white p-4 sm:p-10 rounded-[4rem] shadow-soft space-y-12 animate-pop-in border border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 rounded-[1.5rem] text-white shadow-xl rotate-3 transition-colors duration-500" style={{ backgroundColor: localColor }}>
                        <Cog6ToothIcon className="h-10 w-10 animate-spin-slow"/>
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">White-Label Setup</h2>
                        <p className="text-sm text-slate-400 font-hindi font-bold tracking-widest uppercase mt-1">सॉफ्टवेयर को अपना बनाएं (Make it Yours)</p>
                    </div>
                </div>
                <button 
                    onClick={handleSaveAll} 
                    className="w-full md:w-auto px-10 py-5 text-white font-black rounded-3xl shadow-xl hover:scale-105 transition-all transform active:scale-95 text-lg uppercase tracking-widest"
                    style={{ backgroundColor: localColor }}
                >
                    SAVE BRANDING
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-10">
                    <div className="bg-slate-50 p-8 rounded-[3.5rem] border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter mb-6"><PaintBrushIcon className="h-6 w-6 text-slate-400"/> ब्रांड पहचान (Brand Identity)</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 ml-4">Institution Name</label>
                                <input 
                                    type="text" 
                                    value={localInstName} 
                                    onChange={e => setLocalInstName(e.target.value)} 
                                    className="w-full p-5 bg-white border-2 border-slate-200 rounded-[2rem] font-black text-2xl focus:border-current outline-none shadow-sm transition-all"
                                    style={{ color: localColor }}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 ml-4">Theme Color (आपका रंग)</label>
                                <div className="flex flex-wrap gap-3">
                                    {brandColors.map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setLocalColor(c)}
                                            className={`w-12 h-12 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center border-4 ${localColor === c ? 'border-white scale-110 ring-2 ring-slate-300' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        >
                                            {localColor === c && <CheckCircleIcon className="h-6 w-6 text-white"/>}
                                        </button>
                                    ))}
                                    <input 
                                        type="color" 
                                        value={localColor} 
                                        onChange={e => setLocalColor(e.target.value)}
                                        className="w-12 h-12 rounded-full border-none cursor-pointer overflow-hidden p-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[3.5rem] border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter mb-6"><GlobeAltIcon className="h-6 w-6 text-slate-400"/> Operational Mode</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                             {instOptions.map(opt => (
                                <button 
                                    key={opt.type}
                                    onClick={() => setSelectedType(opt.type)}
                                    className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${selectedType === opt.type ? 'bg-white shadow-md' : 'bg-slate-100 border-transparent text-slate-400'}`}
                                    style={{ borderColor: selectedType === opt.type ? localColor : 'transparent', color: selectedType === opt.type ? localColor : '' }}
                                >
                                    {opt.icon}
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase leading-none mb-1">{opt.label}</p>
                                        <p className="text-xs font-bold font-hindi text-slate-500">{opt.hindi}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 ml-2">State (राज्य)</label>
                                <select value={localState} onChange={e => setLocalState(e.target.value)} className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 outline-none">
                                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 ml-2">Board (बोर्ड)</label>
                                <select value={localBoard} onChange={e => setLocalBoard(e.target.value)} className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 outline-none">
                                    {availableBoards.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                    {/* Live Preview Card */}
                    <div className="relative overflow-hidden rounded-[3rem] shadow-2xl p-10 text-white min-h-[400px] flex flex-col items-center justify-center text-center border-8 border-slate-900" style={{ backgroundColor: localColor }}>
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                         
                         <label 
                            className="relative z-10 w-48 h-48 bg-white rounded-full flex flex-col items-center justify-center mb-6 shadow-2xl overflow-hidden p-2 group cursor-pointer border-4 border-white hover:border-slate-200 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                         >
                             {localLogo ? (
                                 <img src={localLogo} className="w-full h-full object-contain" alt="Logo"/>
                             ) : (
                                 <div className="text-slate-300 flex flex-col items-center">
                                     <PhotoIcon className="h-12 w-12 mb-2"/>
                                     <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">NO LOGO</span>
                                 </div>
                             )}
                             
                             {/* Overlay for upload instruction */}
                             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                 <UploadIcon className="h-8 w-8 text-white mb-2"/>
                                 <p className="text-[10px] font-black text-white uppercase tracking-widest">Click to Upload</p>
                                 <p className="text-[10px] font-bold text-white font-hindi">लोगो बदलें</p>
                             </div>
                         </label>
                         
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />

                         <h2 className="text-3xl font-black uppercase tracking-tight relative z-10">{localInstName || 'Your Name Here'}</h2>
                         <p className="text-white/80 font-hindi font-bold mt-2 relative z-10 text-lg">"शिक्षा ही सफलता की कुंजी है"</p>
                         
                         <div className="mt-8 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 relative z-10">
                             <p className="text-[10px] font-black uppercase tracking-widest">LIVE APP PREVIEW</p>
                         </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 text-center">
                        <h4 className="font-bold text-slate-800 mb-2">White-Label Guarantee</h4>
                        <p className="text-xs text-slate-500 font-hindi leading-relaxed">
                            जब आप "Save Branding" दबाएंगे, तो पूरे सॉफ्टवेयर से हमारा नाम हट जाएगा और आपका लोगो, नाम और रंग हर जगह दिखाई देगा। यह आपका अपना ऐप बन जाएगा।
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FranchiseConfigurator;
