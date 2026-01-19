
import React, { useState } from 'react';
import { BookOpenIcon, UserCircleIcon, SparklesIcon, PaperAirplaneIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { generateText } from '../services/geminiService';
import Loader from './Loader';
import { User } from '../types';

interface DiaryEntry {
    id: string;
    studentName: string;
    date: string;
    note: string;
    type: 'Homework' | 'Complaint' | 'Appreciation';
    status: 'Sent' | 'Read';
}

const mockEntries: DiaryEntry[] = [
    { id: '1', studentName: 'Aarav Sharma', date: '2024-08-20', note: 'Math notebook not brought to class today.', type: 'Complaint', status: 'Read' },
    { id: '2', studentName: 'Priya Patel', date: '2024-08-19', note: 'Excellent performance in the debate competition.', type: 'Appreciation', status: 'Sent' }
];

const SmartDigitalDiary: React.FC<{ user: User }> = ({ user }) => {
    const toast = useToast();
    const [entries, setEntries] = useState<DiaryEntry[]>(mockEntries);
    const [note, setNote] = useState('');
    const [studentName, setStudentName] = useState('');
    const [type, setType] = useState<'Homework' | 'Complaint' | 'Appreciation'>('Homework');
    
    const [isPolishing, setIsPolishing] = useState(false);

    const handleAiPolish = async () => {
        if (!note.trim()) {
            toast.error("Please write a rough note first.");
            return;
        }
        setIsPolishing(true);
        try {
            const prompt = `
                Act as a professional school counselor. Rewrite the following teacher's note to a parent to be professional, constructive, and polite.
                
                Original Note: "${note}"
                Context: The note is a ${type}.
                Language: Hinglish (Hindi + English mix) for Indian parents.
                
                Return ONLY the rewritten text.
            `;
            const polished = await generateText(prompt, 'gemini-3-flash-preview');
            setNote(polished);
            toast.success("AI has polished your note!");
        } catch (e) {
            toast.error("AI could not polish the note.");
        } finally {
            setIsPolishing(false);
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentName || !note) {
            toast.error("Please enter details.");
            return;
        }
        const newEntry: DiaryEntry = {
            id: Date.now().toString(),
            studentName,
            date: new Date().toISOString().split('T')[0],
            note,
            type,
            status: 'Sent'
        };
        setEntries([newEntry, ...entries]);
        toast.success("Note sent to parent's app!");
        setNote('');
        setStudentName('');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <BookOpenIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Smart Digital Diary</h2>
                    <p className="text-sm text-neutral-500 font-hindi">अभिभावक संचार (Digital Communication)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
                {/* Compose Section */}
                <div className="flex flex-col h-full bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Write a Note</h3>
                    
                    <form onSubmit={handleSend} className="space-y-4 flex-1 flex flex-col">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Student Name</label>
                            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full mt-1 p-2 border rounded-md" placeholder="e.g. Rohan" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Type</label>
                            <div className="flex gap-2 mt-1">
                                {['Homework', 'Complaint', 'Appreciation'].map(t => (
                                    <button 
                                        type="button" 
                                        key={t}
                                        onClick={() => setType(t as any)}
                                        className={`px-3 py-1 text-xs font-bold rounded-full border ${type === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Message (Raw)</label>
                            <textarea 
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                                placeholder="e.g. Rohan is talking too much in class..."
                            ></textarea>
                            <div className="flex justify-end mt-2">
                                <button 
                                    type="button" 
                                    onClick={handleAiPolish} 
                                    disabled={isPolishing || !note}
                                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                >
                                    <SparklesIcon className="h-4 w-4"/> {isPolishing ? 'Polishing...' : 'AI Polish (Make Polite)'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                            <PaperAirplaneIcon className="h-5 w-5"/> Send Note
                        </button>
                    </form>
                </div>

                {/* History Section */}
                <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b bg-slate-50">
                        <h3 className="font-bold text-slate-800">Sent History</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {entries.map(entry => (
                            <div key={entry.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                            <UserCircleIcon className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{entry.studentName}</p>
                                            <p className="text-[10px] text-slate-500">{entry.date}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                                        entry.type === 'Complaint' ? 'bg-red-100 text-red-700' : 
                                        entry.type === 'Appreciation' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>{entry.type}</span>
                                </div>
                                <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">"{entry.note}"</p>
                                <div className="mt-2 text-right">
                                    <span className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                                        <CheckCircleIcon className="h-3 w-3"/> {entry.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartDigitalDiary;
