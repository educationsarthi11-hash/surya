
import React from 'react';
import SectionWrapper from './SectionWrapper';
import { DocumentTextIcon, ArrowDownTrayIcon, SparklesIcon, CheckCircleIcon } from '../icons/AllIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../hooks/useToast';

const ProspectusSection: React.FC = () => {
    const { language } = useLanguage();
    const isHindi = language === 'hi' || language === 'hr';
    const toast = useToast();

    const handleDownload = () => {
        toast.success(isHindi ? "आपका डिजिटल प्रोस्पेक्टस डाउनलोड हो रहा है..." : "Your digital prospectus is downloading...");
        // Simulation link
        window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    };

    return (
        <section id="prospectus" className="bg-slate-900 py-32 relative overflow-hidden">
            {/* Abstract Design Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-10 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-light px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/30">
                            <SparklesIcon className="h-4 w-4"/> Admissions 2024-25 Open
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-black text-white leading-tight uppercase tracking-tighter italic">
                            KNOW THE <br/> <span className="text-primary not-italic">DIFFERENCE.</span>
                        </h2>
                        <p className="text-slate-400 text-2xl font-hindi leading-relaxed font-medium">
                            मंगमत स्कूल की कार्यप्रणाली और एआई क्लासरूम के बारे में विस्तार से जानने के लिए हमारा गाइड डाउनलोड करें।
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                'आधुनिक एआई लैब', 
                                'मातृभाषा में शिक्षा', 
                                'डिजिटल मार्कशीट', 
                                'लाइव बस ट्रैकिंग'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-slate-200">
                                    <div className="bg-green-500/20 p-1.5 rounded-xl"><CheckCircleIcon className="h-6 w-6 text-green-500" /></div>
                                    <span className="font-bold font-hindi text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-10 bg-primary/10 rounded-[5rem] blur-3xl"></div>
                        <div className="relative bg-white p-12 sm:p-20 rounded-[4rem] shadow-3xl border-[15px] border-slate-800 text-center group transition-transform hover:scale-[1.02] duration-700">
                            <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:rotate-12 transition-transform">
                                <DocumentTextIcon className="h-16 w-16 text-primary" />
                            </div>
                            <h3 className="text-4xl font-black text-slate-950 mb-4 uppercase tracking-tighter">OFFICIAL PROSPECTUS</h3>
                            <p className="text-slate-500 text-lg font-hindi mb-12 font-medium">नया सत्र 2024 के लिए संपूर्ण गाइड</p>
                            <button 
                                onClick={handleDownload}
                                className="w-full py-6 bg-slate-950 text-white font-black rounded-3xl shadow-2xl hover:bg-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 active:scale-95 uppercase tracking-widest text-xl group"
                            >
                                <ArrowDownTrayIcon className="h-8 w-8 group-hover:animate-bounce" /> DOWNLOAD NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProspectusSection;
