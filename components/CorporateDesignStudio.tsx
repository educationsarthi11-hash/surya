
import React, { useState, useRef } from 'react';
import { generateImageForTopic } from '../services/geminiService';
import { 
    PaintBrushIcon, SparklesIcon, IdentificationIcon, 
    ArrowDownTrayIcon, PrinterIcon, CheckCircleIcon,
    BriefcaseIcon, ShieldCheckIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useAppConfig } from '../contexts/AppConfigContext';

declare global {
  interface Window {
    html2canvas: any;
  }
}

const CorporateDesignStudio: React.FC = () => {
    const toast = useToast();
    const { institutionName } = useAppConfig();
    const [activeTab, setActiveTab] = useState<'logo' | 'stamp' | 'card'>('logo');
    const [loading, setLoading] = useState(false);
    
    // Logo State
    const [logoPrompt, setLogoPrompt] = useState(`Minimalist modern logo for ${institutionName}, education and technology theme`);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    // Stamp State
    const [stampTextTop, setStampTextTop] = useState(institutionName);
    const [stampTextBottom, setStampTextBottom] = useState("Authorized Signatory");
    const [stampColor, setStampColor] = useState('#1e3a8a'); // Default Blue Ink
    const [stampShape, setStampShape] = useState<'round' | 'rect'>('round');
    const stampRef = useRef<HTMLDivElement>(null);

    // Card State
    const [cardName, setCardName] = useState('Rahul Sharma');
    const [cardRole, setCardRole] = useState('Managing Director');
    const cardRef = useRef<HTMLDivElement>(null);

    const handleGenerateLogo = async () => {
        setLoading(true);
        try {
            const url = await generateImageForTopic(`Vector logo design: ${logoPrompt}. Clean background.`);
            setLogoUrl(url);
            toast.success("Logo Generated!");
        } catch (e) {
            toast.error("Logo generation failed.");
        } finally {
            setLoading(false);
        }
    };

    const downloadRef = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
        if (!ref.current) return;
        toast.info("Preparing download...");
        try {
            const canvas = await window.html2canvas(ref.current, { backgroundColor: null, scale: 2 });
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success("Downloaded!");
        } catch (e) {
            toast.error("Download failed.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-[3rem] shadow-soft min-h-[700px] flex flex-col border border-slate-100 animate-pop-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b pb-6">
                <div className="flex items-center gap-5">
                    <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-xl rotate-3">
                        <PaintBrushIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Smart Brand Studio</h2>
                        <p className="text-sm font-hindi font-bold text-slate-500 tracking-widest mt-1">लोगो, मुहर और आईडी कार्ड मेकर</p>
                    </div>
                </div>
                
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button onClick={() => setActiveTab('logo')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'logo' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>AI Logo</button>
                    <button onClick={() => setActiveTab('stamp')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'stamp' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Digital Mohar</button>
                    <button onClick={() => setActiveTab('card')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'card' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>ID Card</button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Controls Sidebar */}
                <div className="lg:col-span-4 space-y-6 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 h-fit">
                    {activeTab === 'logo' && (
                        <>
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2"><SparklesIcon className="h-4 w-4"/> Logo Parameters</h3>
                            <textarea 
                                value={logoPrompt}
                                onChange={e => setLogoPrompt(e.target.value)}
                                className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 outline-none text-sm font-medium h-32"
                                placeholder="Describe your logo..."
                            />
                            <button onClick={handleGenerateLogo} disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                                {loading ? <Loader message="Designing..." /> : "GENERATE LOGO"}
                            </button>
                        </>
                    )}

                    {activeTab === 'stamp' && (
                        <>
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4"/> Stamp Config</h3>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Company Name (Top)</label>
                                <input value={stampTextTop} onChange={e => setStampTextTop(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 mt-1 font-bold text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Reg / Auth (Bottom)</label>
                                <input value={stampTextBottom} onChange={e => setStampTextBottom(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 mt-1 font-bold text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Ink Color</label>
                                <div className="flex gap-2 mt-2">
                                    {['#1e3a8a', '#7c3aed', '#dc2626', '#047857'].map(c => (
                                        <button key={c} onClick={() => setStampColor(c)} className={`w-8 h-8 rounded-full border-2 ${stampColor === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} style={{backgroundColor: c}}></button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => setStampShape('round')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${stampShape === 'round' ? 'bg-white shadow' : 'bg-slate-200'}`}>Round</button>
                                <button onClick={() => setStampShape('rect')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${stampShape === 'rect' ? 'bg-white shadow' : 'bg-slate-200'}`}>Rectangular</button>
                            </div>
                        </>
                    )}

                    {activeTab === 'card' && (
                        <>
                             <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2"><IdentificationIcon className="h-4 w-4"/> Card Details</h3>
                             <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Full Name" className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm" />
                             <input value={cardRole} onChange={e => setCardRole(e.target.value)} placeholder="Designation" className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm" />
                        </>
                    )}
                </div>

                {/* Preview Canvas */}
                <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-slate-100 rounded-[2.5rem] border-4 border-slate-200 relative overflow-hidden p-10">
                    
                    {activeTab === 'logo' && (
                        <div className="text-center">
                            {logoUrl ? (
                                <div className="relative group">
                                    <img src={logoUrl} className="w-64 h-64 object-contain rounded-2xl shadow-2xl bg-white p-4" alt="Generated Logo" />
                                    <button onClick={() => { const link = document.createElement('a'); link.href = logoUrl; link.download = 'logo.png'; link.click(); }} className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                        <ArrowDownTrayIcon className="h-4 w-4"/> Download PNG
                                    </button>
                                </div>
                            ) : (
                                <div className="opacity-30 flex flex-col items-center">
                                    <SparklesIcon className="h-20 w-20 mb-4"/>
                                    <p className="font-black uppercase tracking-[0.2em]">AI Logo Canvas</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'stamp' && (
                        <div className="flex flex-col items-center gap-8">
                            <div ref={stampRef} className="p-8 bg-transparent inline-block">
                                {stampShape === 'round' ? (
                                    <div style={{ width: '250px', height: '250px', border: `8px solid ${stampColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', color: stampColor }}>
                                        <div style={{ width: '220px', height: '220px', border: `2px solid ${stampColor}`, borderRadius: '50%', position: 'absolute' }}></div>
                                        <svg viewBox="0 0 500 500" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                            <path id="curve" d="M 75, 250 A 175, 175 0 1, 1 425, 250" fill="transparent" />
                                            <text width="500">
                                                <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle" style={{ fill: stampColor, fontSize: '38px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                                    {stampTextTop}
                                                </textPath>
                                            </text>
                                        </svg>
                                        <div className="text-center z-10 mt-10">
                                            <ShieldCheckIcon className="h-12 w-12 mx-auto mb-1" style={{color: stampColor}} />
                                            <p className="text-2xl font-black uppercase">APPROVED</p>
                                            <p className="text-xs font-bold uppercase tracking-wider mt-1">{stampTextBottom}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ width: '300px', height: '120px', border: `6px solid ${stampColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: stampColor, borderRadius: '10px', padding: '10px' }}>
                                         <h3 className="text-xl font-black uppercase text-center border-b-2 w-full pb-1" style={{borderColor: stampColor}}>{stampTextTop}</h3>
                                         <p className="text-2xl font-black uppercase my-1">AUTHORIZED</p>
                                         <p className="text-xs font-bold uppercase tracking-widest">{stampTextBottom}</p>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => downloadRef(stampRef, 'digital_stamp.png')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg hover:bg-primary transition-all">
                                <ArrowDownTrayIcon className="h-4 w-4"/> Download Transparent Stamp
                            </button>
                        </div>
                    )}

                    {activeTab === 'card' && (
                        <div className="flex flex-col items-center gap-8">
                             <div ref={cardRef} className="w-[350px] h-[550px] bg-white rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col border border-slate-200">
                                 <div className="h-32 bg-indigo-600 relative">
                                     <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                                         <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${cardName}`} className="w-full h-full rounded-full bg-slate-100" />
                                     </div>
                                 </div>
                                 <div className="mt-12 text-center px-6 flex-1">
                                     <h3 className="text-2xl font-black text-slate-900 uppercase">{cardName}</h3>
                                     <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6">{cardRole}</p>
                                     
                                     <div className="space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
                                         <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase">ID No</span><span className="font-bold">MGM-EMP-882</span></div>
                                         <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase">Dept</span><span className="font-bold">Management</span></div>
                                         <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase">Valid Thru</span><span className="font-bold">Dec 2025</span></div>
                                     </div>
                                     
                                     <div className="mt-6">
                                          {/* Barcode Simulation */}
                                          <div className="h-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/UPC-A-036000291452.svg/1200px-UPC-A-036000291452.svg.png')] bg-contain bg-center bg-no-repeat opacity-60"></div>
                                     </div>
                                 </div>
                                 <div className="bg-slate-900 p-3 text-center text-white text-[10px] font-bold uppercase tracking-widest">
                                     {institutionName}
                                 </div>
                             </div>
                             <button onClick={() => downloadRef(cardRef, 'id_card.png')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg hover:bg-primary transition-all">
                                <PrinterIcon className="h-4 w-4"/> Print ID Card
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CorporateDesignStudio;
