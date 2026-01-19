import React from 'react';
import SectionWrapper from './SectionWrapper';
import { RocketLaunchIcon, SparklesIcon, BuildingOfficeIcon, BoltIcon, GlobeAltIcon, UsersIcon, ShieldCheckIcon } from '../icons/AllIcons';
import { useLanguage } from '../../contexts/LanguageContext';

const Milestone: React.FC<{ title: string; desc: string; date: string; isLeft: boolean; icon: React.ReactNode }> = ({ title, desc, date, isLeft, icon }) => (
    <div className={`flex items-center justify-between w-full mb-20 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="hidden md:block w-5/12"></div>
        <div className="z-20 flex items-center justify-center w-14 h-14 bg-slate-900 rounded-full shadow-2xl border-4 border-primary ring-8 ring-slate-50">
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6 text-primary" })}
        </div>
        <div className={`w-full md:w-5/12 bg-white p-10 rounded-[4rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-slate-100 hover:shadow-2xl transition-all group ${isLeft ? 'text-right' : 'text-left'}`}>
            <span className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 bg-primary/5 px-4 py-1 rounded-full border border-primary/10">{date}</span>
            <h4 className="text-2xl font-black text-slate-900 mb-3 uppercase italic leading-tight">{title}</h4>
            <p className="text-base text-slate-500 font-hindi font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

const RoadmapSection: React.FC = () => {
    const { language } = useLanguage();
    const isHindi = language === 'hi' || language === 'hr';

    return (
        <SectionWrapper id="roadmap" className="bg-[#fffdf7] py-40">
            <div className="text-center max-w-4xl mx-auto mb-32">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-6">
                    <RocketLaunchIcon className="h-4 w-4" /> DEPLOYMENT STRATEGY
                </div>
                <h2 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                    SURYA <span className="text-primary not-italic">VISION 2025.</span>
                </h2>
                <p className="mt-8 text-2xl text-slate-500 font-hindi font-bold">
                    मंगमत स्कूल में एआई सिस्टम लागू करने के महत्वपूर्ण चरण।
                </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
                {/* Timeline Center Line */}
                <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-slate-200 rounded-full"></div>

                <Milestone 
                    date="PHASE 1: FOUNDATION" 
                    title="Smart Onboarding"
                    desc="सभी पुराने रिकॉर्ड्स का डिजिटल आर्काइव और नया AI एडमिशन सिस्टम सक्रिय।"
                    icon={<BuildingOfficeIcon/>}
                    isLeft={true}
                />
                <Milestone 
                    date="PHASE 2: INTELLIGENCE" 
                    title="AI Classroom Launch"
                    desc="शिक्षकों के लिए स्मार्ट बोर्ड और छात्रों के लिए 'सार्थी उस्ताद' ट्यूटर मोड का उद्घाटन।"
                    icon={<SparklesIcon/>}
                    isLeft={false}
                />
                <Milestone 
                    date="PHASE 3: ECOSYSTEM" 
                    title="Global Bazaar Active"
                    desc="छात्रों द्वारा बनाए गए प्रोजेक्ट्स और उत्पादों के लिए वैश्विक बाज़ार का गेटवे लॉन्च।"
                    icon={<GlobeAltIcon/>}
                    isLeft={true}
                />
                <Milestone 
                    date="PHASE 4: SECURITY" 
                    title="Verified Shield"
                    desc="फ्रॉड प्रोटेक्शन लेयर और ब्लॉकचेन आधारित सर्टिफिकेट वेरिफिकेशन का पूर्ण कार्यान्वयन।"
                    icon={<ShieldCheckIcon/>}
                    isLeft={false}
                />
                <Milestone 
                    date="FUTURE: EXPANSION" 
                    title="Multi-Node Scale"
                    desc="मंगमत ग्रुप की 100+ अन्य शाखाओं को एक ही मास्टर कंट्रोल पैनल से जोड़ा जाएगा।"
                    icon={<BoltIcon/>}
                    isLeft={true}
                />
            </div>
            
            <div className="mt-20 text-center">
                 <div className="p-12 bg-slate-900 rounded-[5rem] text-white max-w-3xl mx-auto shadow-3xl border-4 border-slate-800">
                     <UsersIcon className="h-16 w-16 text-primary mx-auto mb-6" />
                     <h3 className="text-3xl font-black uppercase italic tracking-tight mb-4">JOIN THE REVOLUTION</h3>
                     <p className="text-slate-400 font-hindi text-xl leading-relaxed mb-10">
                        "हम सिर्फ पढ़ाते नहीं, हम भविष्य के लीडर्स बनाते हैं।"
                     </p>
                     <button className="px-12 py-5 bg-primary text-slate-950 font-black rounded-[2rem] shadow-xl hover:bg-white transition-all uppercase tracking-widest text-sm active:scale-95">
                         Get System Access
                     </button>
                 </div>
            </div>
        </SectionWrapper>
    );
};

export default RoadmapSection;