
import React, { useState, useEffect } from 'react';
import { LearningPath, LearningPathStatus, ServiceName, User } from '../../types';
import { learningPathService } from '../../services/learningPathService';
import { ArrowTrendingUpIcon, CheckCircleIcon, RocketLaunchIcon } from '../icons/AllIcons';

interface LearningPathWidgetProps {
    user: User;
    onNavigate: (service: ServiceName) => void;
}

const statusConfig: { [key in LearningPathStatus]: { color: string, icon: React.ReactNode, label: string } } = {
    [LearningPathStatus.ToReview]: { color: 'border-red-500 bg-red-50 text-red-700', icon: <div className="h-2 w-2 rounded-full bg-red-500" />, label: 'To Review' },
    [LearningPathStatus.NextUp]: { color: 'border-amber-500 bg-amber-50 text-amber-700', icon: <div className="h-2 w-2 rounded-full bg-amber-500" />, label: 'Next Up' },
    [LearningPathStatus.InProgress]: { color: 'border-blue-500 bg-blue-50 text-blue-700', icon: <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />, label: 'In Progress' },
    [LearningPathStatus.Completed]: { color: 'border-green-500 bg-green-50 text-green-700', icon: <CheckCircleIcon className="h-4 w-4" />, label: 'Completed' },
};

const LearningPathWidget: React.FC<LearningPathWidgetProps> = ({ user, onNavigate }) => {
    const [path, setPath] = useState<LearningPath | null>(null);

    useEffect(() => {
        const updatePath = () => setPath(learningPathService.getLearningPathForStudent(user.id));
        updatePath();
        const unsubscribe = learningPathService.subscribe(updatePath);
        return unsubscribe;
    }, [user.id]);

    if (!path) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-soft">
                <h3 className="text-lg font-bold text-slate-800">Your Learning Journey</h3>
                <p className="text-sm text-slate-500 mt-2">Generate your personalized learning path from the 'All Tools' section to see your roadmap here!</p>
                <button onClick={() => onNavigate('Personalized Learning Path')} className="mt-4 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-md">Create Path</button>
            </div>
        );
    }
    
    const activeSteps = path.steps.filter(s => s.status === LearningPathStatus.InProgress || s.status === LearningPathStatus.NextUp).slice(0, 2);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-primary"/>
                    Your Learning Journey: {path.subject}
                </h3>
                <button onClick={() => onNavigate('Personalized Learning Path')} className="text-sm font-semibold text-primary hover:underline">View Full Path</button>
            </div>
            
            <div className="space-y-4">
                {activeSteps.length > 0 ? activeSteps.map(step => (
                    <div key={step.step} className={`p-4 rounded-lg border-l-4 ${statusConfig[step.status].color}`}>
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-bold text-slate-800">{step.step}. {step.topic}</p>
                            <span className={`flex items-center gap-1.5 text-xs font-bold ${statusConfig[step.status].color.split(' ')[2]}`}>
                                {statusConfig[step.status].icon}
                                {statusConfig[step.status].label}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{step.objective}</p>
                        <div className="mt-3 p-2 bg-slate-100 rounded text-xs text-slate-600">
                             <p><strong>Suggestion:</strong> {step.suggestion}</p>
                        </div>
                        <button className="mt-3 flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-full hover:bg-primary-dark">
                            <RocketLaunchIcon className="h-4 w-4"/>
                            {step.status === LearningPathStatus.InProgress ? 'Continue' : 'Start Now'}
                        </button>
                    </div>
                )) : <p className="text-sm text-slate-500">You've completed all active steps! Generate a new path or review completed topics.</p>}
            </div>
        </div>
    );
};
export default LearningPathWidget;
