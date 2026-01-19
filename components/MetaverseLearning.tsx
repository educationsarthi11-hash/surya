
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { 
    CubeIcon, SparklesIcon, UserCircleIcon, 
    CurrencyRupeeIcon, ShoppingCartIcon, GlobeAltIcon, 
    HeartIcon, VideoCameraIcon, ShieldCheckIcon,
    CheckCircleIcon, LockClosedIcon, ArrowRightIcon,
    AcademicCapIcon, UploadIcon, DocumentTextIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { fileToBase64, generateImageForTopic, generateText } from '../services/geminiService';
import { GoogleGenAI } from '@google/genai';

// --- Types ---
type MetaStep = 'intro' | 'kyc' | 'avatar' | 'world';
type Zone = 'edu' | 'market' | 'health' | 'fun';

interface Avatar {
    id: string;
    name: string;
    url: string;
    style: string;
}

const avatars: Avatar[] = [
    { id: '1', name: 'Cyber Scholar', style: 'Academic', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scholar&backgroundColor=b6e3f4' },
    { id: '2', name: 'Tech Ninja', style: 'Developer', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja&backgroundColor=c0aede' },
    { id: '3', name: 'Artist Aura', style: 'Creative', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist&backgroundColor=ffdfbf' },
    { id: '4', name: 'Eco Guardian', style: 'Nature', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eco&backgroundColor=d1d4f9' },
];

const MetaverseLearning: React.FC<{ user: User }> = ({ user }) => {
    const toast = useToast();
    const [step, setStep] = useState<MetaStep>('intro');
    const [loading, setLoading] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
    const [walletBalance, setWalletBalance] = useState(500); // Free credits
    const [metaPassId, setMetaPassId] = useState<string | null>(null);
    const [activeZone, setActiveZone] = useState<Zone>('edu');

    // PDF to 3D State
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [hologramUrl, setHologramUrl] = useState<string | null>(null);
    const [isGeneratingHolo, setIsGeneratingHolo] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // KYC Simulation
    const handleKYC = () => {
        setLoading(true);
        setTimeout(() => {
            setMetaPassId(`META-${user.id}-${Date.now().toString().slice(-4)}`);
            setLoading(false);
            setStep('avatar');
            toast.success("Identity Verified (KYC) Successfully!");
        }, 2000);
    };

    const handleEnterWorld = () => {
        if(!selectedAvatar) {
            toast.error("Please select an Avatar first.");
            return;
        }
        setStep('world');
        toast.success(`Welcome to Surya Verse, ${user.name}!`);
    };

    const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
            setHologramUrl(null);
            toast.success("PDF Uploaded. Ready to convert to 3D.");
        }
    };

    const generateHologramFromPdf = async () => {
        if (!pdfFile) return;
        setIsGeneratingHolo(true);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const b64 = await fileToBase64(pdfFile);
            
            // 1. Analyze PDF Content
            const analysisPrompt = "Analyze this educational PDF. Identify the main physical object or scientific concept described (e.g., 'Human Heart', 'V8 Engine', 'Solar System'). Return ONLY the visual description string for a 3D model generator.";
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ text: analysisPrompt }, { inlineData: { mimeType: pdfFile.type, data: b64 } }]
            });
            
            const visualDesc = response.text || "Educational Object";

            // 2. Generate Hologram Preview
            const imgPrompt = `A futuristic, glowing blue 3D hologram of ${visualDesc}, floating in a virtual reality classroom, high tech, sci-fi interface style, black background.`;
            const imgUrl = await generateImageForTopic(imgPrompt);
            
            setHologramUrl(imgUrl);
            toast.success(`3D Hologram of '${visualDesc}' generated!`);

        } catch (e) {
            console.error(e);
            toast.error("Failed to generate hologram. Try a smaller PDF.");
        } finally {
            setIsGeneratingHolo(false);
        }
    };

    const renderIntro = () => (
        <div className="flex flex-col items-center justify-center text-center space-y-8 animate-pop-in h-full">
            <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <CubeIcon className="h-32 w-32 text-cyan-400 relative z-10 animate-float" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic">
                SURYA <span className="text-cyan-400 not-italic">METAVERSE</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl font-hindi leading-relaxed">
                "शिक्षा की एक नई दुनिया। जहाँ आप सिर्फ पढ़ते नहीं, बल्कि जीते हैं।" <br/>
                <span className="text-sm opacity-60">(Education-First Virtual Reality)</span>
            </p>

            <button 
                onClick={() => setStep('kyc')}
                className="px-12 py-5 bg-cyan-500 text-black font-black rounded-full shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-105 transition-transform flex items-center gap-3 text-lg uppercase tracking-widest"
            >
                <RocketIcon className="h-6 w-6"/> Enter the Future
            </button>
        </div>
    );

    const renderKYC = () => (
        <div className="max-w-md mx-auto w-full bg-slate-900/50 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl animate-slide-in-right">
            <div className="text-center mb-8">
                <ShieldCheckIcon className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                <h3 className="text-2xl font-bold text-white">Identity Verification (KYC)</h3>
                <p className="text-slate-400 text-sm mt-2 font-hindi">सुरक्षा के लिए आपकी पहचान ज़रूरी है।</p>
            </div>

            <div className="space-y-4 mb-8">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-500"/>
                    <div>
                        <p className="text-xs text-slate-400 uppercase">Linked Account</p>
                        <p className="text-white font-bold">{user.name}</p>
                    </div>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-500"/>
                    <div>
                        <p className="text-xs text-slate-400 uppercase">Device Check</p>
                        <p className="text-white font-bold">Secure Browser</p>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleKYC}
                disabled={loading}
                className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-lg hover:bg-green-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? <Loader message="Verifying..." /> : "GENERATE META PASS"}
            </button>
        </div>
    );

    const renderAvatarSelection = () => (
        <div className="h-full flex flex-col items-center animate-pop-in">
            <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Create Your Avatar</h3>
            <p className="text-slate-400 mb-10 font-hindi">वर्चुअल दुनिया में आपका डिजिटल रूप</p>

            {metaPassId && (
                <div className="mb-10 p-6 bg-gradient-to-r from-cyan-900 to-blue-900 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden group w-full max-w-md">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-1">Surya Meta Pass</p>
                            <p className="text-2xl font-bold text-white tracking-widest font-mono">{metaPassId}</p>
                            <p className="text-xs text-slate-300 mt-4">{user.role} Access Granted</p>
                        </div>
                        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                            <LockClosedIcon className="h-6 w-6 text-cyan-300"/>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {avatars.map(av => (
                    <button 
                        key={av.id}
                        onClick={() => setSelectedAvatar(av)}
                        className={`p-4 rounded-[2rem] border-2 transition-all relative group ${selectedAvatar?.id === av.id ? 'bg-cyan-500/20 border-cyan-400 scale-110' : 'bg-slate-800/50 border-transparent hover:border-slate-600'}`}
                    >
                        <img src={av.url} className="w-24 h-24 mx-auto mb-3" alt={av.name} />
                        <p className="text-white font-bold text-sm">{av.name}</p>
                        <p className="text-xs text-slate-400">{av.style}</p>
                        {selectedAvatar?.id === av.id && (
                            <div className="absolute top-2 right-2 bg-cyan-500 rounded-full p-1"><CheckCircleIcon className="h-3 w-3 text-black"/></div>
                        )}
                    </button>
                ))}
            </div>

            <button 
                onClick={handleEnterWorld}
                disabled={!selectedAvatar}
                className="px-12 py-5 bg-white text-slate-950 font-black rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all uppercase tracking-widest disabled:opacity-50 disabled:shadow-none"
            >
                Enter Virtual World
            </button>
        </div>
    );

    const renderWorld = () => (
        <div className="h-full flex flex-col animate-fade-in">
            {/* HUD Header */}
            <div className="flex justify-between items-center mb-8 bg-slate-900/80 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <img src={selectedAvatar?.url} className="w-12 h-12 bg-slate-800 rounded-full border-2 border-cyan-500" alt="Avatar"/>
                    <div>
                        <p className="text-white font-bold text-sm">{user.name}</p>
                        <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">Online • {activeZone.toUpperCase()} ZONE</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
                    <CurrencyRupeeIcon className="h-5 w-5 text-yellow-400"/>
                    <span className="text-white font-mono font-bold">{walletBalance} CR</span>
                    <button className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-black hover:bg-yellow-400 transition-colors">+</button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
                {/* Navigation Hub */}
                <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Teleport To</p>
                    {[
                        { id: 'edu', label: 'Edu-Verse (Classrooms)', icon: <AcademicCapIcon/>, color: 'text-cyan-400', desc: '3D Classes & Labs' },
                        { id: 'market', label: 'Market-Verse (Shop)', icon: <ShoppingCartIcon/>, color: 'text-purple-400', desc: 'Buy/Sell Digital Assets' },
                        { id: 'health', label: 'Health-Verse (Doctors)', icon: <HeartIcon/>, color: 'text-red-400', desc: 'Virtual Consultancy' },
                        { id: 'fun', label: 'Fun-Verse (Entertainment)', icon: <VideoCameraIcon/>, color: 'text-orange-400', desc: 'Gaming & Cinema' },
                    ].map((zone) => (
                        <button 
                            key={zone.id}
                            onClick={() => setActiveZone(zone.id as Zone)}
                            className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all text-left group ${activeZone === zone.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                        >
                            <div className={`p-3 rounded-xl bg-black/40 ${zone.color}`}>{zone.icon}</div>
                            <div>
                                <p className="text-white font-bold text-sm group-hover:text-cyan-300 transition-colors">{zone.label}</p>
                                <p className="text-[10px] text-slate-500 font-hindi mt-1">{zone.desc}</p>
                            </div>
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl border border-white/10">
                        <p className="text-xs font-bold text-white mb-2 flex items-center gap-2"><SparklesIcon className="h-4 w-4 text-yellow-300"/> Earning Opportunity</p>
                        <p className="text-[10px] text-indigo-200 font-hindi leading-relaxed">
                            "अपना वर्चुअल ऑफिस खरीदें और उसे किराए पर दें। या अपने डिजिटल आर्ट (NFT) बेचें।"
                        </p>
                        <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">Start Business</button>
                    </div>
                </div>

                {/* Main Viewport */}
                <div className="lg:col-span-9 bg-black rounded-[3rem] border-4 border-slate-800 relative overflow-hidden flex items-center justify-center group shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 animate-pulse"></div>
                    
                    {/* Zone Specific Content */}
                    <div className="relative z-10 text-center space-y-6 max-w-lg w-full px-6">
                        {activeZone === 'edu' && !hologramUrl && !isGeneratingHolo && (
                            <div className="animate-pop-in bg-slate-900/80 p-8 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                                <div className="mb-6 text-cyan-400">
                                    <CubeIcon className="h-16 w-16 mx-auto mb-4 animate-float"/>
                                    <h3 className="text-2xl font-black uppercase">Magic 3D Generator</h3>
                                    <p className="text-slate-400 font-hindi text-sm mt-2">किसी भी किताब के पन्ने या PDF को 3D मॉडल में बदलें</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-600 rounded-2xl p-8 hover:bg-white/5 cursor-pointer transition-all group/upload"
                                    >
                                        <div className="flex flex-col items-center">
                                            {pdfFile ? (
                                                <>
                                                    <DocumentTextIcon className="h-10 w-10 text-green-400 mb-2"/>
                                                    <span className="text-white font-bold">{pdfFile.name}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadIcon className="h-8 w-8 text-slate-500 group-hover/upload:text-white transition-colors mb-2"/>
                                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Upload Topic PDF</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf, image/*" onChange={handlePdfUpload} />

                                    <button 
                                        onClick={generateHologramFromPdf}
                                        disabled={!pdfFile}
                                        className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl shadow-lg shadow-cyan-600/20 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Generate 3D Model
                                    </button>
                                </div>
                            </div>
                        )}

                        {isGeneratingHolo && (
                             <div className="flex flex-col items-center justify-center">
                                 <Loader message="Constructing 3D Hologram..." />
                                 <p className="text-cyan-400 text-xs mt-4 animate-pulse uppercase font-black tracking-widest">AI Vision Processing</p>
                             </div>
                        )}

                        {hologramUrl && (
                             <div className="relative w-full h-[500px] animate-pop-in">
                                 <img src={hologramUrl} alt="Generated 3D Hologram" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]" />
                                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                                     <button onClick={() => setHologramUrl(null)} className="px-6 py-2 bg-slate-900 border border-white/20 rounded-full text-xs font-bold hover:bg-slate-800 text-white">Reset</button>
                                     <button className="px-6 py-2 bg-cyan-600 text-white rounded-full text-xs font-bold shadow-lg hover:bg-cyan-500">View in VR</button>
                                 </div>
                             </div>
                        )}

                        {activeZone !== 'edu' && (
                             <div className="space-y-4">
                                <div className="w-32 h-32 bg-slate-900/80 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border-4 border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.3)] animate-float">
                                    {activeZone === 'market' && <ShoppingCartIcon className="h-16 w-16 text-purple-400"/>}
                                    {activeZone === 'health' && <HeartIcon className="h-16 w-16 text-red-400"/>}
                                    {activeZone === 'fun' && <VideoCameraIcon className="h-16 w-16 text-orange-400"/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                    {activeZone === 'market' ? 'NFT Marketplace' : activeZone === 'health' ? '3D Clinic' : 'Gaming Arena'}
                                </h2>
                                <p className="text-slate-400 text-sm font-hindi">
                                    Coming Soon in Full Release.
                                </p>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#0f172a] text-white p-6 sm:p-10 rounded-[4rem] shadow-2xl h-full flex flex-col min-h-[800px] border-8 border-slate-950 overflow-hidden relative font-sans">
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

             {step === 'intro' && renderIntro()}
             {step === 'kyc' && <div className="flex items-center justify-center h-full">{renderKYC()}</div>}
             {step === 'avatar' && renderAvatarSelection()}
             {step === 'world' && renderWorld()}
        </div>
    );
};

// Helper Icon
const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436h.001c-3.698-2.881-6.084-7.38-6.084-12.436V1.5z" clipRule="evenodd" />
        <path d="M7.5 15.75l2.25-2.25 2.25 2.25M7.5 21.75l2.25-2.25 2.25 2.25M3 21.75l2.25-2.25 2.25 2.25M3 21.75l2.25-2.25 2.25 2.25" />
    </svg>
);

export default MetaverseLearning;
