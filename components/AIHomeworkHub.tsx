
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ClipboardIcon, SparklesIcon, PlusIcon, ArrowRightIcon, CheckCircleIcon, BookOpenIcon, ArrowLeftIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { generateText } from '../services/geminiService';
import Loader from './Loader';
import { allLevels } from '../config/classroomData';

const AIHomeworkHub: React.FC<{ user: User }> = ({ user }) => {
    const toast = useToast();
    const [view, setView] = useState<'list' | 'assign' | 'check'>('list');
    const [loading, setLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    const [selectedClass, setSelectedClass] = useState('Class 10');
    const [selectedSubject, setSelectedSubject] = useState('Science');
    const [homeworkContent, setHomeworkContent] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const handleStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', handleStatus);
        window.addEventListener('offline', handleStatus);
        return () => {
            window.removeEventListener('online', handleStatus);
            window.removeEventListener('offline', handleStatus);
        };
    }, []);

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        // ऑफ़लाइन होने पर भी डेटा लोकल स्टोरेज में सेव हो जाएगा
        const pendingHomework = JSON.parse(localStorage.getItem('pending_homework') || '[]');
        pendingHomework.push({ class: selectedClass, subject: selectedSubject, date: new Date().toISOString() });
        localStorage.setItem('pending_homework', JSON.stringify(pendingHomework));
        
        toast.success(isOnline ? "होमवर्क पब्लिश हो गया!" : "होमवर्क ऑफलाइन सेव हो गया है, इंटरनेट आने पर सिंक होगा।");
        setView('list');
    };

    const handleCheck = async () => {
        if(!isOnline) {
            toast.error("AI चेकिंग के लिए इंटरनेट जरूरी है। कृपया ऑनलाइन आएं।");
            return;
        }
        if(!homeworkContent) return;
        setLoading(true);
        try {
            const prompt = `Act as an expert teacher for ${selectedClass}. Subject: ${selectedSubject}. Review: "${homeworkContent}". Give Hindi feedback.`;
            const result = await generateText(prompt);
            setFeedback(result);
        } catch (e) {
            toast.error("AI सेवा व्यस्त है।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-pop-in p-2">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-2xl text-orange-600"><ClipboardIcon className="h-7 w-7"/></div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">AI होमवर्क हब</h3>
                        <p className="text-xs text-slate-400 font-hindi">{!isOnline ? "ऑफ़लाइन मोड सक्रिय" : "ऑनलाइन और स्मार्ट मोड"}</p>
                    </div>
                </div>
                {user.role === UserRole.Teacher && view === 'list' && (
                    <button onClick={() => setView('assign')} className="px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                        <PlusIcon className="h-5 w-5"/> नया होमवर्क दें
                    </button>
                )}
            </div>

            {view === 'assign' && (
                <div className="max-w-3xl mx-auto space-y-6">
                    <button onClick={() => setView('list')} className="text-slate-400 font-bold hover:text-primary flex items-center gap-2">
                        <ArrowLeftIcon className="h-5 w-5 rotate-180"/> वापस
                    </button>
                    <form onSubmit={handleAssign} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
                        <div className="text-center"><h4 className="text-2xl font-black uppercase">Assign Task</h4></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:border-primary outline-none">
                                {allLevels.map(l => <option key={l} value={l}>{l}</option>)}
                             </select>
                             <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold focus:border-primary outline-none">
                                <option>Science</option><option>Maths</option><option>English</option>
                             </select>
                        </div>
                        <textarea rows={5} placeholder="होमवर्क निर्देश लिखें..." className="w-full p-6 rounded-3xl border-2 border-slate-50 font-hindi font-bold bg-slate-50 focus:border-primary outline-none" required></textarea>
                        <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                            <PlusIcon className="h-6 w-6"/> {isOnline ? "पब्लिश करें" : "ऑफ़लाइन सेव करें"}
                        </button>
                    </form>
                </div>
            )}

            {view === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                         <div className="flex items-center gap-5">
                             <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform"><BookOpenIcon className="h-8 w-8"/></div>
                             <div>
                                 <p className="font-black text-slate-900 uppercase">Mathematics: Algebra</p>
                                 <p className="text-xs text-slate-400 font-bold">Grade 10 • Submitted: 5 Students</p>
                             </div>
                         </div>
                         <button onClick={() => setView('check')} className="p-3 bg-slate-50 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Check Now ➡</button>
                    </div>
                </div>
            )}

            {view === 'check' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    <button onClick={() => setView('list')} className="text-slate-400 font-bold hover:text-primary flex items-center gap-2">
                        <ArrowLeftIcon className="h-5 w-5 rotate-180"/> वापस
                    </button>
                    <div className="bg-white p-10 rounded-[3.5rem] border-4 border-slate-50 shadow-2xl">
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 mb-8 shadow-inner">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Student's Work</p>
                            <div className="font-hindi font-medium text-slate-700 leading-relaxed text-lg">
                                "प्रकाश का अपवर्तन तब होता है जब रोशनी एक पारदर्शी माध्यम से दूसरे में जाती है..."
                            </div>
                        </div>

                        {!isOnline ? (
                             <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-center">
                                <SparklesIcon className="h-10 w-10 text-red-400 mx-auto mb-2" />
                                <p className="text-red-700 font-hindi font-bold">AI चेकिंग के लिए इंटरनेट की जरूरत है। आपका डेटा सेव है, इंटरनेट आने पर चेक करें।</p>
                             </div>
                        ) : (
                            <button onClick={handleCheck} disabled={loading} className="w-full py-6 bg-primary text-white font-black rounded-3xl shadow-xl hover:bg-slate-950 transition-all flex items-center justify-center gap-4">
                                {loading ? <Loader message="AI चेकिंग कर रहा है..." /> : <><SparklesIcon className="h-7 w-7 text-yellow-300"/> AI चेकिंग शुरू करें</>}
                            </button>
                        )}
                        
                        {feedback && (
                            <div className="mt-10 p-8 bg-green-50 border-2 border-green-100 rounded-[3rem] animate-pop-in">
                                <h5 className="font-black text-green-800 mb-4 uppercase tracking-widest text-sm">AI Feedback:</h5>
                                <div className="text-green-700 font-hindi text-xl leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: feedback }} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIHomeworkHub;
