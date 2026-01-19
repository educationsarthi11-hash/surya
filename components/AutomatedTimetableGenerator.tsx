
import React, { useState } from 'react';
import { Timetable, TimetableConstraints } from '../types';
import { useToast } from '../hooks/useToast';
import { generateTimetable } from '../services/geminiService';
import Loader from './Loader';
import { CalendarDaysIcon, SparklesIcon, PlusIcon, XCircleIcon } from './icons/AllIcons';

const AutomatedTimetableGenerator: React.FC = () => {
    const toast = useToast();
    const [constraints, setConstraints] = useState<TimetableConstraints>({
        classNames: ['Class 9A', 'Class 10A'],
        subjects: ['Math', 'Science', 'English', 'History'],
        teachers: ['Mr. Sharma', 'Ms. Gupta', 'Mr. Singh', 'Mrs. Devi'],
        periodsPerDay: 8,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        additionalRules: 'Physical Education should be the last period. No back-to-back Math periods.',
    });
    const [generatedTimetables, setGeneratedTimetables] = useState<Timetable[]>([]);
    const [loading, setLoading] = useState(false);

    const handleArrayChange = (field: 'classNames' | 'subjects' | 'teachers', index: number, value: string) => {
        const updatedArray = [...constraints[field]];
        updatedArray[index] = value;
        setConstraints(prev => ({ ...prev, [field]: updatedArray }));
    };

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedTimetables([]);
        try {
            const timetables = await generateTimetable(constraints);
            setGeneratedTimetables(timetables);
            toast.success("Timetable generated successfully!");
        } catch (error) {
            toast.error("AI failed to generate timetable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col">
            <div className="flex items-center mb-4 shrink-0">
                <CalendarDaysIcon className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Automated Timetable Generator</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
                <div className="lg:col-span-1 p-4 border rounded-lg bg-neutral-50 space-y-4 overflow-y-auto custom-scrollbar">
                    <h3 className="text-lg font-bold text-neutral-800">Schedules & Constraints</h3>
                    {['classNames', 'subjects', 'teachers'].map(field => (
                        <div key={field}>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{field.replace('Names', '')}</label>
                            <div className="space-y-2">
                                {(constraints[field as keyof TimetableConstraints] as string[]).map((item, idx) => (
                                    <input key={idx} type="text" value={item} onChange={e => handleArrayChange(field as any, idx, e.target.value)} className="w-full p-2 border rounded-md text-sm" />
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={handleGenerate} disabled={loading} className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg">
                        {loading ? <Loader message="..." /> : "Generate with AI"}
                    </button>
                </div>

                <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar">
                    {generatedTimetables.length > 0 ? (
                        <div className="space-y-8">
                            {generatedTimetables.map(table => (
                                <div key={table.className}>
                                    <h3 className="text-xl font-bold mb-3">{table.className}</h3>
                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="min-w-full divide-y divide-neutral-200 text-xs">
                                            <thead className="bg-neutral-50">
                                                <tr>
                                                    <th className="px-2 py-2 text-left font-bold text-slate-500 uppercase">Period</th>
                                                    {table.timetable.map(day => <th key={day.day} className="px-2 py-2 text-left font-bold text-slate-500 uppercase">{day.day}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-neutral-200">
                                                {Array.from({ length: constraints.periodsPerDay }, (_, i) => i + 1).map(periodNum => (
                                                    <tr key={periodNum}>
                                                        <td className="px-2 py-2 font-bold bg-neutral-50">{periodNum}</td>
                                                        {table.timetable.map(day => {
                                                            const slot = day.schedule.find(s => s.period === periodNum);
                                                            return <td key={day.day} className="px-2 py-2 whitespace-nowrap">{slot ? `${slot.subject} (${slot.teacher})` : '---'}</td>;
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                             <CalendarDaysIcon className="h-16 w-16 mb-4 opacity-20"/>
                             <p>Fill constraints and generate timetable.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AutomatedTimetableGenerator;
