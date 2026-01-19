import React from 'react';
import { 
    SparklesIcon, BriefcaseIcon, ShieldCheckIcon, 
    GlobeAltIcon, CalculatorIcon, BoltIcon, BuildingOfficeIcon,
    VideoCameraIcon, BeakerIcon, ShoppingCartIcon, MicrophoneIcon
} from '../icons/AllIcons';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../../contexts/LanguageContext';

const FeatureCard: React.FC<{ 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    className?: string;
    color: string;
}> = ({ title, description, icon, className, color }) => {
    const iconColors: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-600',
        orange: 'bg-orange-100 text-orange-600',
        purple: 'bg-purple-100 text-purple-600',
        green: 'bg-green-100 text-green-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        red: 'bg-red-100 text-red-600'
    };

    return (
        <div className={`relative overflow-hidden bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100 hover:shadow-3xl transition-all duration-700 group ${className}`}>
            <div className={`relative z-10 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 ${iconColors[color]} group-hover:rotate-6 transition-transform shadow-inner`}>
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-10 w-10" })}
            </div>
            <h3 className="relative z-10 text-3xl font-black text-slate-900 mb-4 font-hindi leading-tight tracking-tight uppercase italic group-hover:text-primary transition-colors">{title}</h3>
            <p className="relative z-10 text-slate-500 text-lg font-hindi leading-relaxed font-medium">{description}</p>
        </div>
    );
};

const FeaturesSection: React.FC = () => {
    return (
        <SectionWrapper id="features" className="bg-[#fffdf7] py-40">
            <div className="text-center max-w-4xl mx-auto mb-24">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-primary/20 mb-6">
                    SYSTEM UNPACKED
                </div>
                <h2 className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                    MANGMAT <span className="text-primary not-italic">AI PLAN</span> <br/>
                    DETAILS.
                </h2>
                <p className="text-2xl text-slate-500 mt-8 font-hindi font-bold leading-relaxed">
                    यह सिर्फ एक सॉफ्टवेयर नहीं, मंगमत के छात्रों के लिए प्रगति का सार्थी है।
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    title="AI Smart Admissions"
                    description="10 सेकंड में आधार कार्ड स्कैन करें और एडमिशन फॉर्म ऑटो-फिल करें। पेपर का खर्चा खत्म, समय की बचत।"
                    icon={<BuildingOfficeIcon/>}
                    color="blue"
                    className="md:col-span-2"
                />
                <FeatureCard 
                    title="Haryanvi AI Tutor"
                    description="क्षेत्रीय भाषा और बोली (हिन्दी/हरियाणवी) में पढ़ाने वाला दुनिया का पहला AI गुरु।"
                    icon={<SparklesIcon/>}
                    color="orange"
                    className="md:col-span-1"
                />
                <FeatureCard 
                    title="Google Veo Video"
                    description="शिक्षकों के लिए एक क्लिक में HD वीडियो लेसन तैयार करें। जटिल विषयों को वीडियो से आसान बनाएं।"
                    icon={<VideoCameraIcon/>}
                    color="purple"
                    className="md:col-span-1"
                />
                <FeatureCard 
                    title="3D Virtual Lab"
                    description="विज्ञान और तकनीक को 3D मॉडल्स और मेटावर्स लैब के जरिए करीब से देखें और सीखें।"
                    icon={<BeakerIcon/>}
                    color="green"
                    className="md:col-span-2"
                />
                <FeatureCard 
                    title="Global Bazaar"
                    description="छात्रों के प्रोजेक्ट्स को वैश्विक बाज़ार में बेचने और उन्हें उद्यमी (Entrepreneur) बनाने का हब।"
                    icon={<ShoppingCartIcon/>}
                    color="indigo"
                    className="md:col-span-3"
                />
                <FeatureCard 
                    title="Parent Voice Hub"
                    description="बोलकर रिपोर्ट सुनने की सुविधा। माता-पिता अपनी भाषा में बच्चे की प्रगति जान सकते हैं।"
                    icon={<MicrophoneIcon/>}
                    color="red"
                    className="md:col-span-1"
                />
                <FeatureCard 
                    title="1-Min Test Paper"
                    description="बोर्ड पैटर्न पर आधारित टेस्ट पेपर केवल 1 मिनट में तैयार करें और प्रिंट करें।"
                    icon={<CalculatorIcon/>}
                    color="orange"
                    className="md:col-span-2"
                />
            </div>
        </SectionWrapper>
    );
};

export default FeaturesSection;