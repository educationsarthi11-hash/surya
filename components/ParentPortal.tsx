
import React, { useState, useEffect, useMemo } from 'react';
import { PhoneIcon, MapPinIcon, CurrencyRupeeIcon, SpeakerWaveIcon, HeartIcon, LeafIcon, SparklesIcon, CheckCircleIcon, ArrowRightIcon, ChartBarIcon, ArrowTrendingUpIcon, GlobeAltIcon, MagnifyingGlassIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useAppConfig } from '../contexts/AppConfigContext';
import { ServiceName, User } from '../types';

interface ParentPortalProps {
    user: User;
    setActiveService: (s: ServiceName) => void;
}

// Helper to get crops based on PIN Code Prefix
const getCropsByPinCode = (pin: string) => {
    const prefix = pin.substring(0, 2); // First 2 digits determine state/region usually
    const subPrefix = pin.substring(0, 3); 

    // Haryana (12, 13)
    if (['12', '13'].includes(prefix)) {
        return [
            { name: "गेहूँ (Wheat)", price: "2,275", unit: "Qtl" },
            { name: "सरसों (Mustard)", price: "5,650", unit: "Qtl" },
            { name: "बासमती धान", price: "3,800", unit: "Qtl" },
            { name: "बाजरा", price: "2,350", unit: "Qtl" }
        ];
    }
    // Punjab (14, 15, 16)
    if (['14', '15', '16'].includes(prefix)) {
        return [
            { name: "गेहूँ (Wheat)", price: "2,275", unit: "Qtl" },
            { name: "धान (Paddy)", price: "3,100", unit: "Qtl" },
            { name: "मक्का (Maize)", price: "2,100", unit: "Qtl" },
            { name: "आलू (Potato)", price: "800", unit: "Qtl" }
        ];
    }
    // Delhi (11)
    if (prefix === '11') {
        return [
            { name: "टमाटर (Tomato)", price: "40", unit: "kg" },
            { name: "प्याज (Onion)", price: "35", unit: "kg" },
            { name: "आलू (Potato)", price: "20", unit: "kg" },
            { name: "फूलगोभी", price: "50", unit: "kg" }
        ];
    }
    // UP (20-28)
    if (parseInt(prefix) >= 20 && parseInt(prefix) <= 28) {
        return [
            { name: "गन्ना (Sugarcane)", price: "370", unit: "Qtl" },
            { name: "गेहूँ (Wheat)", price: "2,300", unit: "Qtl" },
            { name: "आलू (Potato)", price: "950", unit: "Qtl" },
            { name: "मसूर दाल", price: "6,100", unit: "Qtl" }
        ];
    }
    // Rajasthan (30-34)
    if (parseInt(prefix) >= 30 && parseInt(prefix) <= 34) {
        return [
            { name: "जीरा (Cumin)", price: "28,000", unit: "Qtl" },
            { name: "ग्वार (Guar)", price: "5,200", unit: "Qtl" },
            { name: "बाजरा", price: "2,200", unit: "Qtl" },
            { name: "मूंग", price: "7,500", unit: "Qtl" }
        ];
    }
    // Maharashtra (40-44)
    if (parseInt(prefix) >= 40 && parseInt(prefix) <= 44) {
        return [
            { name: "प्याज (Onion)", price: "1,800", unit: "Qtl" },
            { name: "कपास (Cotton)", price: "7,200", unit: "Qtl" },
            { name: "सोयाबीन", price: "4,600", unit: "Qtl" },
            { name: "तुअर दाल", price: "9,000", unit: "Qtl" }
        ];
    }
     // MP (45-48)
     if (parseInt(prefix) >= 45 && parseInt(prefix) <= 48) {
        return [
            { name: "सोयाबीन", price: "4,550", unit: "Qtl" },
            { name: "गेहूँ (MP Sharbati)", price: "3,800", unit: "Qtl" },
            { name: "चना (Gram)", price: "5,800", unit: "Qtl" },
            { name: "लहसुन", price: "12,000", unit: "Qtl" }
        ];
    }

    // Default Fallback
    return [
        { name: "गेहूँ (Wheat)", price: "2,275", unit: "Qtl" },
        { name: "चावल (Rice)", price: "3,500", unit: "Qtl" },
        { name: "चीनी (Sugar)", price: "42", unit: "kg" },
        { name: "दाल (Pulses)", price: "110", unit: "kg" }
    ];
};

