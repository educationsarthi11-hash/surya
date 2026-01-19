
import React, { useState, useEffect } from 'react';
import { LearningPath, LearningPathStatus, LearningPathStep, User, LocationType } from '../types';
import { useToast } from '../hooks/useToast';
import { generateLearningPath } from '../services/geminiService';
import Loader from './Loader';
import { ArrowTrendingUpIcon, SparklesIcon, CheckCircleIcon } from './icons/AllIcons';
import { useClassroom } from '../contexts/ClassroomContext';

interface PersonalizedLearningPathProps {
    user: User;
}

const statusConfig: { [key in LearningPathStatus]: { color: string, icon: React.ReactNode } } = {
    [LearningPathStatus.ToReview]: { color: 'border-red-500 bg-red-50', icon: <div className="h-2.5 w-2.5 rounded-full bg-red-500" /> },
    [LearningPathStatus.NextUp]: { color: 'border-amber-500 bg-amber-50', icon: <div className="h-2.5 w-2.5 rounded-full bg-amber-500" /> },
    [LearningPathStatus.InProgress]: { color: 'border-blue-500 bg-blue-50', icon: <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" /> },
    [LearningPathStatus.Completed]: { color: 'border-green-500 bg-green-50', icon: <CheckCircleIcon className="h-4 w-4 text-green-500" /> },
};


const PersonalizedLearningPath: React.FC<PersonalizedLearningPathProps> = ({ user }) => {
    const toast = useToast();
    const { selectedClass } = useClassroom();
    const [subject, setSubject] = useState('Mathematics');
    const [performanceInfo, setPerformanceInfo] = useState('');
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGeneratePath = async () => {
        if (!subject.trim() || !performanceInfo.trim()) {
            toast.error("Please provide the subject and your performance details.");
            return;
        }
        setLoading(true);
        setLearningPath(null);
        try {
            const path = await generateLearningPath(subject, selectedClass, performanceInfo);
            setLearningPath(path);
            toast.success("Your personalized learning path is ready!");
        } catch (error) {
            console.error("Failed to generate learning path:", error);
            toast.error("AI could not generate a path. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleUpdateStatus = (stepIndex: number, newStatus: LearningPathStatus) => {
        if (!learningPath) return;
        
        const updatedSteps = learningPath.steps.map((step, index) => {
            if (index === stepIndex) {
                return { ...step, status: newStatus };
            }
            // If completing a step, mark the next one as 'In Progress'
            if (index === stepIndex + 1 && newStatus === LearningPathStatus.Completed && step.status !== LearningPathStatus.Completed) {
                 return { ...step, status: LearningPathStatus.InProgress };
            }
            return step;
        });
        
        setLearningPath({ ...learningPath, steps: updatedSteps });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
                <ArrowTrendingUpIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Personalized Learning Path</h2>
                    <p className="text-sm text-neutral-500 font-hindi">AI-जनरेटेड स्टडी रोडमैप</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 p-4 border rounded-lg bg-neutral-50 space-y-4 h-fit">
                    <h3 className="text-lg font-bold text-neutral-800">Create Your Roadmap</h3>
                     
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm">
                        <p><strong>Current Context:</strong> Creating a path for <strong>{selectedClass}</strong>.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Subject</label>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700">Weak Topics / Recent Performance</label>
                        <textarea
                            value={performanceInfo}
                            onChange={e => setPerformanceInfo(e.target.value)}
                            rows={4}
                            placeholder="e.g., 'I scored 55/100 in my last test. I'm weak in trigonometry and quadratic equations.'"
                            className="mt-1 block w-full p-2 border rounded-md text-sm"
                        />
                    </div>
                    <button onClick={handleGeneratePath} disabled={loading} className="w-full flex justify-center items-center py-2.5 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-neutral-400">
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        {loading ? 'Generating...' : 'Generate My Path'}
                    </button>
                </div>

                {/* Learning Path Display */}
                <div className="lg:col-span-2">
                    {loading && <Loader message="AI is designing your personalized path..." />}
                    {!loading && !learningPath && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400 p-8 border-2 border-dashed rounded-lg">
                            <ArrowTrendingUpIcon className="h-16 w-16 mb-4" />
                            <h3 className="font-semibold text-lg text-neutral-600">Your Learning Path Will Appear Here</h3>
                            <p className="text-sm mt-1">Fill in your details and let AI create a roadmap for you.</p>
                        </div>
                    )}
                    {learningPath && (
                        <div className="animate-pop-in">
                             <h3 className="text-xl font-bold text-neutral-800 mb-4">Your Roadmap for {learningPath.subject}</h3>
                             <div className="flow-root">
                                 <ul role="list" className="-mb-8">
                                    {learningPath.steps.map((step, stepIdx) => (
                                        <li key={step.step}>
                                            <div className="relative pb-8">
                                                {stepIdx !== learningPath.steps.length - 1 ? (
                                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-neutral-200" aria-hidden="true" />
                                                ) : null}
                                                <div className="relative flex items-start space-x-3">
                                                    <div>
                                                        <div className="relative px-1">
                                                            <div className="h-8 w-8 bg-neutral-100 rounded-full ring-4 ring-white flex items-center justify-center">
                                                                <span className="font-bold text-primary">{step.step}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`min-w-0 flex-1 p-4 rounded-lg border-l-4 ${statusConfig[step.status].color}`}>
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-bold text-neutral-800">{step.topic}</p>
                                                                <p className="text-sm text-neutral-600 mt-1">{step.objective}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                                {statusConfig[step.status].icon} {step.status}
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 p-2 bg-neutral-100 rounded-md text-sm">
                                                             <p><strong className="font-semibold">Suggested Action:</strong> {step.suggestion}</p>
                                                        </div>
                                                        <div className="mt-3 flex items-center gap-2">
                                                            {step.status !== LearningPathStatus.Completed && <button onClick={() => handleUpdateStatus(stepIdx, LearningPathStatus.Completed)} className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full hover:bg-green-200">Mark as Completed</button>}
                                                            {step.status === LearningPathStatus.NextUp && <button onClick={() => handleUpdateStatus(stepIdx, LearningPathStatus.InProgress)} className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200">Start Now</button>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                 </ul>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalizedLearningPath;
