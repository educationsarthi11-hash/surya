
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { generateTest, fileToBase64 } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import Loader from './Loader';
import { PencilSquareIcon, PrinterIcon, SparklesIcon, ArrowLeftIcon, MicrophoneIcon, CameraIcon, XCircleIcon, PhotoIcon, UploadIcon, ChartBarIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useClassroom } from '../contexts/ClassroomContext';
import { useSpeech } from '../hooks/useSpeech';
import { getBoardsForType } from '../config/classroomData';
import { LocationType } from '../types';

const TestGuru: React.FC = () => {
    const toast = useToast();
    const { institutionName, selectedBoard, selectedState, institutionType } = useAppConfig();
    const { selectedClass } = useClassroom();
    const [loading, setLoading] = useState(false);
    const [generatedPaper, setGeneratedPaper] = useState('');
    const [viewMode, setViewMode] = useState<'config' | 'preview'>('config');

    // Get dynamic list of boards/universities based on login type
    const availableBoards = useMemo(() => {
        return getBoardsForType(institutionType, selectedState);
    }, [institutionType, selectedState]);

    // Form State
    const [currentBoard, setCurrentBoard] = useState(selectedBoard || availableBoards[0]);
    const [subject, setSubject] = useState('Science');
    const [bookName, setBookName] = useState(''); 
    const [chapter, setChapter] = useState('');
    const [numQuestions, setNumQuestions] = useState(10);
    const [language, setLanguage] = useState('Hindi');
    const [difficulty, setDifficulty] = useState('Medium'); // New Difficulty State
    
    // File Upload State
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Voice
    const { isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ enableSpeechRecognition: true });
    const [activeField, setActiveField] = useState<'subject' | 'book' | 'chapter' | null>(null);

    useEffect(() => {
        // Sync local state if global config changes or initial load
        if (selectedBoard && availableBoards.includes(selectedBoard)) {
            setCurrentBoard(selectedBoard);
        } else if (availableBoards.length > 0) {
            setCurrentBoard(availableBoards[0]);
        }
    }, [selectedBoard, availableBoards]);

    useEffect(() => {
        if (speechInput && !isListening) {
            if (activeField === 'subject') setSubject(speechInput);
            if (activeField === 'book') setBookName(speechInput);
            if (activeField === 'chapter') setChapter(speechInput);
            setSpeechInput('');
            setActiveField(null);
        }
    }, [speechInput, isListening, activeField]);

    const handleMicClick = (field: 'subject' | 'book' | 'chapter') => {
        if (isListening && activeField === field) {
            toggleListening();
            setActiveField(null);
        } else {
            setActiveField(field);
            setSpeechInput(''); 
            if (!isListening) toggleListening();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSourceFile(file);
            setFilePreview(URL.createObjectURL(file));
            toast.success("File uploaded! Click 'Generate' to create test.");
        }
    };

    const handleGenerate = async () => {
        if (!sourceFile && (!subject || !chapter)) {
            toast.error("Please provide Subject/Chapter OR Upload a File.");
            return;
        }
        setLoading(true);
        try {
            let paperHtml = "";

            if (sourceFile) {
                // Generate from Image
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const base64Data = await fileToBase64(sourceFile);
                
                const prompt = `
                    Act as an expert examiner. Analyze this image (book page/syllabus). 
                    Create a printable test paper for **${institutionName}**.
                    Type/Board: ${currentBoard} (Context: ${institutionType}).
                    Class/Course: ${selectedClass}.
                    Language: ${language}.
                    Difficulty Level: ${difficulty}.
                    Total Questions: ${numQuestions}.
                    Format: Professional HTML with the Institution Name centered at top with a border, subject, class, time duration, and marks. Use <div class="question-block"> for each question.
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [
                        { text: prompt },
                        { inlineData: { data: base64Data, mimeType: sourceFile.type } }
                    ]
                });
                paperHtml = response.text || "";
            } else {
                // Generate from Text inputs
                const finalSubject = bookName ? `${subject} (Book: ${bookName})` : subject;
                
                // Enhanced Prompt with Board Specifics
                const prompt = `
                    Generate a professional, printable test paper in HTML.
                    
                    Institution Name: ${institutionName}
                    Exam Body / Board: ${currentBoard}
                    Subject: ${finalSubject}
                    Class / Course: ${selectedClass}
                    Chapter/Topic: ${chapter}
                    Language: ${language}
                    Difficulty Level: ${difficulty}
                    Questions: ${numQuestions}
                    Total Marks: ${numQuestions * 2}
                    Duration: 45 Mins
                    
                    Instructions:
                    1. Create questions appropriate for ${difficulty} level difficulty.
                    2. Use the exact language requested (${language}).
                    
                    Structure (HTML):
                    1. Header: Centered Institution Name (H1), Exam Name, Student Name/Roll No blanks.
                    2. Instructions: Specific to ${currentBoard} pattern.
                    3. Sections: Section A (Short), Section B (Long) if applicable.
                    4. Content: Generate high-quality questions.
                    
                    Return ONLY the HTML code (no markdown code blocks).
                `;

                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview',
                    contents: prompt,
                });
                paperHtml = response.text || "";
            }

            setGeneratedPaper(paperHtml);
            setViewMode('preview');
            toast.success(`Paper generated for ${currentBoard} (${difficulty})!`);
        } catch (e) {
            console.error(e);
            toast.error("Failed to generate paper.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const labelForBoard = institutionType === LocationType.University ? "University / Exam" : 
                          institutionType === LocationType.CoachingCenter ? "Competitive Exam" : "Education Board";

    return (
        <div className="flex flex-col h-full bg-slate-100 rounded-xl overflow-hidden">
             <style>
                {`
                    @media print {
                        @page { size: a4 portrait; margin: 10mm; }
                        .no-print { display: none !important; }
                        body { background: white !important; -webkit-print-color-adjust: exact; }
                        .preview-scroll-area { overflow: visible !important; height: auto !important; padding: 0 !important; background: white !important; }
                        .printable-page { 
                            margin: 0 !important; 
                            border: 2px solid #000 !important; /* Solid Boundary for Print */
                            box-shadow: none !important; 
                            width: 100% !important; 
                            min-height: 95vh !important; 
                            padding: 10mm !important;
                        }
                    }
                    .preview-scroll-area { background-color: #525659; padding: 40px 20px; overflow-y: auto; height: 100%; }
                    .printable-page { 
                        background: white; 
                        margin: 0 auto 20px; 
                        padding: 20mm; 
                        width: 210mm; 
                        min-height: 297mm; 
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
                        position: relative; 
                        box-sizing: border-box;
                        border: 1px solid #e2e8f0; /* Soft border for screen */
                    }
                    /* On Screen Border Visual */
                    .page-border { 
                        position: absolute; 
                        top: 10mm; 
                        left: 10mm; 
                        right: 10mm; 
                        bottom: 10mm; 
                        border: 2px solid #334155; 
                        pointer-events: none; 
                        display: block;
                    }
                    .question-block { page-break-inside: avoid; margin-bottom: 25px; display: block; }
                `}
            </style>

            <div className="p-4 bg-white border-b flex justify-between items-center no-print shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <PencilSquareIcon className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold text-slate-800">Test Guru ({institutionType})</h2>
                </div>
                <div className="flex gap-3">
                    {viewMode === 'preview' ? (
                        <>
                            <button onClick={handlePrint} className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:bg-primary-dark transition-all">
                                <PrinterIcon className="h-5 w-5"/> Print / Save PDF
                            </button>
                            <button onClick={() => setViewMode('config')} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold">
                                <ArrowLeftIcon className="h-4 w-4 mr-1 inline"/> Back
                            </button>
                        </>
                    ) : (
                        <p className="text-sm font-bold text-slate-400 font-hindi uppercase">पेपर सेटअप करें</p>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {viewMode === 'config' ? (
                    <div className="max-w-2xl mx-auto p-6 sm:p-10 space-y-6 overflow-y-auto h-full custom-scrollbar">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <SparklesIcon className="h-6 w-6 text-primary"/> पेपर का विवरण (Paper Details)
                            </h3>
                            
                            {/* Upload Section */}
                            <div className="mb-8 p-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl text-center">
                                {filePreview ? (
                                    <div className="relative w-fit mx-auto">
                                        <img src={filePreview} alt="Preview" className="h-32 w-auto rounded-lg shadow-md" />
                                        <button onClick={() => { setSourceFile(null); setFilePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><XCircleIcon className="h-4 w-4"/></button>
                                        <p className="text-xs font-bold text-blue-600 mt-2">Image Selected</p>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer group flex flex-col items-center">
                                        <div className="flex gap-4 mb-2">
                                            <CameraIcon className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
                                            <UploadIcon className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <p className="text-sm font-bold text-blue-700 font-hindi">किताब/नोट्स की फोटो अपलोड करें</p>
                                        <p className="text-xs text-blue-400 mt-1">AI इसे पढ़कर {currentBoard} के पैटर्न पर सवाल बनाएगा</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 border rounded-lg text-xs font-bold text-slate-600">
                                    Institute: <span className="text-primary">{institutionName}</span> | Type: <span className="text-primary">{institutionType}</span>
                                </div>
                                
                                {/* Dynamic Board Selector */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{labelForBoard}</label>
                                    <select 
                                        value={currentBoard} 
                                        onChange={e => setCurrentBoard(e.target.value)} 
                                        className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-slate-700"
                                    >
                                        {availableBoards.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Subject (विषय)</label>
                                        <div className="relative">
                                            <input disabled={!!sourceFile} type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Physics..." className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50" />
                                            {!sourceFile && <button onClick={() => handleMicClick('subject')} className={`absolute right-3 top-3 ${isListening && activeField === 'subject' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}><MicrophoneIcon className="h-5 w-5"/></button>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Language (भाषा)</label>
                                        <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50">
                                            <option>Hindi</option>
                                            <option>English</option>
                                            <option>Hinglish</option>
                                            <option>Punjabi</option>
                                            <option>Sanskrit</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Difficulty (कठिनाई)</label>
                                        <div className="relative">
                                            <ChartBarIcon className="absolute right-3 top-3 h-5 w-5 text-slate-400 pointer-events-none"/>
                                            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50 appearance-none font-bold">
                                                <option value="Easy">Easy (आसान)</option>
                                                <option value="Medium">Medium (सामान्य)</option>
                                                <option value="Hard">Hard (कठिन)</option>
                                                <option value="Expert">Expert (विशेषज्ञ)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Questions (संख्या)</label>
                                        <input type="number" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="w-full p-3 border rounded-xl bg-slate-50" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Book Name (किताब)</label>
                                    <div className="relative">
                                        <input disabled={!!sourceFile} type="text" value={bookName} onChange={e => setBookName(e.target.value)} placeholder="NCERT / Reference..." className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50" />
                                        {!sourceFile && <button onClick={() => handleMicClick('book')} className={`absolute right-3 top-3 ${isListening && activeField === 'book' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}><MicrophoneIcon className="h-5 w-5"/></button>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Chapter Name (अध्याय)</label>
                                    <div className="relative">
                                        <input disabled={!!sourceFile} type="text" value={chapter} onChange={e => setChapter(e.target.value)} placeholder="Chapter..." className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50" />
                                        {!sourceFile && <button onClick={() => handleMicClick('chapter')} className={`absolute right-3 top-3 ${isListening && activeField === 'chapter' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}><MicrophoneIcon className="h-5 w-5"/></button>}
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleGenerate} 
                                    disabled={loading} 
                                    className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-primary transition-all transform active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <Loader message={sourceFile ? "फोटो पढ़ रहा हूँ..." : "AI पेपर लिख रहा है..."} /> : "मैजिक पेपर तैयार करें (Generate)"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="preview-scroll-area custom-scrollbar">
                        <div className="printable-page animate-pop-in no-scrollbar" id="print-area">
                            <div className="page-border"></div> 
                            <div className="prose prose-sm max-w-none font-hindi leading-relaxed text-slate-900">
                                <div dangerouslySetInnerHTML={{ __html: generatedPaper }} />
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center no-print">
                                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Powered by {institutionName} AI Sarthi</p>
                            </div>
                        </div>
                        <div className="h-20 no-print"></div> 
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestGuru;
