
import React, { useState } from 'react';
import { BookOpenIcon, CheckCircleIcon, ChartBarIcon, SparklesIcon, ArrowTrendingUpIcon, CalendarDaysIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useClassroom } from '../contexts/ClassroomContext';

interface SyllabusTopic {
    id: string;
    name: string;
    isDone: boolean;
    priority: 'High' | 'Medium' | 'Low';
    completedDate?: string;
}

const SyllabusTracker: React.FC = () => {
    const toast = useToast();
    const { selectedClass, subject } = useClassroom();
    
    const [topics, setTopics] = useState<SyllabusTopic[]>([
        { id: '1', name: 'Introduction to Chapter 1', isDone: true, priority: 'High', completedDate: '2024-07-20' },
        { id: '2', name: 'Key Concepts & Formulae', isDone: true, priority: 'High', completedDate: '2024-07-25' },
        { id: '3', name: 'Practical Lab Session', isDone: false, priority: 'Medium' },
        { id: '4', name: 'Revision & Mock Test', isDone: false, priority: 'High' },
        { id: '5', name: 'Advanced Problems', isDone: false, priority: 'Low' },
    ]);

    const toggleTopic = (id: string) => {
        setTopics(prev => prev.map(t => {
            if (t.id === id) {
                const newStatus = !t.isDone;
                if (newStatus) toast.success("टॉपिक पूरा हुआ! (Topic Completed)");
                return { ...t, isDone: newStatus, completedDate: newStatus ? new Date().toISOString().split('T')[0] : undefined };
            }
            return t;
        }));
    };

    const completionRate = Math.round((topics.filter(t => t.isDone).length / topics.length) * 100);

    return (
        <div className="bg-white p-6 rounded-[3rem] shadow-soft min-h-[600px] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                        <BookOpenIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Syllabus Tracker</h2>
                        <p className="text-sm text-slate-500 font-hindi">{selectedClass} • {subject} सिलेबस की स्थिति</p>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-[2.5rem] flex items-center gap-8 shadow-xl">
                    <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="transparent" stroke="white" strokeWidth="4" opacity="0.1"/>
                            <circle cx="32" cy="32" r="28" fill="transparent" stroke="#fbbf24" strokeWidth="4" strokeDasharray={175} strokeDashoffset={175 - (175 * completionRate / 100)} className="transition-all duration-1000"/>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{completionRate}%</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress Status</p>
                        <p className="text-xl font-black text-white">{completionRate < 50 ? 'On Track' : 'Finishing Soon'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
                {/* Topic List */}
                <div className="lg:col-span-8 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {topics.map(topic => (
                        <div 
                            key={topic.id} 
                            onClick={() => toggleTopic(topic.id)}
                            className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center justify-between group ${topic.isDone ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-primary/30'}`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${topic.isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 group-hover:border-primary'}`}>
                                    {topic.isDone && <CheckCircleIcon className="h-5 w-5"/>}
                                </div>
                                <div>
                                    <h4 className={`font-bold ${topic.isDone ? 'text-green-800 line-through' : 'text-slate-800'}`}>{topic.name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Priority: {topic.priority}</p>
                                </div>
                            </div>
                            {topic.isDone && (
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-green-600 block uppercase">Done On</span>
                                    <span className="text-xs text-green-500 font-mono">{topic.completedDate}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* AI Analysis Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10"><SparklesIcon className="h-20 w-20"/></div>
                        <h4 className="font-black text-xs uppercase tracking-widest mb-4 opacity-70">AI Insight</h4>
                        <p className="text-lg font-hindi leading-relaxed font-medium">
                            "आपकी क्लास की रफ्तार अच्छी है। इस गति से सिलेबस **15 अक्टूबर** तक पूरा हो जाएगा। अब रिवीज़न पर ध्यान दें।"
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-xs font-bold text-indigo-200">
                             <CalendarDaysIcon className="h-4 w-4"/> Predicted: 15 Oct 2024
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ArrowTrendingUpIcon className="h-5 w-5 text-primary"/> Completion Trend
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold text-slate-500 uppercase">Theory</span>
                                <span className="text-xs font-black">80%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[80%] rounded-full"></div>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold text-slate-500 uppercase">Practical</span>
                                <span className="text-xs font-black">20%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[20%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SyllabusTracker;
