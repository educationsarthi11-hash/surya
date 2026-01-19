
import React, { useState, useRef } from 'react';
import { generateCurriculum } from '../services/geminiService';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';
import { BookOpenIcon, SparklesIcon, ArrowDownTrayIcon, PrinterIcon, CalendarDaysIcon } from './icons/AllIcons';
import { useClassroom } from '../contexts/ClassroomContext';

// Fixed: Global declarations
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface WeeklyPlan {
    week: number;
    topic: string;
    objective: string;
    activity: string;
}

const CurriculumArchitect: React.FC = () => {
    const toast = useToast();
    const { selectedClass } = useClassroom();
    
    // Form State
    const [className, setClassName] = useState(selectedClass || 'Class 10');
    const [subject, setSubject] = useState('Science');
    const [bookName, setBookName] = useState(''); // New State
    const [board, setBoard] = useState('CBSE');
    const [durationWeeks, setDurationWeeks] = useState(4); // Default 1 month
    
    const [curriculum, setCurriculum] = useState<WeeklyPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        if (!subject.trim()) {
            toast.error("Please enter a subject.");
            return;
        }
        setLoading(true);
        setCurriculum([]);
        
        try {
            // Include book name in the subject context
            const fullSubject = bookName ? `${subject} (Reference: ${bookName})` : subject;
            
            const result = await generateCurriculum(className, fullSubject, board, durationWeeks);
            if (result && Array.isArray(result.weeks)) {
                setCurriculum(result.weeks);
                toast.success("Curriculum generated successfully!");
            } else {
                toast.error("Invalid AI response format.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate curriculum. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        if (!contentRef.current || loading) return;
        setLoading(true);
        toast.info("Generating Curriculum PDF...");

        // --- SMART PAGE BREAK LOGIC ---
        const originalElement = contentRef.current;
        const clone = originalElement.cloneNode(true) as HTMLElement;
        const A4_WIDTH_PX = 794; 
        const A4_HEIGHT_PX = 1123;
        const PAGE_PADDING = 40; 
        const CONTENT_HEIGHT = A4_HEIGHT_PX - (PAGE_PADDING * 2);

        clone.style.width = `${A4_WIDTH_PX}px`;
        clone.style.minHeight = `${A4_HEIGHT_PX}px`;
        clone.style.padding = `${PAGE_PADDING}px`;
        clone.style.position = 'fixed';
        clone.style.top = '-10000px';
        clone.style.left = '-10000px';
        clone.style.height = 'auto';
        clone.style.overflow = 'visible';
        clone.style.backgroundColor = 'white';
        clone.style.color = 'black';
        
        // Ensure proper rendering of flex containers in clone
        const flexContainers = clone.querySelectorAll('.flex');
        flexContainers.forEach((el: any) => {
             el.style.display = 'flex';
        });

        document.body.appendChild(clone);

        // Identify week blocks (divs with border)
        const elements = Array.from(clone.children); 
        let currentHeight = 0;
        
        elements.forEach((el: any) => {
            const style = window.getComputedStyle(el);
            const marginTop = parseInt(style.marginTop) || 0;
            const marginBottom = parseInt(style.marginBottom) || 0;
            const elHeight = el.offsetHeight + marginTop + marginBottom;

            if (currentHeight + elHeight > CONTENT_HEIGHT) {
                if (elHeight < CONTENT_HEIGHT) {
                    const spaceLeft = CONTENT_HEIGHT - currentHeight;
                    const spacer = document.createElement('div');
                    spacer.style.height = `${spaceLeft + 20}px`;
                    spacer.style.display = 'block';
                    el.parentNode?.insertBefore(spacer, el);
                    currentHeight = elHeight;
                } else {
                     currentHeight += elHeight;
                }
            } else {
                currentHeight += elHeight;
            }
            if (currentHeight >= CONTENT_HEIGHT) {
                 currentHeight = currentHeight % CONTENT_HEIGHT;
            }
        });

        const { jsPDF } = window.jspdf;

        setTimeout(() => {
            window.html2canvas(clone, { 
                scale: 2, 
                useCORS: true,
                width: A4_WIDTH_PX,
                windowWidth: A4_WIDTH_PX
            }).then((canvas: HTMLCanvasElement) => {
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
                
                pdf.save(`${subject}_Curriculum_${className}.pdf`);
                document.body.removeChild(clone);
                setLoading(false);
                toast.success("PDF Downloaded!");
            }).catch((e: any) => {
                console.error(e);
                if (document.body.contains(clone)) document.body.removeChild(clone);
                setLoading(false);
                toast.error("Failed to generate PDF.");
            });
        }, 500);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <BookOpenIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">AI Curriculum Architect</h2>
                    <p className="text-sm text-neutral-500 font-hindi">पाठ्यक्रम और पाठ योजना निर्माता (Syllabus Planner)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit overflow-y-auto">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Plan Configuration</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Class / Grade</label>
                            <input type="text" value={className} onChange={e => setClassName(e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Subject (विषय)</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="e.g. Physics"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Book Name (Optional)</label>
                            <input type="text" value={bookName} onChange={e => setBookName(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="e.g. NCERT"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Board / Standard</label>
                            <select value={board} onChange={e => setBoard(e.target.value)} className="mt-1 w-full p-2 border rounded-md">
                                <option>CBSE</option>
                                <option>ICSE</option>
                                <option>State Board</option>
                                <option>IB</option>
                                <option>IGCSE</option>
                                <option>University / College</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Duration</label>
                            <select value={durationWeeks} onChange={e => setDurationWeeks(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md">
                                <option value={4}>1 Month (4 Weeks)</option>
                                <option value={12}>1 Term (12 Weeks)</option>
                                <option value={24}>1 Semester (24 Weeks)</option>
                                <option value={40}>Full Year (40 Weeks)</option>
                            </select>
                        </div>

                        <button 
                            onClick={handleGenerate} 
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary to-indigo-600 hover:to-indigo-700 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                        >
                            {loading ? <Loader message="Designing..." /> : <><SparklesIcon className="h-5 w-5 mr-2"/> Design Curriculum</>}
                        </button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800">
                        <p className="font-bold flex items-center gap-1 mb-1"><SparklesIcon className="h-3 w-3"/> AI Advantage:</p>
                        <p>Aligns with NEP 2020 standards and suggests interactive activities for better engagement.</p>
                    </div>
                </div>

                {/* Output View */}
                <div className="lg:col-span-2 flex flex-col h-full overflow-hidden bg-white border border-slate-200 rounded-xl shadow-inner">
                    {curriculum.length > 0 ? (
                        <>
                             <div className="p-4 border-b bg-neutral-50 flex justify-between items-center shrink-0">
                                <h3 className="font-bold text-neutral-800">Generated Plan</h3>
                                <div className="flex gap-2">
                                     <button onClick={handlePrint} className="p-2 border rounded-md hover:bg-white text-slate-600" title="Print"><PrinterIcon className="h-5 w-5"/></button>
                                     <button onClick={handleDownloadPDF} disabled={loading} className="p-2 border rounded-md hover:bg-white text-blue-600 disabled:opacity-50" title="Download PDF"><ArrowDownTrayIcon className="h-5 w-5"/></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar" ref={contentRef}>
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-black text-slate-900 mb-2">{subject} Curriculum Plan</h1>
                                    <p className="text-lg text-slate-600">{className} | {board} Board</p>
                                    {bookName && <p className="text-sm text-primary font-bold">Based on: {bookName}</p>}
                                </div>
                                
                                <div className="space-y-6">
                                    {curriculum.map((week) => (
                                        <div key={week.week} className="flex gap-4 p-4 border rounded-xl bg-slate-50 break-inside-avoid">
                                            <div className="flex-shrink-0 w-16 h-16 bg-white border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center text-center">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Week</span>
                                                <span className="text-2xl font-black text-primary">{week.week}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-slate-800 mb-1">{week.topic}</h4>
                                                <p className="text-sm text-slate-600 mb-2"><strong>Objective:</strong> {week.objective}</p>
                                                <div className="bg-white p-2 rounded-lg border border-slate-200 text-sm">
                                                    <strong className="text-orange-600">Activity:</strong> {week.activity}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-10 pt-4 border-t text-center text-xs text-slate-400">
                                    Generated by Education Sarthi AI
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                             <CalendarDaysIcon className="h-16 w-16 mb-4 opacity-20"/>
                             <p>Configure and click 'Design Curriculum' to start.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurriculumArchitect;
