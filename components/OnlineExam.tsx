
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Exam, Answer, ExamQuestion, ProctoringEvent, LocationType, ServiceName, User } from '../types';
import { generateOnlineExamContent, generateText, sanitizeHtml } from '../services/geminiService';
import Loader from './Loader';
import { ClockIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon, ArrowRightIcon, PrinterIcon, ArrowDownTrayIcon, SparklesIcon, EyeIcon } from './icons/AllIcons';
import { useClassroom } from '../contexts/ClassroomContext';
import { getBoardsForType } from '../config/classroomData';
import { useToast } from '../hooks/useToast';

type ExamState = 'configuring' | 'generating' | 'ready' | 'in-progress' | 'finished' | 'offline-preview';

const questionTypesOptions = ["Multiple Choice", "True/False", "Short Answer"];

const fontOptions: { [key: string]: string } = {
  'sans-serif': "Modern (Sans-Serif)",
  'serif': "Classic (Serif)",
  "'Tiro Devanagari Hindi', serif": "Hindi (Devanagari)",
};

const fontSizeOptions: { [key: string]: string } = {
    '12px': 'Small',
    '16px': 'Medium',
    '20px': 'Large',
};

interface OnlineExamProps {
    setActiveService: (service: ServiceName | 'overview') => void;
    user: User;
}

