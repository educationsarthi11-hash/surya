
import React, { useState } from 'react';
import { generateSubstitutionPlan } from '../services/geminiService';
import { UserGroupIcon, SparklesIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const mockTeachers = [
    { name: 'Mr. Verma', subject: 'Math', workload: 3 },
    { name: 'Ms. Gupta', subject: 'Science', workload: 2 },
    { name: 'Mrs. Singh', subject: 'English', workload: 5 },
    { name: 'Mr. Khan', subject: 'Physics', workload: 1 },
    { name: 'Ms. Sharma', subject: 'Sports', workload: 0 },
];

const SmartProxyManager: React.FC = () => {
    const toast = useToast();
    const [absentTeacher, setAbsentTeacher] = useState('');
    const [period, setPeriod] = useState('1st Period');
    const [suggestion, setSuggestion] = useState<{ bestMatch: string; reason: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetSuggestion = async () => {
        if (!absentTeacher) {
            toast.error("Please select an absent teacher.");
            return;
        }
        setLoading(true);
        try {
            const subject = mockTeachers.find(t => t.name === absentTeacher)?.subject || 'General';
            const result = await generateSubstitutionPlan(absentTeacher, subject, period, mockTeachers.filter(t => t.name !== absentTeacher));
            setSuggestion(result);
        } catch (e) {
            toast.error("AI could not generate plan.");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = () => {
        toast.success(`Proxy assigned to ${suggestion?.bestMatch}. Notification sent.`);
        setSuggestion(null);
        setAbsentTeacher('');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[500px]">
            <div className="flex items-center mb-6">
                <UserGroupIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Smart Proxy Manager</h2>
                    <p className="text-sm text-neutral-500 font-hindi">शिक्षक अनुपस्थिति प्रबंधन (Substitution)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border rounded-xl">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Who is absent today?</label>
                        <select 
                            value={absentTeacher} 
                            onChange={(e) => setAbsentTeacher(e.target.value)} 
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">-- Select Teacher --</option>
                            {mockTeachers.map(t => <option key={t.name} value={t.name}>{t.name} ({t.subject})</option>)}
                        </select>
                    </div>
                    
                    <div className="p-4 bg-slate-50 border rounded-xl">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Which Period?</label>
                        <select 
                            value={period} 
                            onChange={(e) => setPeriod(e.target.value)} 
                            className="w-full p-2 border rounded-md"
                        >
                            {['1st Period', '2nd Period', '3rd Period', '4th Period'].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <button 
                        onClick={handleGetSuggestion} 
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader message="..." /> : <><SparklesIcon className="h-5 w-5"/> AI Suggest Substitute</>}
                    </button>
                </div>

                <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    {suggestion ? (
                        <div className="animate-pop-in space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <CheckCircleIcon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Best Match: {suggestion.bestMatch}</h3>
                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border">{suggestion.reason}</p>
                            <button 
                                onClick={handleAssign}
                                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                            >
                                Confirm & Notify
                            </button>
                        </div>
                    ) : (
                        <p className="text-slate-400">Select a teacher to see AI recommendation.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartProxyManager;
