
import React from 'react';
import { CheckCircleIcon, AcademicCapIcon, BriefcaseIcon, StarIcon, MapPinIcon, DocumentTextIcon, BuildingLibraryIcon, SparklesIcon } from '../icons/AllIcons';

const CareerRoadmapWidget: React.FC = () => {
    // Mock data for a typical path (e.g., Engineering aspirant)
    const steps = [
        { id: 1, title: 'Class 10', status: 'completed', icon: <AcademicCapIcon className="h-5 w-5 text-white"/>, date: '2022' },
        { id: 2, title: 'Stream: Science (PCM)', status: 'completed', icon: <AcademicCapIcon className="h-5 w-5 text-white"/>, date: '2023' },
        { id: 3, title: 'Class 12 Board', status: 'in-progress', icon: <DocumentTextIcon className="h-5 w-5 text-white"/>, date: 'Current' },
        { id: 4, title: 'JEE Entrance', status: 'locked', icon: <StarIcon className="h-5 w-5 text-slate-400"/>, date: '2025' },
        { id: 5, title: 'B.Tech College', status: 'locked', icon: <BuildingLibraryIcon className="h-5 w-5 text-slate-400"/>, date: '2025-29' },
        { id: 6, title: 'Software Engineer', status: 'locked', icon: <BriefcaseIcon className="h-5 w-5 text-slate-400"/>, date: 'Goal' },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <MapPinIcon className="h-6 w-6 text-indigo-500"/>
                        My Career Roadmap
                    </h3>
                    <p className="text-sm text-slate-500 font-hindi">लक्ष्य: सॉफ्टवेयर इंजीनियर</p>
                </div>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">50% Complete</span>
            </div>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-6 left-0 w-full h-1 bg-slate-100 rounded-full -z-10"></div>
                <div className="absolute top-6 left-0 h-1 bg-indigo-500 rounded-full -z-10 transition-all duration-1000" style={{ width: '40%' }}></div>

                <div className="flex justify-between items-start overflow-x-auto pb-4 no-scrollbar gap-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center min-w-[80px] group cursor-pointer">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative z-10 ${
                                step.status === 'completed' ? 'bg-green-500 border-green-200' :
                                step.status === 'in-progress' ? 'bg-indigo-500 border-indigo-200 animate-pulse-slow' :
                                'bg-slate-200 border-slate-100'
                            }`}>
                                {step.status === 'completed' ? <CheckCircleIcon className="h-6 w-6 text-white"/> : step.icon}
                            </div>
                            <div className="text-center mt-3">
                                <p className={`text-xs font-bold ${step.status === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>{step.title}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{step.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                    <SparklesIcon className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                    <p className="text-xs font-bold text-indigo-800">AI Suggestion:</p>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                        Based on your recent Physics scores, consider focusing on 'Optics' to boost your JEE rank probability.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmapWidget;
