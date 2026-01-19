
import React, { useState } from 'react';
import { analyzeGrievance } from '../services/geminiService';
import { ScaleIcon, ExclamationTriangleIcon, CheckCircleIcon, SparklesIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const GrievancePortal: React.FC = () => {
    const toast = useToast();
    const [complaint, setComplaint] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<{ sentiment: string, summary: string, category: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!complaint.trim()) return;

        setLoading(true);
        try {
            const result = await analyzeGrievance(complaint);
            setAnalysis(result);
            toast.success("Grievance registered securely.");
        } catch (e) {
            toast.error("Error submitting grievance.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[500px]">
            <div className="flex items-center mb-6">
                <ScaleIcon className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Grievance Redressal (Samadhan)</h2>
                    <p className="text-sm text-neutral-500 font-hindi">शिकायत और निवारण पोर्टल</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-800 flex gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 shrink-0"/>
                        <p>This portal is secure. Your identity is protected if you choose 'Anonymous'.</p>
                    </div>
                    
                    <textarea 
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                        rows={6}
                        placeholder="Describe your grievance here..."
                        className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500"
                    />

                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="anon" 
                            checked={isAnonymous} 
                            onChange={e => setIsAnonymous(e.target.checked)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="anon" className="text-sm font-medium text-slate-700">Stay Anonymous (नाम गुप्त रखें)</label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !complaint}
                        className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? <Loader message="Analyzing..." /> : "Submit Grievance"}
                    </button>
                </form>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Admin View (AI Analysis)</h3>
                    {analysis ? (
                        <div className="space-y-4 animate-pop-in">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Urgency:</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${analysis.sentiment === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {analysis.sentiment}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Category:</span>
                                <span className="px-2 py-1 rounded text-xs font-bold bg-slate-200 text-slate-700">
                                    {analysis.category}
                                </span>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                                <p className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><SparklesIcon className="h-3 w-3"/> AI Summary</p>
                                <p className="text-sm text-slate-700">{analysis.summary}</p>
                            </div>
                            <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                                <CheckCircleIcon className="h-5 w-5"/> Forwarded to Discipline Committee
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-center py-10">Submit a grievance to see AI classification.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GrievancePortal;
