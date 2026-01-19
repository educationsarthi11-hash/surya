
import React, { useState, useRef } from 'react';
import { generateText, generateTextWithFile, sanitizeHtml } from '../services/geminiService';
import Loader from './Loader';
import { DocumentTextIcon, ClipboardIcon, PaperClipIcon, ArrowDownTrayIcon, XCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const fontOptions: { [key: string]: string } = {
  'sans-serif': "Modern (Sans-Serif)",
  'serif': "Classic (Serif)",
  "'Noto Sans Devanagari', sans-serif": "Hindi (Devanagari)",
};

const CVGenerator: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [education, setEducation] = useState('');
    const [experience, setExperience] = useState('');
    const [projects, setProjects] = useState('');
    const [skills, setSkills] = useState('');
    const [objective, setObjective] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cvPreviewRef = useRef<HTMLDivElement>(null);
    const cvContentRef = useRef<HTMLDivElement>(null);

    const [generatedCV, setGeneratedCV] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const [paperSize, setPaperSize] = useState('a4');
    const [fontFamily, setFontFamily] = useState('sans-serif');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleGenerate = async () => {
        if (!file && (!fullName.trim() || !email.trim() || !education.trim() || !skills.trim() || !objective.trim())) {
            toast.error('Please either upload a document or fill in all required fields.');
            return;
        }
        setLoading(true);
        setGeneratedCV('');

        try {
            let response;
            if (file) {
                 const prompt = `
                    Act as an expert career coach and resume writer. Your task is to **transform** the attached document ('${file.name}') into a modern, high-impact, professional CV. The output must be a single, clean **HTML snippet**.
                    
                    Follow these steps:
                    1.  **Analyze and Extract:** Carefully read the attached document and extract all key information.
                    2.  **Supplement or Override:** Use the following manually entered details to supplement or replace information from the document if provided:
                        - Full Name: ${fullName || 'Use from document'}
                        - Email: ${email || 'Use from document'}
                        - Phone: ${phone || 'Use from document'}
                        - Career Objective / Summary: ${objective || 'Use from document'}
                        - Education: ${education || 'Use from document'}
                        - Work Experience: ${experience || 'Use from document'}
                        - Projects: ${projects || 'Use from document'}
                        - Skills: ${skills || 'Use from document'}
                    3.  **Rewrite for Impact:**
                        - **Professional Summary:** Craft a compelling, concise summary (2-3 sentences) that highlights the candidate's key strengths and career goals.
                        - **Work Experience:** Rewrite bullet points to be achievement-oriented. Use strong action verbs and quantify results.
                        - **Skills:** Organize skills into logical categories (e.g., Technical Skills, Soft Skills).
                    4.  **Format Professionally:** Structure the CV in a clean, modern, and easily scannable format using HTML. The standard sections should be: Header (Name, Contact in \`<div>\`s), Professional Summary (\`<h2>\` and \`<p>\`), Skills, Work Experience, Projects, Education (all with \`<h2>\` and \`<ul>\`). Ensure consistent formatting.

                    The final output should be a significantly polished and improved CV in HTML format, ready for display and printing. Do not include \`<html>\` or \`<body>\` tags.
                `;
                response = await generateTextWithFile(prompt, file);
            } else {
                 const prompt = `
                    Act as an expert career coach and resume writer. Create a modern, high-impact, professional CV using the details provided below. The output must be a single, clean **HTML snippet**.

                    Applicant's Details:
                    - Full Name (पूरा नाम): ${fullName}
                    - Email (ईमेल): ${email}
                    - Phone (फ़ोन): ${phone}
                    - Career Objective / Summary (उद्देश्य / सारांश): ${objective}
                    - Education (शिक्षा): ${education}
                    - Work Experience (कार्य अनुभव): ${experience || 'N/A'}
                    - Projects (परियोजनाएं): ${projects || 'N/A'}
                    - Skills (कौशल): ${skills}

                    Instructions:
                    1.  **Professional Summary:** Transform the provided objective into a compelling, concise summary (2-3 sentences).
                    2.  **Work Experience & Projects:** For each role or project, rewrite the descriptions to be achievement-oriented. Use strong action verbs and quantify results where possible.
                    3.  **Skills:** Organize the skills into logical categories.
                    4.  **Formatting:** Structure the CV in a clean, modern, and easily scannable format using HTML. The standard sections should be: Header (Name, Contact), Professional Summary, Skills, Work Experience, Projects, Education. Use tags like \`<h1>\`, \`<h2>\`, \`<p>\`, and \`<ul>\`. Do not include \`<html>\` or \`<body>\` tags.

                    The final output should be a polished and professional CV in HTML format.
                `;
                response = await generateText(prompt);
            }
            setGeneratedCV(sanitizeHtml(response)); 
            setTimeout(() => {
                cvPreviewRef.current?.focus();
            }, 100);
        } catch (err) {
            console.error("CV generation failed:", err);
            toast.error('Failed to generate CV. The file might be unsupported.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!generatedCV) return;
        navigator.clipboard.writeText(generatedCV).then(() => {
            toast.success('Copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
            toast.error('Failed to copy.');
        });
    };

    const handleDownloadPdf = () => {
        if (!cvContentRef.current || loading) return;
        
        const jspdf = (window as any).jspdf;
        const html2canvas = (window as any).html2canvas;

        if (!jspdf || !html2canvas) {
          toast.error("PDF libraries are still loading. Please try again in a few seconds.");
          return;
        }

        const cvName = (fullName || 'professional_cv').replace(/\s+/g, '_').toLowerCase();
        
        setLoading(true);
        toast.info("Preparing High-Quality CV PDF...");

        const originalElement = cvContentRef.current;
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
        clone.style.fontFamily = fontFamily;

        document.body.appendChild(clone);

        const { jsPDF } = jspdf;
        
        setTimeout(() => {
            html2canvas(clone, { 
                scale: 2, 
                useCORS: true,
                logging: false,
                width: A4_WIDTH_PX,
                windowWidth: A4_WIDTH_PX
            }).then((canvas: HTMLCanvasElement) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: paperSize
                });
        
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgProps = pdf.getImageProperties(imgData);
                const aspectRatio = imgProps.width / imgProps.height;
        
                let imgWidth = pdfWidth; 
                let imgHeight = imgWidth / aspectRatio;
                
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pdfHeight;
                }
                
                pdf.save(`${cvName}.pdf`);
                document.body.removeChild(clone);
                setLoading(false);
                toast.success('CV PDF downloaded successfully.');
            }).catch((err: any) => {
                toast.error('Could not generate PDF.');
                console.error('PDF generation error:', err);
                if (document.body.contains(clone)) document.body.removeChild(clone);
                setLoading(false);
            });
        }, 500);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
                <DocumentTextIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Professional CV Generator</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-6 font-hindi">नौकरी के लिए AI की मदद से एक पेशेवर सीवी बनाएं। आप या तो फॉर्म भर सकते हैं या अपना मौजूदा दस्तावेज़ अपलोड कर सकते हैं।</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4 lg:max-h-[70vh] overflow-y-auto pr-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700">Upload Existing CV (Optional)</label>
                        <div className="mt-1 flex justify-center items-center p-4 border-2 border-dashed border-neutral-300 rounded-lg">
                            <div className="text-center">
                                <PaperClipIcon aria-hidden="true" className="mx-auto h-8 w-8 text-neutral-400" />
                                <label htmlFor="file-upload-cv" className="mt-2 text-sm font-medium text-primary cursor-pointer">
                                    {file ? file.name : 'Select a document'}
                                    <input id="file-upload-cv" name="file-upload-cv" type="file" ref={fileInputRef} className="sr-only" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx,.txt" />
                                </label>
                                <p className="text-xs text-neutral-500 mt-1">Image, PDF, DOCX, TXT up to 5MB</p>
                                {file && (
                                    <button onClick={removeFile} aria-label="Remove uploaded file" className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center mx-auto">
                                        <XCircleIcon aria-hidden="true" className="h-4 w-4 mr-1"/> Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-neutral-300" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-2 text-sm text-neutral-500">Or Fill Manually</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700">Full Name</label>
                            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., Priya Singh" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., priya.singh@example.com" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">Phone Number</label>
                        <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +91 98765 43210" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                    </div>
                     <div>
                        <label htmlFor="education" className="block text-sm font-medium text-neutral-700">Education</label>
                        <input type="text" id="education" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g., B.Tech in CS, IIT Delhi" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                    </div>

                    <div>
                        <label htmlFor="objective" className="block text-sm font-medium text-neutral-700">Career Objective / Summary</label>
                        <textarea id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} placeholder="A brief summary of your career goals..." className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"></textarea>
                    </div>

                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-neutral-700">Work Experience</label>
                        <textarea id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} rows={4} placeholder="Company Name - Role - Responsibilities..." className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"></textarea>
                    </div>

                    <div>
                        <label htmlFor="projects" className="block text-sm font-medium text-neutral-700">Projects</label>
                        <textarea id="projects" value={projects} onChange={(e) => setProjects(e.target.value)} rows={4} placeholder="Project Title - Description - Technologies Used..." className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"></textarea>
                    </div>

                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-neutral-700">Skills</label>
                        <input type="text" id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, Node.js, Python, Team Leadership" className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                    </div>

                    <button onClick={handleGenerate} disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-neutral-400">
                        {loading ? 'Generating...' : 'Generate CV (सीवी बनाएं)'}
                    </button>
                </div>
                
                <div className="bg-neutral-50 rounded-lg border border-neutral-200 lg:max-h-[70vh] flex flex-col">
                    {loading && !generatedCV && (
                        <div className="flex items-center justify-center h-full">
                            <Loader message="AI is crafting your professional CV..." />
                        </div>
                    )}

                    {!loading && !generatedCV && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 p-4">
                             <DocumentTextIcon aria-hidden="true" className="h-16 w-16 mb-4 text-neutral-300" />
                            <h3 className="font-semibold text-lg">Your Generated CV will appear here</h3>
                            <p className="text-sm mt-1">Fill the form or upload a document to get started.</p>
                        </div>
                    )}
                    
                    {generatedCV && (
                        <div ref={cvPreviewRef} tabIndex={-1} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-md flex flex-col flex-grow">
                            <div className="p-2 border-b flex flex-col sm:flex-row gap-2 justify-between items-center sticky top-0 bg-neutral-100/80 backdrop-blur-sm z-10 no-print">
                                <div className="flex items-center gap-2">
                                    <select value={paperSize} onChange={e => setPaperSize(e.target.value)} className="text-sm p-1 border rounded-md"><option value="a4">A4</option><option value="letter">Letter</option></select>
                                    <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="text-sm p-1 border rounded-md">{Object.entries(fontOptions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleDownloadPdf} disabled={loading} className="p-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-600 disabled:opacity-50" aria-label="Download as PDF"><ArrowDownTrayIcon aria-hidden="true" className="h-5 w-5" /></button>
                                    <button onClick={handleCopy} className="p-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-md text-neutral-600" aria-label="Copy CV text"><ClipboardIcon aria-hidden="true" className="h-5 w-5" /></button>
                                </div>
                            </div>
                             <div className="flex-grow overflow-y-auto bg-neutral-100 p-4">
                                <div ref={cvContentRef} className="bg-white shadow-lg p-10 sm:p-12 printable-content w-full max-w-4xl mx-auto" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
                                    <div role="article" className="prose prose-sm max-w-none text-neutral-700" style={{ fontFamily }} dangerouslySetInnerHTML={{ __html: generatedCV }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CVGenerator;
