
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { generateText, sanitizeHtml, fileToBase64 } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import Loader from './Loader';
import { useToast } from '../hooks/useToast';
import { PrinterIcon, SparklesIcon, BookOpenIcon, MicrophoneIcon, CameraIcon, XCircleIcon, UploadIcon, ArrowDownTrayIcon } from './icons/AllIcons';
import { useClassroom } from '../contexts/ClassroomContext';
import { getBoardsForType, subjectBookMapping } from '../config/classroomData';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useSpeech } from '../hooks/useSpeech';

declare const jspdf: any;
declare const html2canvas: any;

const explanationLanguages = ['English', 'Hindi', 'Hinglish', 'Marathi', 'Bengali'];

const BookSelector: React.FC = () => {
    const { institutionType, selectedClass } = useClassroom();
    const { selectedState, selectedBoard } = useAppConfig(); 
    const toast = useToast();

    // Get Boards dynamically
    const availableBoards = useMemo(() => getBoardsForType(institutionType, selectedState), [institutionType, selectedState]);
    
    const [board, setBoard] = useState(selectedBoard || availableBoards[0]);
    const [language, setLanguage] = useState('Hindi');
    
    const [bookName, setBookName] = useState('');
    const [chapterName, setChapterName] = useState('');
    const [topic, setTopic] = useState('');
    
    // Photo Upload State
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [studyMaterial, setStudyMaterial] = useState('');
    const [loading, setLoading] = useState(false);
    const materialContentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    
    // Voice
    const { isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ enableSpeechRecognition: true });
    const [activeField, setActiveField] = useState<'book' | 'chapter' | 'topic' | null>(null);

    // --- AUTO-BOOK DETECTION LOGIC ---
    // When class or subject changes, check if we know the book!
    useEffect(() => {
        // Mock checking "Current Subject" - In a real app, 'subject' comes from context or a dropdown in this component
        // Since this component allows entering any topic, we don't have a fixed subject state from context always.
        // Let's assume the user enters the subject in a hidden or derived way, or we prompt for it.
        // For this demo, let's auto-fill if the user selects a subject from a dropdown we will add below.
    }, [selectedClass]);

    useEffect(() => {
        if (speechInput && !isListening) {
             if (activeField === 'book') setBookName(speechInput);
             if (activeField === 'chapter') setChapterName(speechInput);
             if (activeField === 'topic') setTopic(speechInput);
             setSpeechInput('');
             setActiveField(null);
        }
    }, [speechInput, isListening, activeField]);

    const handleMicClick = (field: 'book' | 'chapter' | 'topic') => {
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
            toast.success("Image selected! AI will explain this page.");
        }
    };

    useEffect(() => {
        if (selectedBoard && availableBoards.includes(selectedBoard)) {
            setBoard(selectedBoard);
        } else if (availableBoards.length > 0) {
            setBoard(availableBoards[0]);
        }
    }, [selectedBoard, availableBoards]);

    // Internal Subject Selection for Book Mapping
    const [selectedSubject, setSelectedSubject] = useState('');
    const availableSubjects = useMemo(() => {
        const classBooks = subjectBookMapping[selectedClass];
        return classBooks ? Object.keys(classBooks) : [];
    }, [selectedClass]);

    useEffect(() => {
        if (selectedSubject && subjectBookMapping[selectedClass]) {
            const mappedBook = subjectBookMapping[selectedClass][selectedSubject];
            if (mappedBook) {
                setBookName(mappedBook);
                toast.info(`Auto-detected Book: ${mappedBook}`);
            }
        }
    }, [selectedSubject, selectedClass]);

    const handleGenerate = async () => {
        if (!sourceFile && (!bookName || !chapterName || !topic)) {
            toast.error('कृपया किताब का विवरण लिखें या फोटो अपलोड करें।');
            return;
        }
        setLoading(true);
        setStudyMaterial('');

        try {
            let resultText = "";
            if (sourceFile) {
                 const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                 const base64Data = await fileToBase64(sourceFile);
                 const prompt = `Act as an expert tutor for ${institutionType}. Analyze this image of a textbook page. Explain the concepts shown in simple ${language}. Format as clean HTML with headings and bullet points.`;
                 
                 const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [
                        { text: prompt },
                        { inlineData: { data: base64Data, mimeType: sourceFile.type } }
                    ]
                 });
                 resultText = response.text || "";
            } else {
                const prompt = `Explain "${topic}" from the book "${bookName}", Chapter "${chapterName}" (${board}) in ${language}. Use professional style with examples. Format as HTML.`;
                resultText = await generateText(prompt, 'gemini-3-pro-preview');
            }
            
            setStudyMaterial(sanitizeHtml(resultText));
        } catch (err) {
            toast.error('Material generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!materialContentRef.current || isDownloading) return;
        
        setIsDownloading(true);
        toast.info("Generating PDF...");
        
        const { jsPDF } = window.jspdf;

        // Use a temporary clone to avoid layout issues during capture
        const element = materialContentRef.current;
        
        window.html2canvas(element, { scale: 2, useCORS: true }).then((canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save(`${topic.replace(/\s+/g, '_')}_Study_Material.pdf`);
            toast.success("PDF Downloaded!");
            setIsDownloading(false);
        }).catch(() => {
            toast.error("Failed to generate PDF.");
            setIsDownloading(false);
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col overflow-hidden border-t-4 border-blue-600">
            <div className="flex items-center mb-4 shrink-0">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
                    <BookOpenIcon className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">AI Study Material</h2>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
                {/* --- Left Form: Input --- */}
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar p-1">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
                        <span className="font-bold text-blue-800 text-sm">Target: {selectedClass}</span>
                        <span className="text-xs text-blue-600 font-bold uppercase tracking-widest">{selectedState}</span>
                    </div>

                    {/* Image Upload Area */}
                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center">
                        {filePreview ? (
                            <div className="relative w-fit mx-auto">
                                <img src={filePreview} alt="Page" className="h-24 rounded shadow-sm" />
                                <button onClick={() => { setSourceFile(null); setFilePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><XCircleIcon className="h-4 w-4"/></button>
                            </div>
                        ) : (
                             <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer flex flex-col items-center gap-2 group">
                                <div className="flex gap-2">
                                     <CameraIcon className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                                     <UploadIcon className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
                                </div>
                                <p className="text-xs font-bold text-slate-500 group-hover:text-blue-600">Upload Book Page (फोटो से पूछें)</p>
                             </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Board / Exam</label>
                            <select value={board} onChange={e => setBoard(e.target.value)} className="w-full p-2 border-2 border-slate-100 rounded-lg text-sm bg-white">
                                {availableBoards.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Language</label>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full p-2 border-2 border-slate-100 rounded-lg text-sm">
                                {explanationLanguages.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {/* New: Subject Selector for Auto-Book */}
                    {availableSubjects.length > 0 && (
                        <div>
                            <label className="text-xs font-bold text-blue-600 uppercase">Select Subject (Auto-Book)</label>
                            <select 
                                value={selectedSubject} 
                                onChange={e => setSelectedSubject(e.target.value)} 
                                className="w-full p-2 border-2 border-blue-100 rounded-lg text-sm bg-blue-50 font-bold"
                            >
                                <option value="">-- Choose Subject --</option>
                                {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Book Name (किताब का नाम)</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={bookName} 
                                onChange={e => setBookName(e.target.value)} 
                                disabled={!!sourceFile}
                                placeholder="Type Book Name (e.g. NCERT Science)" 
                                className="w-full p-3 border-2 border-blue-50 rounded-lg font-bold text-blue-900 bg-blue-50/30 outline-none focus:border-blue-300 disabled:opacity-50" 
                            />
                            {!sourceFile && <button onClick={() => handleMicClick('book')} className={`absolute right-3 top-3 ${isListening && activeField === 'book' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}><MicrophoneIcon className="h-5 w-5"/></button>}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Chapter (अध्याय)</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={chapterName} 
                                onChange={e => setChapterName(e.target.value)} 
                                disabled={!!sourceFile}
                                placeholder="Type Chapter Name" 
                                className="w-full p-3 border-2 border-slate-100 rounded-lg text-sm outline-none focus:border-blue-300 disabled:opacity-50" 
                            />
                            {!sourceFile && <button onClick={() => handleMicClick('chapter')} className={`absolute right-3 top-3 ${isListening && activeField === 'chapter' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}><MicrophoneIcon className="h-5 w-5"/></button>}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Topic (विषय)</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={topic} 
                                onChange={e => setTopic(e.target.value)} 
                                disabled={!!sourceFile}
                                placeholder="e.g. Laws of Motion" 
                                className="w-full p-3 border-2 border-slate-100 rounded-lg text-sm outline-none focus:border-blue-300 disabled:opacity-50" 
                            />
                             {!sourceFile && <button onClick={() => handleMicClick('topic')} className={`absolute right-3 top-3 ${isListening && activeField === 'topic' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}><MicrophoneIcon className="h-5 w-5"/></button>}
                        </div>
                    </div>

                    <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-blue-600 text-white font-black rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        {loading ? 'AI is writing...' : <><SparklesIcon className="h-5 w-5"/> Generate Study Guide</>}
                    </button>
                </div>

                {/* --- Right View: Material --- */}
                <div className="bg-slate-50 rounded-xl border-2 border-blue-50 overflow-y-auto custom-scrollbar p-6">
                    {loading ? (
                        <div className="h-full flex items-center justify-center"><Loader message="AI सार्थी नोट्स तैयार कर रहा है..." /></div>
                    ) : studyMaterial ? (
                        <div className="animate-pop-in">
                            <div className="flex justify-between items-center mb-4 border-b pb-4 no-print">
                                <h3 className="font-bold text-slate-800">Generated Content</h3>
                                <div className="flex gap-2">
                                     <button onClick={() => window.print()} className="p-2 bg-white rounded-lg border shadow-sm text-slate-600 hover:text-blue-600"><PrinterIcon className="h-5 w-5"/></button>
                                     <button onClick={handleDownloadPDF} disabled={isDownloading} className="p-2 bg-white rounded-lg border shadow-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"><ArrowDownTrayIcon className="h-5 w-5"/></button>
                                </div>
                            </div>
                            <div ref={materialContentRef} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                                <div className="text-center mb-6 border-b pb-4">
                                     <h2 className="text-2xl font-black text-slate-900">{topic || "Study Material"}</h2>
                                     <p className="text-sm text-slate-500 font-bold">{bookName} • {chapterName}</p>
                                </div>
                                <div className="prose prose-blue max-w-none font-hindi" dangerouslySetInnerHTML={{ __html: studyMaterial }} />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-40">
                            <SparklesIcon className="h-20 w-20 mb-4" />
                            <p className="font-bold">Enter Book Details or Upload Photo</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookSelector;