const OnlineExam: React.FC<OnlineExamProps> = ({ setActiveService, user }) => {
    const [examState, setExamState] = useState<ExamState>('configuring');
    const [examData, setExamData] = useState<Exam | null>(null);
    const [answers, setAnswers] = useState<Answer>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const timerRef = useRef<number | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const offlinePaperRef = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const { 
        selectedClass,
        institutionType 
    } = useClassroom();

    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    // AI Proctor State
    const [proctoringEnabled, setProctoringEnabled] = useState(false);
    const [proctoringStream, setProctoringStream] = useState<MediaStream | null>(null);
    const [proctoringEvents, setProctoringEvents] = useState<ProctoringEvent[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const proctoringIntervalRef = useRef<number | null>(null);

    const [config, setConfig] = useState({
        course: '', // Will init based on type
        subject: 'Science',
        bookName: '', // Added Book Name
        chapterName: 'Light - Reflection and Refraction',
        numQuestions: 5,
        questionTypes: ['Multiple Choice', 'True/False']
    });

    const [fontSize, setFontSize] = useState('16px');
    const [fontFamily, setFontFamily] = useState('sans-serif');

    // STRICT FILTERING
    const availableBoards = useMemo(() => {
        return getBoardsForType(institutionType);
    }, [institutionType]);

    useEffect(() => {
        if (availableBoards.length > 0 && !availableBoards.includes(config.course)) {
            setConfig(prev => ({ ...prev, course: availableBoards[0] }));
        }
    }, [availableBoards]);


    // Stop camera when component unmounts or exam ends
    useEffect(() => {
        return () => {
            if (proctoringStream) {
                proctoringStream.getTracks().forEach(track => track.stop());
            }
            if (proctoringIntervalRef.current) {
                clearInterval(proctoringIntervalRef.current);
            }
        };
    }, [proctoringStream]);

    const startProctoring = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setProctoringStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setProctoringEvents([]);
            toast.info("AI Proctoring is active.");

            // Mock AI analysis interval
            proctoringIntervalRef.current = window.setInterval(() => {
                const randomEvent = Math.random();
                let event: ProctoringEvent | null = null;
                if (randomEvent > 0.95) {
                    event = { timestamp: new Date().toLocaleTimeString(), event: 'Multiple faces detected', severity: 'high' };
                } else if (randomEvent > 0.85) {
                    event = { timestamp: new Date().toLocaleTimeString(), event: 'Student looked away for too long', severity: 'medium' };
                } else if (randomEvent > 0.7) {
                    event = { timestamp: new Date().toLocaleTimeString(), event: 'Mobile phone detected', severity: 'high' };
                }
                
                if (event) {
                    setProctoringEvents(prev => [event!, ...prev]);
                    toast.info(`AI Proctor Alert: ${event.event}`);
                }
            }, 15000); // Check every 15 seconds

        } catch (err) {
            toast.error("Could not access camera. Proctoring disabled.");
            setProctoringEnabled(false);
        }
    };


    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const generatePerformanceAnalysis = async () => {
        if (!examData || score === null) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);

        const performanceData = examData.questions.map((q, i) => {
            const userAnswer = answers[i] || "Not Answered";
            const isCorrect = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
            return `Question ${i + 1}: "${q.question}"\n- User Answer: "${userAnswer}"\n- Correct Answer: "${q.answer}"\n- Correct: ${isCorrect}`;
        }).join('\n\n');

        const prompt = `
            Act as an expert AI educational analyst for "Education Sarthi School". A student has just completed an online exam.
            
            **Exam Details:**
            - Subject: ${examData.subject}
            - Class: ${examData.className}
            - Total Marks: ${examData.totalMarks}
            - Score Obtained: ${score}

            **Student's Performance Data:**
            ${performanceData}

            **Your Task:**
            Provide a concise, encouraging, and constructive analysis of the student's performance in clean HTML format. Do not include \`<html>\` or \`<body>\` tags.
            The analysis should be structured with the following sections:
            1.  A heading \`<h3>Overall Performance Summary</h3>\` followed by a brief paragraph summarizing the student's result.
            2.  A heading \`<h3>Key Strengths</h3>\` followed by a bulleted list (\`<ul><li>...\</li></ul>\`) identifying topics or question types where the student performed well. Be specific, referencing the questions.
            3.  A heading \`<h3>Areas for Improvement</h3>\` followed by a bulleted list identifying topics or question types where the student struggled. Provide gentle, actionable advice for each point. For example, "Review the concept of..." or "Practice more problems related to...".

            The tone should be supportive, aiming to help the student learn and grow, not just to score them.
        `;

        try {
            /* Updated to use gemini-3-pro-preview for complex analysis */
            const result = await generateText(prompt, 'gemini-3-pro-preview');
            setAnalysisResult(sanitizeHtml(result)); // Sanitize AI output
            toast.success("AI performance analysis is ready!");
        } catch (error) {
            console.error("Failed to generate performance analysis:", error);
            toast.error("Could not generate AI analysis for the results.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    useEffect(() => {
        if (examState === 'finished' && examData && score !== null && !analysisResult && !isAnalyzing) {
            generatePerformanceAnalysis();
        }
    }, [examState, examData, score, analysisResult, isAnalyzing]);


    const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionTypeChange = (type: string) => {
        setConfig(prev => {
            const newTypes = prev.questionTypes.includes(type)
                ? prev.questionTypes.filter(t => t !== type)
                : [...prev.questionTypes, type];
            return { ...prev, questionTypes: newTypes };
        });
    };

    const handleGenerateExam = async () => {
        if (!config.subject.trim() || !config.chapterName.trim()) {
            toast.error('Please fill in Subject and Chapter Name.');
            return;
        }
        if (config.questionTypes.length === 0) {
            toast.error('Please select at least one question type.');
            return;
        }
        setExamState('generating');
        setAnalysisResult(null); // Reset analysis on new exam generation
        try {
            // Passed Book Name if present to tailor the questions
            const subjectWithBook = config.bookName ? `${config.subject} (Book: ${config.bookName})` : config.subject;

            const exam = await generateOnlineExamContent(
                config.course,
                selectedClass,
                subjectWithBook,
                config.chapterName,
                config.numQuestions,
                config.questionTypes
            );
            setExamData(exam);
            setExamState('ready');
            toast.success('Your exam is ready!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate the exam. Please try again.');
            setExamState('configuring');
        }
    };
    
    const handleFinishExam = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (proctoringIntervalRef.current) {
            clearInterval(proctoringIntervalRef.current);
            proctoringIntervalRef.current = null;
        }
        if (proctoringStream) {
            proctoringStream.getTracks().forEach(track => track.stop());
            setProctoringStream(null);
        }

        if (!examData) return;
        
        let calculatedScore = 0;
        examData.questions.forEach((q, index) => {
            if (answers[index] && answers[index].trim().toLowerCase() === q.answer.trim().toLowerCase()) {
                calculatedScore += q.marks;
            }
        });
        setScore(calculatedScore);
        setExamState('finished');
    };

    const handleStartExam = () => {
        if (!examData) return;
        if (proctoringEnabled) {
            startProctoring();
        }
        setAnswers({});
        setCurrentQuestionIndex(0);
        setScore(null);
        setAnalysisResult(null);
        setTimeLeft(examData.duration * 60);
        setExamState('in-progress');
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev !== null && prev > 1) {
                    return prev - 1;
                }
                handleFinishExam(); 
                return 0;
            });
        }, 1000);
    };

    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const formatTime = (seconds: number | null): string => {
        if (seconds === null) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    
    const handlePrintResults = () => {
        window.print();
        toast.info("Preparing results for printing...");
    };

    const handlePrintPaper = () => {
        window.print();
        toast.info("Preparing exam paper for printing...");
    };

    const handleDownloadPdf = () => {
        if (!offlinePaperRef.current || isDownloadingPdf) return;
        
        const jspdf = (window as any).jspdf;
        const html2canvas = (window as any).html2canvas;

        if (!jspdf || !html2canvas) {
          toast.error("PDF libraries are still loading. Please try again in a few seconds.");
          return;
        }

        const examName = (examData?.subject || 'exam').replace(/\s+/g, '_').toLowerCase();
        
        setIsDownloadingPdf(true);
        const { jsPDF } = jspdf;
        
        html2canvas(offlinePaperRef.current, { scale: 2, useCORS: true }).then((canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const aspectRatio = imgProps.width / imgProps.height;
    
            let imgWidth = pdfWidth - 20; 
            let imgHeight = imgWidth / aspectRatio; 
            let heightLeft = imgHeight;
            let position = 10; 

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20); 

            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 10; 
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= (pdfHeight - 20);
            }
            
            pdf.save(`${examName}_paper.pdf`);
            setIsDownloadingPdf(false);
            toast.success('PDF Downloaded.');
        }).catch((err: any) => {
            toast.error('Could not generate PDF. Please try again.');
            console.error('PDF generation error:', err);
            setIsDownloadingPdf(false);
        });
    };

    const renderConfiguration = () => (
        <div className="space-y-4 animate-pop-in h-full overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-xl font-bold text-neutral-800">Setup Your Exam</h3>
            <p className="text-sm text-neutral-500 font-hindi">AI को अपनी परीक्षा बनाने के लिए विवरण प्रदान करें।</p>
            
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm">
                <p><strong>Context:</strong> Creating exam for <strong>{selectedClass}</strong>.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-neutral-700">Board / Exam</label>
                    <select name="course" id="course" value={config.course} onChange={handleConfigChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2">
                        {availableBoards.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-700">Subject (विषय)</label>
                    <input type="text" name="subject" id="subject" value={config.subject} onChange={handleConfigChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" placeholder="e.g. Physics" />
                </div>
                <div>
                    <label htmlFor="bookName" className="block text-sm font-medium text-neutral-700">Book Name (Optional)</label>
                    <input type="text" name="bookName" id="bookName" value={config.bookName} onChange={handleConfigChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" placeholder="e.g. NCERT, RD Sharma" />
                </div>
                <div>
                    <label htmlFor="chapterName" className="block text-sm font-medium text-neutral-700">Chapter Name</label>
                    <input type="text" name="chapterName" id="chapterName" value={config.chapterName} onChange={handleConfigChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" placeholder="e.g. Light" />
                </div>
            </div>
            <div>
                <label htmlFor="numQuestions" className="block text-sm font-medium text-neutral-700">Number of Questions</label>
                <input type="number" name="numQuestions" id="numQuestions" value={config.numQuestions} onChange={e => setConfig({...config, numQuestions: parseInt(e.target.value) || 1})} min="1" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
            </div>
            <div>
                <fieldset>
                    <legend className="block text-sm font-medium text-neutral-700 mb-2">Question Types</legend>
                    <div className="flex flex-wrap gap-2">
                        {questionTypesOptions.map(type => (
                            <div key={type}>
                                <input type="checkbox" id={`q-type-${type}`} name="question-type" value={type} checked={config.questionTypes.includes(type)} onChange={() => handleQuestionTypeChange(type)} className="sr-only peer" />
                                <label htmlFor={`q-type-${type}`} className="px-3 py-1.5 text-sm rounded-full border cursor-pointer peer-checked:bg-primary peer-checked:text-white">{type}</label>
                            </div>
                        ))}
                    </div>
                </fieldset>
            </div>
            <button onClick={handleGenerateExam} className="w-full mt-4 flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                Generate Exam
            </button>
        </div>
    );

    const renderReadyScreen = () => (
        <div className="text-center p-8 space-y-4 animate-pop-in h-full flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-neutral-900">Exam Ready: {examData?.subject}</h3>
            <p className="text-neutral-600">This exam covers <strong>{examData?.className} - {examData?.questions.length} questions</strong>.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-neutral-700">
                <span><ClockIcon className="inline h-5 w-5 mr-1"/> Duration: <strong>{examData?.duration} minutes</strong></span>
                <span><CheckCircleIcon className="inline h-5 w-5 mr-1"/> Total Marks: <strong>{examData?.totalMarks}</strong></span>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-center">
                    <input
                        id="proctoring-toggle"
                        type="checkbox"
                        checked={proctoringEnabled}
                        onChange={(e) => setProctoringEnabled(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="proctoring-toggle" className="ml-3 block text-sm font-medium text-amber-900">
                        Enable AI Proctoring (Requires Camera)
                    </label>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button onClick={handleStartExam} className="inline-flex items-center justify-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark">
                    Start Online Exam
                </button>
                 <button onClick={() => setExamState('offline-preview')} className="inline-flex items-center justify-center py-2.5 px-6 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50">
                    Prepare Offline Version
                </button>
            </div>
        </div>
    );

    const renderExamInProgress = () => {
        if (!examData) return null;
        const question: ExamQuestion = examData.questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;

        return (
            <div className="animate-pop-in relative h-full flex flex-col">
                {proctoringEnabled && (
                    <div className="absolute top-0 right-0 z-10 p-2">
                        <div className="bg-white p-2 rounded-lg shadow-lg border">
                            <video ref={videoRef} autoPlay playsInline muted className="h-24 w-32 rounded-md object-cover transform -scale-x-100"></video>
                            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-green-700 mt-1">
                                <EyeIcon className="h-4 w-4"/> AI Proctor Active
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <div className="w-full bg-neutral-200 rounded-full h-2.5 mr-4">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="font-mono text-lg font-semibold text-accent flex items-center">
                        <ClockIcon className="h-5 w-5 mr-1"/>
                        {formatTime(timeLeft)}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="p-6 border border-neutral-200 rounded-lg bg-neutral-50">
                        <p className="text-sm text-neutral-500">Question {currentQuestionIndex + 1} of {examData.questions.length} ({question.marks} marks)</p>
                        <h4 className="text-lg font-semibold my-2">{question.question}</h4>
                        
                        <div className="mt-4 space-y-3">
                            {question.type === 'multiple-choice' && question.options?.map((option, i) => (
                                <label key={i} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-primary/10 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                    <input type="radio" name={`q-${currentQuestionIndex}`} value={option} checked={answers[currentQuestionIndex] === option} onChange={e => handleAnswerChange(currentQuestionIndex, e.target.value)} className="h-4 w-4 text-primary focus:ring-primary border-neutral-300"/>
                                    <span className="ml-3 text-sm text-neutral-700">{option}</span>
                                </label>
                            ))}
                            {question.type === 'true-false' && ['True', 'False'].map((option, i) => (
                                <label key={i} className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-primary/10 has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                                    <input type="radio" name={`q-${currentQuestionIndex}`} value={option} checked={answers[currentQuestionIndex] === option} onChange={e => handleAnswerChange(currentQuestionIndex, e.target.value)} className="h-4 w-4 text-primary focus:ring-primary border-neutral-300"/>
                                    <span className="ml-3 text-sm text-neutral-700">{option}</span>
                                </label>
                            ))}
                            {question.type === 'short-answer' && (
                                <input type="text" value={answers[currentQuestionIndex] || ''} onChange={e => handleAnswerChange(currentQuestionIndex, e.target.value)} className="block w-full rounded-md border-neutral-300 shadow-sm p-2" placeholder="Your answer here..."/>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-6 shrink-0">
                    <button onClick={() => setCurrentQuestionIndex(p => p - 1)} disabled={currentQuestionIndex === 0} className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50">
                        <ArrowLeftIcon className="h-5 w-5 mr-1"/> Previous
                    </button>
                    {currentQuestionIndex === examData.questions.length - 1 ? (
                        <button onClick={handleFinishExam} className="px-4 py-2 border rounded-md text-sm font-medium text-white bg-secondary hover:bg-secondary-dark">
                            Finish Exam
                        </button>
                    ) : (
                        <button onClick={() => setCurrentQuestionIndex(p => p + 1)} disabled={currentQuestionIndex === examData.questions.length - 1} className="inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50">
                            Next <ArrowRightIcon className="h-5 w-5 ml-1"/>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderOfflinePreview = () => (
        <div className="animate-pop-in h-full flex flex-col">
            <div className="mb-6 p-4 bg-neutral-100 rounded-lg border flex flex-col sm:flex-row gap-4 justify-between items-center no-print shrink-0">
                 <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-neutral-700">Font:</label>
                        <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="text-sm p-1 border rounded-md">
                            {Object.entries(fontOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-neutral-700">Font Size:</label>
                        <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="text-sm p-1 border rounded-md">
                            {Object.entries(fontSizeOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setExamState('ready')} className="p-2 border rounded-md text-sm font-medium"><ArrowLeftIcon className="h-5 w-5"/></button>
                    <button onClick={handlePrintPaper} className="p-2 border rounded-md text-sm font-medium"><PrinterIcon className="h-5 w-5"/></button>
                    <button onClick={handleDownloadPdf} disabled={isDownloadingPdf} className="p-2 border rounded-md text-sm font-medium disabled:opacity-50"><ArrowDownTrayIcon className="h-5 w-5"/></button>
                </div>
            </div>
             <div className="flex-1 overflow-y-auto bg-neutral-100 p-4 sm:p-6 custom-scrollbar" style={{ fontSize, fontFamily }}>
                <div ref={offlinePaperRef} className="bg-white shadow-lg p-6 sm:p-8 printable-content w-full max-w-4xl mx-auto">
                    <div className="text-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold">Education Sarthi School</h2>
                        <h3 className="text-xl mt-1">{examData?.subject} - Practice Exam</h3>
                    </div>
                    <div className="flex justify-between mb-6 text-sm">
                        <span><strong>Class:</strong> {examData?.className}</span>
                        <span><strong>Time:</strong> {examData?.duration} Mins</span>
                        <span><strong>Max. Marks:</strong> {examData?.totalMarks}</span>
                    </div>
                    <div className="space-y-6">
                        {examData?.questions.map((q, i) => (
                            <div key={i}>
                                <p className="font-semibold">{i+1}. {q.question} ({q.marks} Marks)</p>
                                {q.type === 'multiple-choice' && (
                                    <ol type="a" className="list-inside mt-2 space-y-1">
                                        {q.options?.map((opt, oi) => <li key={oi}>{opt}</li>)}
                                    </ol>
                                )}
                                {q.type === 'true-false' && <p className="mt-2">(True / False)</p>}
                                {q.type === 'short-answer' && <div className="mt-4 border-b-2 border-dotted h-8"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderResults = () => {
        if (!examData) return null;
        const scorePercentage = score !== null && examData.totalMarks > 0 ? (score / examData.totalMarks) * 100 : 0;
    
        return (
            <div className="animate-pop-in printable-content h-full flex flex-col" ref={resultsRef}>
                <div className="no-print flex justify-between items-center mb-6 shrink-0">
                    <h2 className="text-2xl font-bold">Exam Results</h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrintResults} className="p-2 border rounded-md text-sm font-medium"><PrinterIcon className="h-5 w-5" /></button>
                        <button onClick={() => setExamState('configuring')} className="px-4 py-2 border rounded-md text-sm font-medium">New Exam</button>
                    </div>
                </div>
    
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="p-6 bg-primary/10 text-primary-dark rounded-xl text-center mb-6">
                        <h3 className="text-xl font-bold">Your Score</h3>
                        <p className="text-5xl font-extrabold my-2">{score} <span className="text-3xl font-semibold">/ {examData.totalMarks}</span></p>
                        <p className="font-semibold">{score !== null && examData.totalMarks > 0 ? `${((score / examData.totalMarks) * 100).toFixed(1)}%` : '0%'}</p>
                    </div>
                    
                    {score !== null && scorePercentage < 50 && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center animate-pop-in no-print mb-6">
                            <SparklesIcon className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                            <h4 className="font-bold text-amber-800">Need some help?</h4>
                            <p className="text-sm text-amber-700 mt-1">It looks like this topic was challenging. Use our tools to master '{examData.subject}'.</p>
                        </div>
                    )}
        
                    {isAnalyzing && <div className="mt-6"><Loader message="AI is analyzing performance..." /></div>}
                    {analysisResult && (
                        <div className="mt-6 mb-8">
                            <h3 className="text-lg font-bold text-neutral-800 flex items-center"><SparklesIcon className="h-5 w-5 mr-2 text-primary"/> AI Performance Analysis</h3>
                            <div className="prose prose-sm max-w-none mt-2" dangerouslySetInnerHTML={{ __html: analysisResult }} />
                        </div>
                    )}
        
                     {proctoringEnabled && proctoringEvents.length > 0 && (
                        <div className="mt-6 no-print mb-8">
                            <h3 className="text-lg font-bold text-neutral-800 flex items-center"><EyeIcon className="h-5 w-5 mr-2 text-primary"/> AI Proctoring Log</h3>
                            <div className="mt-2 border rounded-lg p-2 bg-neutral-50 max-h-40 overflow-y-auto">
                                {proctoringEvents.map((event, i) => (
                                    <p key={i} className="text-xs text-neutral-600 border-b last:border-b-0 py-1">
                                        <span className="font-mono">{event.timestamp}</span> - <span className={`font-semibold ${event.severity === 'high' ? 'text-red-600' : 'text-amber-600'}`}>{event.event}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-bold text-neutral-800">Question-wise Breakdown</h3>
                        <div className="space-y-4 mt-4">
                            {examData.questions.map((q, i) => {
                                const userAnswer = answers[i] || "Not Answered";
                                const isCorrect = userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
                                return (
                                    <div key={i} className={`p-4 border rounded-lg ${isCorrect ? 'border-green-500/20 bg-green-50' : 'border-red-500/20 bg-red-50'}`}>
                                        <p className="font-semibold">{i + 1}. {q.question}</p>
                                        <p className={`text-sm mt-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                            {isCorrect ? <CheckCircleIcon className="inline h-5 w-5 mr-1" /> : <XCircleIcon className="inline h-5 w-5 mr-1" />}
                                            Your answer: <strong>{userAnswer}</strong>
                                        </p>
                                        {!isCorrect && <p className="text-sm mt-1 text-green-800">Correct answer: <strong>{q.answer}</strong></p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col overflow-hidden">
            <div className="flex items-center mb-6 shrink-0">
                 <SparklesIcon className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">AI-Powered Online Exam</h2>
            </div>
            {examState === 'generating' ? (
                <div className="text-center p-8 flex-1 flex flex-col justify-center">
                    <Loader message="AI is preparing your exam..." />
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    {examState === 'configuring' && renderConfiguration()}
                    {examState === 'ready' && renderReadyScreen()}
                    {examState === 'in-progress' && renderExamInProgress()}
                    {examState === 'finished' && renderResults()}
                    {examState === 'offline-preview' && renderOfflinePreview()}
                </div>
            )}
        </div>
    );
};

export default OnlineExam;
