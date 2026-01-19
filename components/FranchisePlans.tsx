
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircleIcon, SparklesIcon, BuildingOfficeIcon, GlobeAltIcon, RocketLaunchIcon, TrophyIcon } from './icons/AllIcons';

const FranchisePlans: React.FC = () => {
    const { t } = useLanguage();

    const plans = [
        {
            name: 'Basic Smart Tier (Tier-3)',
            hindi: 'बेसिक स्मार्ट टियर',
            price: '₹25,000',
            duration: 'One-time Setup',
            color: 'bg-white',
            borderColor: 'border-slate-200',
            textColor: 'text-slate-900',
            icon: <BuildingOfficeIcon className="h-10 w-10 text-slate-400" />,
            features: [
                'School/Coaching branded Dashboard',
                'AI Admissions System (100% Auto)',
                'Digital ID Card Generation',
                'Fee Management & Reports',
                'Face Attendance App',
                'AI Doubt Solver (Limited)'
            ]
        },
        {
            name: 'Elite AI Campus (Tier-2)',
            hindi: 'एलिट AI कैंपस',
            price: '₹75,000',
            duration: 'One-time Setup',
            color: 'bg-indigo-600',
            borderColor: 'border-indigo-600',
            textColor: 'text-white',
            recommended: true,
            icon: <RocketLaunchIcon className="h-10 w-10 text-white" />,
            features: [
                'Everything in Basic Tier',
                'Android App with YOUR Logo',
                'AI Teacher (Ustad) for all classes',
                'AI Auto-Fee Recovery (Calling)',
                'Marketing Suite (AI Ad Generator)',
                'Online Exam & Proctoring'
            ]
        },
        {
            name: 'Master Sarthi Franchise',
            hindi: 'मास्टर सार्थी फ्रेंचाइजी',
            price: '₹2.5 Lakhs',
            duration: 'Full Branding Rights',
            color: 'bg-slate-900',
            borderColor: 'border-slate-900',
            textColor: 'text-white',
            icon: <TrophyIcon className="h-10 w-10 text-yellow-400" />,
            features: [
                'Full White-label Solution (iOS + Android)',
                'Dedicated AI Server Support',
                'Regional Language Content Unlock',
                'LMS with 10,000+ Video Lessons',
                'Recruitment & HR Automation',
                'Area Exclusive Rights (Zip Code)'
            ]
        }
    ];

    return (
        <div className="bg-slate-50 p-6 sm:p-10 rounded-[3rem] animate-pop-in">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase mb-4 tracking-widest">
                    <SparklesIcon className="h-4 w-4" /> Partner Opportunities
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">Investment Levels</h2>
                <p className="text-lg text-slate-500 font-hindi">अपनी आय और लक्ष्य के अनुसार सही फ्रेंचाइजी प्लान चुनें</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((plan, idx) => (
                    <div 
                        key={idx} 
                        className={`relative rounded-[2.5rem] p-8 border-2 transition-all duration-500 hover:shadow-2xl flex flex-col ${plan.color} ${plan.borderColor} ${plan.textColor} ${plan.recommended ? 'scale-105 ring-8 ring-primary/5' : ''}`}
                    >
                        {plan.recommended && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}
                        
                        <div className="mb-8">
                            <div className="mb-4">{plan.icon}</div>
                            <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                            <h4 className="text-sm font-bold opacity-70 font-hindi mt-1">{plan.hindi}</h4>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-black">{plan.price}</span>
                            <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1">{plan.duration}</p>
                        </div>

                        <div className="flex-grow space-y-4 mb-10">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.recommended || plan.name.includes('Master') ? 'text-green-400' : 'text-primary'}`} />
                                    <span className="text-sm font-medium opacity-90">{f}</span>
                                </div>
                            ))}
                        </div>

                        <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all transform active:scale-95 shadow-lg ${
                            plan.recommended ? 'bg-white text-indigo-600 hover:bg-slate-50' : 
                            plan.name.includes('Master') ? 'bg-indigo-600 text-white hover:bg-indigo-700' :
                            'bg-slate-900 text-white hover:bg-slate-800'
                        }`}>
                            INTERESTED? CONTACT US
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-10 bg-indigo-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                 <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10">Looking for a custom enterprise solution?</h3>
                 <p className="text-slate-500 mb-8 relative z-10">If you have more than 5,000 students or manage multiple states, we offer custom cloud deployment.</p>
                 <div className="flex flex-wrap justify-center gap-4 relative z-10">
                     <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Talk to Sales</button>
                     <button className="px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">Download Master Brochure</button>
                 </div>
            </div>
        </div>
    );
};

export default FranchisePlans;
