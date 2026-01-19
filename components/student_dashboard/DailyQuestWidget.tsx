
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, FireIcon, BoltIcon, StarIcon } from '../icons/AllIcons';
import { useToast } from '../../hooks/useToast';

interface Quest {
    id: number;
    task: string;
    xp: number;
    completed: boolean;
    icon: string;
}

const DailyQuestWidget: React.FC = () => {
    const toast = useToast();
    const [streak, setStreak] = useState(12); // Mock streak
    const [quests, setQuests] = useState<Quest[]>([
        { id: 1, task: 'Solve 5 Math Problems', xp: 50, completed: false, icon: '🧮' },
        { id: 2, task: 'Read "Physics Ch-3"', xp: 30, completed: true, icon: '📖' },
        { id: 3, task: 'Learn 1 New English Word', xp: 20, completed: false, icon: '🗣️' },
    ]);

    const handleComplete = (id: number, xp: number) => {
        setQuests(prev => prev.map(q => q.id === id ? { ...q, completed: true } : q));
        toast.success(`🎉 Quest Complete! +${xp} XP Earned!`);
    };

    const progress = Math.round((quests.filter(q => q.completed).length / quests.length) * 100);

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group border-4 border-indigo-500/30">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 p-20 bg-primary/10 rounded-full blur-[60px] animate-pulse"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                            <BoltIcon className="h-6 w-6 text-yellow-400"/> Daily Quests
                        </h3>
                        <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest mt-1">Complete tasks to win rewards</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-orange-400 font-black text-xl">
                            <FireIcon className="h-6 w-6 animate-bounce"/> {streak}
                        </div>
                        <span className="text-[9px] uppercase tracking-widest opacity-60">Day Streak</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-3 rounded-full mb-6 overflow-hidden border border-white/10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="space-y-3">
                    {quests.map((quest) => (
                        <div 
                            key={quest.id} 
                            onClick={() => !quest.completed && handleComplete(quest.id, quest.xp)}
                            className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                                quest.completed 
                                    ? 'bg-green-500/20 border-green-500/50 opacity-60' 
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{quest.icon}</span>
                                <span className={`text-sm font-bold ${quest.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                                    {quest.task}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-yellow-400">+{quest.xp} XP</span>
                                {quest.completed ? (
                                    <CheckCircleIcon className="h-5 w-5 text-green-400"/>
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-white/30"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {progress === 100 && (
                    <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-center animate-pop-in">
                        <p className="text-xs font-black text-yellow-300 uppercase tracking-widest flex items-center justify-center gap-2">
                            <StarIcon className="h-4 w-4"/> All Goals Completed!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyQuestWidget;
