
import React, { useState, useEffect } from 'react';
import { LocationType } from '../types';
import { BuildingOfficeIcon, AcademicCapIcon, GlobeAltIcon, BookOpenIcon, CheckCircleIcon, ArrowPathIcon, SparklesIcon } from './icons/AllIcons';
import { useClassroom } from '../contexts/ClassroomContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useToast } from '../hooks/useToast';
import { stateBoardMapping, courseCatalog, standardBookSets } from '../config/classroomData';
import { INDIAN_STATES } from '../config/institutions';

const ClassroomManager: React.FC = () => {
    const { institutionType, setClasses, setSelectedClass } = useClassroom();
    const { selectedState, setConfig } = useAppConfig();
    const toast = useToast();

    // राज्य के आधार पर उपलब्ध बोर्ड प्राप्त करें
    const availableBoards = stateBoardMapping[selectedState] || ["CBSE", "NIOS"];
    const [currentBoard, setCurrentBoard] = useState(availableBoards[0]);
    const [autoBooks, setAutoBooks] = useState<string[]>([]);

    useEffect(() => {
        // जब राज्य बदले, तो बोर्ड को रीसेट करें
        if (!availableBoards.includes(currentBoard)) {
            setCurrentBoard(availableBoards[0]);
        }
    }, [selectedState, availableBoards, currentBoard]);

    const handleQuickSetup = () => {
        const defaultCourses = courseCatalog[institutionType] || [];
        setClasses(defaultCourses);
        if (defaultCourses.length > 0) setSelectedClass(defaultCourses[0]);

        const bookKey = `${institutionType}-${currentBoard}-Class-10`;
        setAutoBooks(standardBookSets[bookKey] || ["Standard Resource Set for " + currentBoard]);

        // Save global config for board
        setConfig({ selectedBoard: currentBoard });

        toast.success(`${selectedState} और ${currentBoard} के अनुसार स्मार्ट क्लास सेटअप पूरा हुआ!`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-soft min-h-[500px]">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <SparklesIcon className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Academic Infrastructure Manager</h2>
                    <p className="text-sm text-slate-500 font-hindi">अपने राज्य और बोर्ड के सिलेबस को कॉन्फ़िगर करें</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Step 1: Regional Setup */}
                <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <GlobeAltIcon className="h-5 w-5 text-blue-500"/> Regional Context
                    </h3>
                    
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select State (राज्य)</label>
                        <select 
                            value={selectedState} 
                            onChange={(e) => setConfig({ selectedState: e.target.value })}
                            className="w-full p-3 bg-white border-2 border-slate-100 rounded-xl font-bold shadow-sm focus:border-primary outline-none"
                        >
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Education Board (बोर्ड)</label>
                        <select 
                            value={currentBoard} 
                            onChange={(e) => setCurrentBoard(e.target.value)}
                            className="w-full p-3 bg-white border-2 border-slate-100 rounded-xl font-bold shadow-sm focus:border-primary outline-none"
                        >
                            {availableBoards.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>

                {/* Step 2: Course Mapping */}
                <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <AcademicCapIcon className="h-5 w-5 text-orange-500"/> Mapping Standards
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-hindi">
                        आपके <b>{institutionType}</b> के लिए {currentBoard} के नवीनतम मानक (Standards) यहाँ उपलब्ध हैं।
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {courseCatalog[institutionType]?.map(course => (
                            <div key={course} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 text-sm font-bold text-slate-700 shadow-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div> {course}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={handleQuickSetup}
                        className="w-full py-4 bg-slate-950 text-white font-black rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowPathIcon className="h-4 w-4"/> AUTO-CONFIGURE
                    </button>
                </div>

                {/* Step 3: Localized Content */}
                <div className="space-y-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                        <BookOpenIcon className="h-5 w-5 text-indigo-600"/> Local Content Info
                    </h3>
                    <div className="p-5 bg-white rounded-2xl shadow-inner min-h-[220px]">
                        {autoBooks.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Board Approved Books</p>
                                {autoBooks.map(book => (
                                    <div key={book} className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg">
                                        <CheckCircleIcon className="h-4 w-4 text-green-500"/> {book}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                                <BookOpenIcon className="h-10 w-10 mb-2 opacity-10"/>
                                <p className="text-xs font-bold uppercase tracking-widest">No mapping found</p>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">AI automatically trains on {currentBoard} patterns.</p>
                </div>
            </div>
        </div>
    );
};

export default ClassroomManager;
