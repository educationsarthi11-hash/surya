
import React, { useState, useMemo } from 'react';
import { COUNTRIES, Country, Language } from '../config/localizationData';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import { GlobeAltIcon, XIcon, MagnifyingGlassIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const LocalizationModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { selectedCountry, setCountry, setLanguage } = useLanguage();
    const { setConfig } = useAppConfig();
    const [step, setStep] = useState(1);
    const [tempCountry, setTempCountry] = useState<Country>(selectedCountry);
    const [searchQuery, setSearchQuery] = useState('');
    const toast = useToast();

    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) return COUNTRIES;
        const q = searchQuery.toLowerCase();
        return COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    }, [searchQuery]);

    const filteredLanguages = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return tempCountry.languages.filter(l => 
            l.name.toLowerCase().includes(q) || l.nativeName.toLowerCase().includes(q)
        );
    }, [searchQuery, tempCountry]);

    if (!isOpen) return null;

    const handleCountrySelect = (country: Country) => {
        setTempCountry(country);
        setSearchQuery('');
        setStep(2);
    };

    const handleFinish = (langCode: string) => {
        setCountry(tempCountry.code);
        setLanguage(langCode);
        
        // देश के नाम को Global Config में सिंक करें ताकि बोर्ड सही दिखें
        setConfig({ 
            selectedCountry: tempCountry.name,
            selectedState: tempCountry.name // International users के लिए State ही Country होगी
        });

        toast.success(`Welcome! Location set to ${tempCountry.flag} ${tempCountry.name}`);
        onClose();
        setStep(1);
    };

    return (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-white/20">
                
                {/* Visual Side */}
                <div className="hidden md:flex w-1/3 bg-slate-900 p-10 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <GlobeAltIcon className="h-12 w-12 text-primary mb-6" />
                        <h2 className="text-4xl font-black tracking-tight leading-none uppercase">
                            {step === 1 ? 'Global' : 'Local'} <br/> <span className="text-primary">Selector</span>
                        </h2>
                        <p className="mt-6 text-slate-400 font-hindi text-lg leading-relaxed">
                            {step === 1 ? "पूरी दुनिया में कहीं भी अपना सार्थी चुनें।" : "अपनी भाषा चुनें।"}
                        </p>
                    </div>
                </div>

                {/* Selection Side */}
                <div className="flex-1 flex flex-col h-full bg-slate-50">
                    <div className="p-8 border-b bg-white shrink-0">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                                {step === 1 ? 'Select Country' : 'Select Language'}
                            </h3>
                            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><XIcon className="h-5 w-5"/></button>
                        </div>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                                type="text"
                                placeholder={step === 1 ? "Search country (e.g. Canada)..." : "Search language..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-3 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {step === 1 ? (
                                filteredCountries.map(c => (
                                    <button 
                                        key={c.code}
                                        onClick={() => handleCountrySelect(c)}
                                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all hover:scale-105 ${tempCountry.code === c.code ? 'border-primary bg-primary/5' : 'bg-white border-slate-100'}`}
                                    >
                                        <span className="text-4xl drop-shadow-sm">{c.flag}</span>
                                        <span className="font-bold text-xs uppercase text-slate-600 text-center">{c.name}</span>
                                    </button>
                                ))
                            ) : (
                                filteredLanguages.map(l => (
                                    <button 
                                        key={l.code}
                                        onClick={() => handleFinish(l.code)}
                                        className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 flex flex-col items-center text-center bg-white border-slate-100 hover:border-primary`}
                                    >
                                        <span className="font-black text-slate-800 leading-none">{l.nativeName}</span>
                                        <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{l.name}</span>
                                    </button>
                                ))
                            )}
                        </div>
                        {filteredCountries.length === 0 && step === 1 && (
                            <div className="text-center py-20 opacity-40">
                                <GlobeAltIcon className="h-20 w-20 mx-auto mb-4"/>
                                <p className="font-black uppercase">No results found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocalizationModal;
