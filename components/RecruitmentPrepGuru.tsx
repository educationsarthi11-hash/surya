
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { generateRecruitmentMaterial } from '../services/geminiService';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';
import { BriefcaseIcon, ArrowDownTrayIcon, PrinterIcon, CheckCircleIcon, SparklesIcon, ChatBubbleIcon } from './icons/AllIcons';
import { boardsAndExamsList } from '../config/classroomData';
import RecruitmentLiveClass from './RecruitmentLiveClass';

declare const jspdf: any;
declare const html2canvas: any;

type PrepMode = 'notes' | 'quiz' | 'live-class';

interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

const explanationLanguages = ['English', 'Hindi'];

const RecruitmentPrepGuru: React.FC = () => {
    const [examName, setExamName] = useState('UPSC Civil Services');
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [language, setLanguage] = useState('English');
    const [prepMode, setPrepMode] = useState<PrepMode>('notes');
    
    const [loading, setLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<string | { questions: QuizQuestion[] } | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);
    
    const toast = useToast();
    const contentRef = useRef<HTMLDivElement>(null);
    const printableRef = useRef<HTMLDivElement>(null);

    const handleEndLiveClass = useCallback(() => setPrepMode('notes'), []);

    const handleGenerate = async () => {
        if (prepMode === 'live-class') return;
        if (!subject.trim() || !topic.trim()) {
            toast.error('Please fill in both Subject and Topic fields.');
            return;
        }
        setLoading(true);
        setGeneratedContent(null);
        setShowAnswers(false);

        try {
            const response = await generateRecruitmentMaterial(examName, subject, topic, prepMode, language);
            setGeneratedContent(response);
        } catch (err) {
            console.error("Content generation failed:", err);
            toast.error('Failed to generate content. Please check your inputs and try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        if (!printableRef.current) return;
        setLoading(true);
        const { jsPDF } = jspdf;
        
        html2canvas(printableRef.current, { scale: 2, useCORS: true }).then((canvas: any) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
    
            let imgWidth = pdfWidth - 20;
            let imgHeight = imgWidth / ratio;
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20);

            while (heightLeft > 0) {
                position = position - (pdfHeight - 20);
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= (pdfHeight - 20);
            }
            
            pdf.save(`${subject}_${topic}_prep.pdf`);
            toast.success('PDF Downloaded.');
        }).catch((err: any) => {
            toast.error('Could not generate PDF.');
            console.error('PDF generation error:', err);
        }).finally(() => {
            setLoading(false);
        });
    };

    const renderRightPanel = () => {
        if (prepMode === 'live-class') {
            return (
                <div className="h-[75vh] min-h-[600px]">
                    <RecruitmentLiveClass
                        examName={examName}
                        subject={subject}
                        topic={topic}
                        language={language}
                        onEnd={handleEndLiveClass}
                    />
                </div>
            )
        }

        return (
            <div ref={contentRef} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 min-h-[50vh] lg:max-h-[70vh] overflow-y-auto">
                {loading && !generatedContent && (
                    <div className="flex items-center justify-center h-full">
                        <Loader message={`AI is preparing your ${prepMode}...`} />
                    </div>
                )}
                {!loading && !generatedContent && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
                        <BriefcaseIcon aria-hidden="true" className="h-16 w-16 mb-4 text-neutral-300" />
                        <h3 className="font-semibold text-lg">Your Preparation Material Will Appear Here</h3>
                        <p className="text-sm mt-1">Fill the form to get started.</p>
                    </div>
                )}
                {generatedContent && (
                    <div>
                        <div className="flex items-center justify-between mb-4 sticky top-0 bg-neutral-50 py-2 z-10">
                            <h3 className="font-semibold text-neutral-800">Generated Material:</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={handlePrint} className="p-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-600" aria-label="Print">
                                    <PrinterIcon aria-hidden="true" className="h-5 w-5" />
                                </button>
                                <button onClick={handleDownloadPdf} disabled={loading} className="p-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-600 disabled:opacity-50" aria-label="Download PDF">
                                    <ArrowDownTrayIcon aria-hidden="true" className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div ref={printableRef} className="p-6 bg-white border border-neutral-200 rounded-md shadow-sm printable-content">
                            {prepMode === 'notes' && typeof generatedContent === 'string' && (
                                <div role="article" className="prose prose-sm max-w-none text-neutral-700" dangerouslySetInnerHTML={{ __html: generatedContent }} />
                            )}
                            {prepMode === 'quiz' && typeof generatedContent === 'object' && 'questions' in generatedContent && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">Practice Quiz</h3>
                                        <button onClick={() => setShowAnswers(s => !s)} className="text-sm text-primary font-semibold">{showAnswers ? 'Hide' : 'Show'} Answers</button>
                                    </div>
                                    <div className="space-y-6">
                                        {generatedContent.questions.map((q, i) => (
                                            <div key={i}>
                                                <p className="font-semibold">{i + 1}. {q.question}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                    {q.options.map((opt, optIndex) => (
                                                        <div key={optIndex} className={`p-2 border rounded-md text-sm ${showAnswers && opt === q.answer ? 'bg-green-100 border-green-300' : 'bg-neutral-50'}`}>{opt}</div>
                                                    ))}
                                                </div>
                                                {showAnswers && (
                                                     <p className="mt-2 text-sm font-bold text-green-700 flex items-center">
                                                         <CheckCircleIcon className="h-4 w-4 mr-1"/> Correct Answer: {q.answer}
                                                     </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
                <BriefcaseIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Recruitment Prep Guru</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-6 font-hindi">सभी प्रकार की सरकारी और निजी भर्तियों की तैयारी करें।</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Controls Column --- */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="examName" className="block text-sm font-medium text-neutral-700">Exam Name</label>
                            <select id="examName" value={examName} onChange={e => setExamName(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2">
                                {boardsAndExamsList.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="language-prep" className="block text-sm font-medium text-neutral-700">Language (भाषा)</label>
                            <select id="language-prep" value={language} onChange={e => setLanguage(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2">
                                {explanationLanguages.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="subject-prep" className="block text-sm font-medium text-neutral-700">Subject (विषय)</label>
                            <input type="text" id="subject-prep" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Indian History" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="topic-prep" className="block text-sm font-medium text-neutral-700">Topic (विषय)</label>
                            <input type="text" id="topic-prep" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., The Mughal Empire" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                        </div>
                    </div>
                    
                    <div>
                        <fieldset>
                            <legend className="block text-sm font-medium text-neutral-700 mb-2">Preparation Mode</legend>
                            <div className="flex gap-2">
                                <button onClick={() => setPrepMode('notes')} className={`px-4 py-2 text-sm rounded-md border ${prepMode === 'notes' ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-neutral-50'}`}>Study Notes</button>
                                <button onClick={() => setPrepMode('quiz')} className={`px-4 py-2 text-sm rounded-md border ${prepMode === 'quiz' ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-neutral-50'}`}>Practice Quiz</button>
                                <button onClick={() => setPrepMode('live-class')} className={`px-4 py-2 text-sm rounded-md border flex items-center gap-2 ${prepMode === 'live-class' ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-neutral-50'}`}>
                                    <ChatBubbleIcon className="h-4 w-4"/> Live Class
                                </button>
                            </div>
                        </fieldset>
                    </div>

                    {prepMode !== 'live-class' && (
                        <button onClick={handleGenerate} disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-neutral-400 animate-pop-in">
                            <SparklesIcon className="h-5 w-5 mr-2" />
                            {loading ? 'Generating...' : `Generate ${prepMode === 'notes' ? 'Notes' : 'Quiz'}`}
                        </button>
                    )}
                </div>

                {/* --- Output Column --- */}
                {renderRightPanel()}
            </div>
        </div>
    );
};

export default RecruitmentPrepGuru;
