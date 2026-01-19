
import React, { useState } from 'react';
import { CheckCircleIcon, SparklesIcon, LeafIcon, StarIcon, TrophyIcon, AcademicCapIcon, BoltIcon } from './icons/AllIcons';

interface Props {
    studentAddress?: string;
    studentPinCode?: string;
}

type Duration = 'Monthly' | '6Months' | '12Months';
type Category = 'Below10' | 'Class10' | 'Class12' | 'AboveAll';

interface PlanDetails {
    name: string;
    price: number;
    features: string[];
    color: string;
    btnColor: string;
    icon: React.ReactNode;
    recommended?: boolean;
}

const PricingPage: React.FC<Props> = ({ studentAddress, studentPinCode }) => {
    const [activeCategory, setActiveCategory] = useState<Category>('Class10');
    const [activeDuration, setActiveDuration] = useState<Duration>('12Months');

    // Configuration Data based on your request
    const pricingMatrix: Record<Category, Record<Duration, { Basic: number, Premium: number, Ultra: number }>> = {
        'Below10': {
            'Monthly': { Basic: 29, Premium: 39, Ultra: 49 },
            '6Months': { Basic: 129, Premium: 199, Ultra: 249 },
            '12Months': { Basic: 249, Premium: 359, Ultra: 399 }
        },
        'Class10': {
            'Monthly': { Basic: 39, Premium: 59, Ultra: 69 },
            '6Months': { Basic: 199, Premium: 299, Ultra: 399 },
            '12Months': { Basic: 399, Premium: 599, Ultra: 699 }
        },
        'Class12': {
            'Monthly': { Basic: 59, Premium: 69, Ultra: 89 },
            '6Months': { Basic: 299, Premium: 399, Ultra: 499 },
            '12Months': { Basic: 599, Premium: 699, Ultra: 899 }
        },
        'AboveAll': {
            'Monthly': { Basic: 59, Premium: 69, Ultra: 89 },
            '6Months': { Basic: 299, Premium: 399, Ultra: 499 },
            '12Months': { Basic: 599, Premium: 699, Ultra: 899 }
        }
    };

    const categories = [
        { id: 'Below10', label: '10th कक्षा से कम', sub: 'Below 10th' },
        { id: 'Class10', label: '10th कक्षा', sub: 'Board Year' },
        { id: 'Class12', label: '12th कक्षा', sub: 'Senior Secondary' },
        { id: 'AboveAll', label: 'College / Competitive', sub: 'UG / PG / Prep' },
    ];

    const durations = [
        { id: 'Monthly', label: 'Monthly (मासिक)' },
        { id: '6Months', label: '6 Months (अर्ध-वार्षिक)' },
        { id: '12Months', label: '12 Months (वार्षिक)' },
    ];

    const currentPrices = pricingMatrix[activeCategory][activeDuration];

    const plans: PlanDetails[] = [
        {
            name: 'Basic (साधारण)',
            price: currentPrices.Basic,
            features: [
                'Digital Attendance (डिजिटल हाजिरी)',
                'Homework Diary (होमवर्क डायरी)',
                'School Notices (नोटिस बोर्ड)',
                'Basic Study Material'
            ],
            color: 'border-slate-200 bg-slate-50',
            btnColor: 'bg-slate-700 hover:bg-slate-800',
            icon: <LeafIcon className="h-6 w-6 text-slate-500"/>
        },
        {
            name: 'Premium (प्रीमियम)',
            price: currentPrices.Premium,
            features: [
                'Everything in Basic',
                'AI Tutor (24/7 Doubt Solving)',
                'Online Test Series',
                'Smart Report Card',
                'Video Lessons'
            ],
            recommended: true,
            color: 'border-orange-200 bg-orange-50',
            btnColor: 'bg-orange-600 hover:bg-orange-700',
            icon: <StarIcon className="h-6 w-6 text-orange-500"/>
        },
        {
            name: 'Ultra Premium (अल्ट्रा)',
            price: currentPrices.Ultra,
            features: [
                'Everything in Premium',
                '1-on-1 Mentorship',
                'Career Prediction AI',
                'Global Bazaar Access',
                'Veo Video Generator Access'
            ],
            color: 'border-indigo-200 bg-indigo-50',
            btnColor: 'bg-indigo-600 hover:bg-indigo-700',
            icon: <TrophyIcon className="h-6 w-6 text-indigo-500"/>
        }
    ];

    return (
        <div className="bg-white p-4 sm:p-8 rounded-[3rem] shadow-soft font-sans animate-pop-in border-4 border-slate-50">
            
            {/* Header */}
            <div className="text-center max-w-4xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-primary/20">
                    <SparklesIcon className="h-4 w-4"/> Affordable Education Revolution
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic leading-none">
                    Select Your <span className="text-primary">Power Plan</span>
                </h2>
                <p className="text-lg text-slate-500 font-hindi font-medium">
                    "शिक्षा वही, दाम सही।" अपनी कक्षा और अवधि चुनें।
                </p>
            </div>

            {/* 1. Category Selection */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id as Category)}
                        className={`px-6 py-3 rounded-2xl border-2 transition-all flex flex-col items-center min-w-[140px] ${activeCategory === cat.id ? 'border-primary bg-primary/5 text-primary shadow-lg scale-105' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}
                    >
                        <span className="font-bold text-sm">{cat.label}</span>
                        <span className="text-[10px] uppercase font-black tracking-widest opacity-60">{cat.sub}</span>
                    </button>
                ))}
            </div>

            {/* 2. Duration Selection */}
            <div className="flex justify-center mb-12">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-slate-200">
                    {durations.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setActiveDuration(d.id as Duration)}
                            className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${activeDuration === d.id ? 'bg-white text-slate-900 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                    <div key={index} className={`relative p-8 rounded-[2.5rem] border-4 transition-all hover:scale-[1.02] flex flex-col hover:shadow-2xl ${plan.color}`}>
                        {plan.recommended && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                                <BoltIcon className="h-3 w-3 text-yellow-400"/> Best Value
                            </div>
                        )}
                        
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 mb-1 font-hindi">{plan.name}</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Type</p>
                            </div>
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                {plan.icon}
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] text-center mb-8 border border-white/50 shadow-sm">
                            <div className="flex justify-center items-start gap-1 text-slate-900">
                                <span className="text-2xl font-bold mt-2">₹</span>
                                <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                            </div>
                            <div className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 inline-block px-3 py-1 rounded-full">
                                {activeDuration === 'Monthly' ? 'Per Month' : activeDuration === '6Months' ? 'For 6 Months' : 'Per Year'}
                            </div>
                        </div>
                        
                        <div className="space-y-4 mb-8 flex-grow">
                            {plan.features.map((f, i) => (
                                <div key={i} className="flex items-start gap-3 text-slate-700">
                                    <div className={`mt-0.5 p-0.5 rounded-full ${plan.recommended ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-600'}`}>
                                        <CheckCircleIcon className="h-4 w-4"/>
                                    </div>
                                    <span className="text-xs sm:text-sm font-hindi font-bold leading-tight">{f}</span>
                                </div>
                            ))}
                        </div>

                        <button className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-xl transition-all transform active:scale-95 uppercase tracking-widest ${plan.btnColor}`}>
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-center">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                     * Free plan includes basic app access with limited features.
                 </p>
            </div>
        </div>
    );
};

export default PricingPage;
