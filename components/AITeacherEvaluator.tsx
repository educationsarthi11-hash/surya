
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { ChartBarIcon, SparklesIcon, UserCircleIcon, CheckCircleIcon, TrophyIcon } from './icons/AllIcons';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';

const teachers = [
    { id: '1', name: 'Mr. David Chen', subject: 'Science' },
    { id: '2', name: 'Mrs. Sharma', subject: 'Maths' },
    { id: '3', name: 'Mr. Khan', subject: 'History' },
];

interface EvaluationResult {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    trainingSuggestion: string;
}

const AITeacherEvaluator: React.FC = () => {
    const toast = useToast();
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [passPercentage, setPassPercentage] = useState('');
    const [studentFeedback, setStudentFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<EvaluationResult | null>(null);

    const handleEvaluate = async () => {
        if (!selectedTeacher || !passPercentage) {
            toast.error("Please select a teacher and enter results.");
            return;
        }
        setLoading(true);
        setResult(null);

        try {
            const prompt = `
                Act as a School Principal and HR Expert. Evaluate the following teacher:
                Name: ${selectedTeacher}
                Subject: (Inferred from context)
                Class Pass Percentage: ${passPercentage}%
                Student Feedback Summary: "${studentFeedback || 'No specific feedback provided'}"

                Generate a JSON evaluation:
                {
                    "score": Number (1-100),
                    "summary": "2 line executive summary in Hindi/English mix.",
                    "strengths": ["Point 1", "Point 2"],
                    "weaknesses": ["Point 1", "Point 2"],
                    "trainingSuggestion": "Suggest a specific workshop or training topic."
                }
            `;
            const text = await generateText(prompt, 'gemini-2.5-flash');
            const json = JSON.parse(text.replace(/```json|```/g, '').trim());
            setResult(json);
            toast.success("Evaluation Complete");
        } catch (e) {
            toast.error("Evaluation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <TrophyIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">AI Teacher Evaluator</h2>
                    <p className="text-sm text-neutral-500 font-hindi">शिक्षक प्रदर्शन और प्रशिक्षण (Performance Review)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Input Form */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Select Teacher</label>
                                <select 
                                    value={selectedTeacher} 
                                    onChange={e => setSelectedTeacher(e.target.value)} 
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">-- Select --</option>
                                    {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Class Result (Pass %)</label>
                                <input 
                                    type="number" 
                                    value={passPercentage} 
                                    onChange={e => setPassPercentage(e.target.value)} 
                                    className="w-full p-2 border rounded-md"
                                    placeholder="e.g. 85"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Student/Parent Feedback Notes</label>
                                <textarea 
                                    value={studentFeedback}
                                    onChange={e => setStudentFeedback(e.target.value)}
                                    rows={4}
                                    className="w-full p-2 border rounded-md text-sm"
                                    placeholder="e.g. Students find the class engaging but syllabus is slow."
                                />
                            </div>

                            <button 
                                onClick={handleEvaluate} 
                                disabled={loading}
                                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader message="Analyzing Data..." /> : <><SparklesIcon className="h-5 w-5"/> Generate Performance Report</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result Display */}
                <div className="flex flex-col h-full">
                    {result ? (
                        <div className="animate-pop-in bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full overflow-y-auto">
                            <div className="flex items-center justify-between mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{selectedTeacher}</h3>
                                    <p className="text-xs text-slate-500 uppercase font-bold">Performance Scorecard</p>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-md ${result.score > 80 ? 'bg-green-500' : result.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                    {result.score}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-slate-700 text-sm mb-2">Executive Summary</h4>
                                    <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border">{result.summary}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                        <h4 className="font-bold text-green-800 text-xs uppercase mb-2 flex items-center gap-1"><CheckCircleIcon className="h-3 w-3"/> Strengths</h4>
                                        <ul className="list-disc list-inside text-xs text-green-900 space-y-1">
                                            {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                        <h4 className="font-bold text-red-800 text-xs uppercase mb-2 flex items-center gap-1"><ChartBarIcon className="h-3 w-3"/> Areas to Improve</h4>
                                        <ul className="list-disc list-inside text-xs text-red-900 space-y-1">
                                            {result.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-bold text-blue-900 text-sm mb-1">Recommended Training</h4>
                                    <p className="text-sm text-blue-800 font-medium">{result.trainingSuggestion}</p>
                                    <button className="mt-3 text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">Assign Training Module</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-xl">
                            <UserCircleIcon className="h-16 w-16 mb-4 opacity-20"/>
                            <p>Select a teacher to view AI evaluation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AITeacherEvaluator;