const ParentPortal: React.FC<ParentPortalProps> = ({ user, setActiveService }) => {
    const toast = useToast();
    const { fatherName, userName, institutionName, logoUrl, selectedState } = useAppConfig();
    
    const [pinCode, setPinCode] = useState('');
    const [searchPin, setSearchPin] = useState(''); // To trigger search
    const [marketData, setMarketData] = useState<any[]>([]);

    useEffect(() => {
        // Initial load based on state or default
        // If user enters pin, use that, else use default logic
        const data = getCropsByPinCode(searchPin || '12'); // Default to Haryana region if empty
        
        // Add some random fluctuation to make it feel live
        const updatedData = data.map(item => ({
            ...item,
            price: (parseInt(item.price.replace(/,/g, '')) + Math.floor(Math.random() * 50 - 25)).toLocaleString(),
            trend: Math.random() > 0.5 ? 'up' : 'down'
        }));
        setMarketData(updatedData);

    }, [searchPin, selectedState]);

    const handlePinSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinCode.length < 2) {
            toast.error("कृपया सही पिन कोड डालें (Enter valid PIN)");
            return;
        }
        setSearchPin(pinCode);
        toast.success(`पिन कोड ${pinCode} के भाव अपडेट हो रहे हैं...`);
    };

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-pop-in max-w-[1400px] mx-auto pb-32">
            {/* Parent Welcome Header */}
            <div className="bg-slate-900 p-10 rounded-[4rem] text-white relative overflow-hidden shadow-2xl border-4 border-white/5">
                <div className="absolute top-0 right-0 p-24 bg-primary/10 rounded-full blur-[100px] -mr-10 -mt-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 mb-4">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Parent Secure Access</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-3">नमस्ते, {fatherName || 'अभिभावक'} जी! 👋</h2>
                        <p className="text-slate-400 font-hindi text-xl max-w-xl">{userName} की प्रगति और सुरक्षा रिपोर्ट यहाँ {institutionName} पोर्टल पर उपलब्ध है।</p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl p-4 border-4 border-white/10">
                        {logoUrl ? <img src={logoUrl} className="max-w-full max-h-full object-contain" alt="Institution Logo"/> : <div className="font-black text-slate-200">LOGO</div>}
                    </div>
                </div>
            </div>

            {/* QUICK FEE ALERT */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-[3rem] p-8 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 transform hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-6">
                    <div className="bg-white/20 p-5 rounded-[2rem] backdrop-blur-md border border-white/20">
                        <CurrencyRupeeIcon className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Online Fee Counter</h3>
                        <p className="text-orange-100 font-hindi font-bold text-lg opacity-90 mt-1">अगस्त महीने की फीस जमा करने का लिंक सक्रिय है।</p>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveService('Fee Management')}
                    className="px-10 py-5 bg-white text-orange-600 font-black rounded-3xl shadow-xl hover:bg-slate-900 hover:text-white transition-all flex items-center gap-3 active:scale-95"
                >
                    फीस जमा करें <ArrowRightIcon className="h-5 w-5" />
                </button>
            </div>

            {/* CORE PARENT ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Track Child */}
                <button onClick={() => toast.info(`${userName} अभी स्कूल बस में है और घर की ओर आ रहा है।`)} className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 hover:border-primary transition-all shadow-sm hover:shadow-2xl text-center group active:scale-95 transform overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <MapPinIcon className="h-10 w-10" />
                    </div>
                    <h3 className="font-black text-slate-800 text-2xl font-hindi">बच्चा कहाँ है?</h3>
                    <p className="text-xs text-slate-400 mt-2 uppercase font-bold tracking-widest">Live Bus Tracking</p>
                </button>

                {/* 2. Audio Summary */}
                <button onClick={() => setActiveService('Progress Monitor')} className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 hover:border-primary transition-all shadow-sm hover:shadow-2xl text-center group active:scale-95 transform overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                    <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner">
                        <SpeakerWaveIcon className="h-10 w-10" />
                    </div>
                    <h3 className="font-black text-slate-800 text-2xl font-hindi">आज क्या पढ़ा?</h3>
                    <p className="text-xs text-slate-400 mt-2 uppercase font-bold tracking-widest">Daily Voice Report</p>
                </button>

                {/* 3. Photos/Events */}
                <button onClick={() => setActiveService('AI Gallery')} className="bg-white p-12 rounded-[4rem] border-2 border-slate-100 hover:border-primary transition-all shadow-sm hover:shadow-2xl text-center group active:scale-95 transform overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                        <SparklesIcon className="h-10 w-10" />
                    </div>
                    <h3 className="font-black text-slate-800 text-2xl font-hindi">स्कूल की फोटो</h3>
                    <p className="text-xs text-slate-400 mt-2 uppercase font-bold tracking-widest">Events & Gallery</p>
                </button>
            </div>
            
            {/* PARENT SPECIAL SECTION (AGRICULTURE & CAREER) */}
            <div className="bg-slate-50 p-10 rounded-[4rem] border-4 border-slate-200 space-y-8">
                <div className="flex items-center gap-4 mb-2">
                     <div className="p-3 bg-green-600 text-white rounded-2xl shadow-lg">
                         <LeafIcon className="h-6 w-6" />
                     </div>
                     <div>
                         <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">अभिभावक विशेष (Parent Special)</h3>
                         <p className="text-sm text-slate-500 font-hindi font-bold">आपकी जरूरत के खास टूल्स</p>
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Agriculture Lab for Farmers */}
                    <div 
                        onClick={() => setActiveService('AI Agriculture Lab')}
                        className="bg-white p-8 rounded-[3rem] border-2 border-green-100 hover:border-green-500 transition-all cursor-pointer shadow-sm hover:shadow-xl group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[4rem] -mr-6 -mt-6"></div>
                        <div className="flex items-start gap-6 relative z-10">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 shadow-inner group-hover:scale-110 transition-transform">
                                <LeafIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-800 font-hindi mb-2">स्मार्ट खेती (AI Lab)</h4>
                                <p className="text-sm text-slate-500 font-hindi leading-relaxed">
                                    अपनी फसल या मिट्टी की फोटो खींचें। AI बताएगा कि खाद कौन सी डालनी है और बीमारी कैसे ठीक होगी।
                                </p>
                                <span className="inline-block mt-4 text-[10px] font-black text-white bg-green-600 px-3 py-1 rounded-full uppercase tracking-widest">
                                    Open Scanner
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Career Prediction */}
                    <div 
                        onClick={() => setActiveService('Career Predictor')}
                        className="bg-white p-8 rounded-[3rem] border-2 border-indigo-100 hover:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-xl group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -mr-6 -mt-6"></div>
                        <div className="flex items-start gap-6 relative z-10">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 shadow-inner group-hover:scale-110 transition-transform">
                                <ChartBarIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-800 font-hindi mb-2">भविष्यवाणी (Future)</h4>
                                <p className="text-sm text-slate-500 font-hindi leading-relaxed">
                                    बच्चे के नंबरों के आधार पर जानें कि वह भविष्य में डॉक्टर, इंजीनियर या अफसर बनेगा?
                                </p>
                                <span className="inline-block mt-4 text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
                                    Check Future
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mandi Bhav Widget - Dynamic based on Location & PIN */}
                <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                         <div className="flex-1">
                             <h4 className="font-black text-slate-800 font-hindi flex items-center gap-3 text-xl">
                                 <ArrowTrendingUpIcon className="h-6 w-6 text-green-600"/> मंडी भाव (Market Rates)
                             </h4>
                             <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1 ml-1">
                                {searchPin ? `PIN: ${searchPin}` : `Region: ${selectedState}`} के ताज़ा भाव
                             </p>
                         </div>
                         
                         {/* PIN Search Bar */}
                         <form onSubmit={handlePinSearch} className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 transition-all w-full sm:w-auto">
                            <div className="pl-3 flex items-center pointer-events-none">
                                <MapPinIcon className="h-4 w-4 text-slate-400"/>
                            </div>
                            <input 
                                type="text"
                                value={pinCode}
                                onChange={e => setPinCode(e.target.value)}
                                placeholder="PIN Code (e.g. 124001)" 
                                className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 w-32 sm:w-40 placeholder:text-slate-400 font-mono"
                                maxLength={6}
                            />
                            <button type="submit" className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors">
                                <MagnifyingGlassIcon className="h-4 w-4"/>
                            </button>
                         </form>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {marketData.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-5 rounded-3xl text-center border-2 border-slate-100 hover:border-green-200 transition-all group cursor-pointer hover:-translate-y-1">
                                <p className="text-sm font-bold text-slate-600 font-hindi mb-2">{item.name}</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">₹{item.price}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Per {item.unit}</p>
                                <div className={`mt-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 ${item.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                                    {item.trend === 'up' ? '▲ तेजी' : '▼ मंदी'}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[9px] text-center text-slate-400 mt-6 font-bold uppercase tracking-widest opacity-60">
                        * भाव सांकेतिक हैं (Indicative Prices based on PIN Region)
                    </p>
                </div>
            </div>
            
            {/* SOS / Support */}
            <div className="bg-white p-10 rounded-[4rem] border-4 border-red-50 shadow-sm flex flex-col md:flex-row items-center gap-10">
                <div className="p-8 bg-red-100 text-red-600 rounded-full animate-pulse shadow-xl shadow-red-100">
                    <HeartIcon className="h-12 w-12" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h4 className="font-black text-slate-900 text-3xl font-hindi tracking-tight">आपातकालीन संपर्क (Help)</h4>
                    <p className="text-lg text-slate-500 font-hindi font-medium mt-1 leading-relaxed">बच्चे की सुरक्षा या किसी अन्य समस्या के लिए सीधे स्कूल एडमिन से बात करें।</p>
                </div>
                <a href="tel:9817776765" className="w-full md:w-auto px-12 py-6 bg-red-600 text-white font-black text-xl rounded-3xl shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-4 group">
                    <PhoneIcon className="h-7 w-7 group-hover:animate-bounce" /> CALL NOW
                </a>
            </div>
        </div>
    );
};

export default ParentPortal;
