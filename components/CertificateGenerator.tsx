
import React, { useState, useRef } from 'react';
import { generateCertificateText, extractImageFromPdf } from '../services/geminiService';
import { mockStudentDatabase } from '../services/studentService';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';
import { AcademicCapIcon, SparklesIcon, PrinterIcon, ArrowDownTrayIcon, PlusIcon, XCircleIcon, UploadIcon, ShieldCheckIcon, QrCodeIcon } from './icons/AllIcons';
import { useAppConfig } from '../contexts/AppConfigContext';

const ModernTemplate = `
<div style="font-family: 'Poppins', sans-serif; width: 100%; height: 100%; background: #f7f9fc; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
    <div style="width: 100%; height: 100%; border: 10px solid #f97316; background: white; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; text-align: center; position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; font-size: 10vw; font-weight: bold; color: #f97316; z-index: 1; user-select: none;">{{institutionName}}</div>
        <div style="z-index: 2;">
            {{logoElement}}
            <h1 style="font-size: 32px; color: #c2410c; margin: 0;">{{institutionName}}</h1>
            <p style="font-size: 14px; color: #64748b; margin-top: 4px;">An ISO 9001:2015 Certified Institution</p>
            <h2 style="font-size: 28px; color: #f97316; margin-top: 30px; text-transform: uppercase; letter-spacing: 2px;">{{certificateType}}</h2>
            <img src="{{studentPhotoSrc}}" alt="Student Photo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 20px auto; border: 4px solid #fdba74;">
            <p style="font-size: 16px; color: #475569; margin-top: 20px;">This is to certify that</p>
            <p style="font-size: 36px; font-weight: bold; color: #1e293b; margin: 10px 0;">{{studentName}}</p>
            <p style="font-size: 16px; color: #475569;">Roll No: <strong>{{rollNo}}</strong>, Class: <strong>{{className}}</strong></p>
            <p style="font-size: 16px; color: #475569;">Son/Daughter of <strong>{{fatherName}}</strong> and <strong>{{motherName}}</strong></p>
            <p style="font-size: 18px; color: #334155; margin: 30px 0;">{{aiMessage}} for performance in the <strong>{{certificateTitle}}</strong>.</p>
            <div style="margin: 20px auto; max-width: 600px; text-align: left;">
                <h3 style="text-align: center; color: #c2410c; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px;">Performance Details</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead><tr style="background-color: #f1f5f9;">
                        <th style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">Subject</th>
                        <th style="padding: 10px; border: 1px solid #cbd5e1;">Marks Obtained</th>
                        <th style="padding: 10px; border: 1px solid #cbd5e1;">Total Marks</th>
                    </tr></thead>
                    <tbody>{{subjectsTable}}</tbody>
                </table>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 50px; font-size: 14px; color: #475569;">
                <div><p>Date: {{issueDate}}</p></div>
                <div style="text-align: center;">
                    <div style="width: 150px; border-bottom: 1px solid #94a3b8; margin: 40px auto 0;"></div>
                    <p style="margin-top: 5px;">Principal's Signature</p>
                </div>
            </div>
            
            <div style="margin-top: 30px; display: flex; justify-content: center; align-items: center; gap: 10px; opacity: 0.8;">
                <div style="background: #e0f2fe; color: #0284c7; padding: 5px 10px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #0284c7;">
                    BLOCKCHAIN VERIFIED
                </div>
                <p style="font-size: 10px; font-family: monospace; color: #64748b;">Hash: {{blockchainHash}}</p>
            </div>
        </div>
    </div>
</div>`;

const CertificateGenerator: React.FC = () => {
    const toast = useToast();
    const { institutionName } = useAppConfig();
    const [loading, setLoading] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState('');
    const printableRef = useRef<HTMLDivElement>(null);

    const [studentName, setStudentName] = useState(mockStudentDatabase[0].name);
    const [fatherName, setFatherName] = useState(mockStudentDatabase[0].fatherName);
    const [motherName, setMotherName] = useState(mockStudentDatabase[0].motherName);
    const [rollNo, setRollNo] = useState(mockStudentDatabase[0].id);
    const [className, setClassName] = useState(mockStudentDatabase[0].className);
    
    const [certificateType, setCertificateType] = useState('Marksheet / Report Card');
    const [examName, setExamName] = useState('Mid-Term Examination');
    const [subjects, setSubjects] = useState<{ name: string; marks: string; totalMarks: string; }[]>([
        { name: 'HINDI', marks: '78', totalMarks: '100' },
        { name: 'ENGLISH', marks: '62', totalMarks: '100' },
        { name: 'MATHEMATICS', marks: '57', totalMarks: '100' },
        { name: 'SCIENCE', marks: '76', totalMarks: '100' },
        { name: 'SOCIAL SCIENCE', marks: '56', totalMarks: '100' },
    ]);
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isScreenSet, setIsScreenSet] = useState(true);
    const [blockchainHash, setBlockchainHash] = useState('');

    const handleSubjectChange = (index: number, field: 'name' | 'marks' | 'totalMarks', value: string) => {
        const newSubjects = [...subjects];
        newSubjects[index][field] = value;
        setSubjects(newSubjects);
    };

    const addSubjectRow = () => {
        setSubjects([...subjects, { name: '', marks: '', totalMarks: '100' }]);
    };

    const removeSubjectRow = (index: number) => {
        if (subjects.length <= 1) return;
        const newSubjects = subjects.filter((_, i) => i !== index);
        setSubjects(newSubjects);
    };

    const handleGenerate = async () => {
        if (!studentName.trim() || !examName.trim()) {
            toast.error("Please fill required fields.");
            return;
        }

        setLoading(true);
        setGeneratedHtml('');
        
        const fakeHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        setBlockchainHash(fakeHash);

        try {
            const aiMessage = await generateCertificateText(
                certificateType,
                studentName,
                examName,
                subjects.map(s => ({...s, marks: Number(s.marks), totalMarks: Number(s.totalMarks)}))
            );
            
            const photoUrl = studentPhoto ? URL.createObjectURL(studentPhoto) : 'https://placehold.co/150x150/png?text=Photo';
            const logoUrl = logoFile ? URL.createObjectURL(logoFile) : '';
            const logoElementHtml = logoFile ? `<img src="${logoUrl}" alt="School Logo" style="height: 60px; margin: 0 auto 15px; display: block; object-fit: contain;">` : '';

            const subjectsTableHtml = subjects.map(s => `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${s.name}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.marks}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.totalMarks}</td>
                </tr>
            `).join('');

            let templateHtml = ModernTemplate; 
            
            let finalHtml = templateHtml
                .replace(/{{logoElement}}/g, logoElementHtml)
                .replace(/{{studentName}}/g, studentName)
                .replace(/{{fatherName}}/g, fatherName)
                .replace(/{{motherName}}/g, motherName)
                .replace(/{{rollNo}}/g, rollNo)
                .replace(/{{className}}/g, className)
                .replace(/{{certificateTitle}}/g, examName)
                .replace(/{{certificateType}}/g, certificateType)
                .replace(/{{issueDate}}/g, new Date(issueDate).toLocaleDateString())
                .replace(/{{studentPhotoSrc}}/g, photoUrl)
                .replace(/{{aiMessage}}/g, aiMessage)
                .replace(/{{subjectsTable}}/g, subjectsTableHtml)
                .replace(/{{institutionName}}/g, institutionName)
                .replace(/{{blockchainHash}}/g, fakeHash);
            
            setGeneratedHtml(finalHtml);
            toast.success("Certificate generated with Blockchain verification!");

        } catch (error) {
            console.error("Certificate generation failed:", error);
            toast.error("Generation failed.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => window.print();
    
    const handleDownloadPdf = () => {
        if (!printableRef.current) return;
        
        const jspdf = (window as any).jspdf;
        const html2canvas = (window as any).html2canvas;

        if (!jspdf || !html2canvas) {
          toast.error("PDF libraries are still loading. Please try again in a few seconds.");
          return;
        }

        setLoading(true);
        toast.info("Generating High-Quality PDF...");
        
        const { jsPDF } = jspdf;
        
        html2canvas(printableRef.current, { 
            scale: 2, 
            useCORS: true,
            logging: false 
        }).then((canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${studentName.replace(/\s+/g,'_')}_Certificate.pdf`);
            
            setLoading(false);
            toast.success('Certificate Downloaded!');
        }).catch((err: any) => {
            console.error("PDF Gen Error", err);
            toast.error("Failed to generate PDF.");
            setLoading(false);
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
                <AcademicCapIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Blockchain Certificate Generator</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-6">Generate tamper-proof certificates secured by blockchain technology.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                     <div className="p-3 border rounded-md space-y-3 bg-neutral-50">
                        <h4 className="text-sm font-bold text-neutral-800">Student Details</h4>
                        <input type="text" placeholder="Student Name" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full p-2 border rounded text-sm"/>
                        <input type="text" placeholder="Exam Name" value={examName} onChange={e => setExamName(e.target.value)} className="w-full p-2 border rounded text-sm"/>
                    </div>
                    
                    <div className="space-y-3 p-3 border rounded-md">
                        <h4 className="text-sm font-medium text-neutral-700 mb-2">Subjects & Marks</h4>
                        {subjects.map((subject, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <input type="text" value={subject.name} onChange={e => handleSubjectChange(index, 'name', e.target.value)} placeholder="Subject" className="col-span-5 p-1 border rounded text-sm"/>
                                <input type="number" value={subject.marks} onChange={e => handleSubjectChange(index, 'marks', e.target.value)} placeholder="Marks" className="col-span-3 p-1 border rounded text-sm"/>
                                <button onClick={() => removeSubjectRow(index)} className="col-span-1 text-red-500"><XCircleIcon className="h-4 w-4"/></button>
                            </div>
                        ))}
                        <button onClick={addSubjectRow} className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-primary font-semibold hover:bg-primary/10 p-1 rounded-md">
                            <PlusIcon className="h-4 w-4"/> Add Subject
                        </button>
                    </div>

                    <button onClick={handleGenerate} disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-neutral-400">
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        {loading ? 'Minting...' : 'Generate & Mint'}
                    </button>
                </div>

                <div className="lg:col-span-2">
                     <div className="flex justify-between items-center mb-4 no-print">
                        <div className="flex items-center gap-2">
                             <input type="checkbox" id="screen-set" checked={isScreenSet} onChange={() => setIsScreenSet(!isScreenSet)} />
                             <label htmlFor="screen-set" className="text-sm">Fit to Screen</label>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrint} disabled={!generatedHtml} className="p-2 border rounded-md text-sm font-medium disabled:opacity-50 hover:bg-slate-50"><PrinterIcon className="h-5 w-5"/></button>
                            <button onClick={handleDownloadPdf} disabled={!generatedHtml} className="p-2 border rounded-md text-sm font-medium disabled:opacity-50 hover:bg-slate-50 text-blue-600"><ArrowDownTrayIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                     <div className={isScreenSet ? 'w-full' : 'w-full bg-neutral-200 p-4'}>
                        {loading && !generatedHtml && <Loader message="Securing on Blockchain..." />}
                        {!loading && !generatedHtml && <div className="text-center text-neutral-500 py-20">Certificate preview will appear here.</div>}
                        {generatedHtml && (
                             <div ref={printableRef} className={`printable-content ${isScreenSet ? 'aspect-[297/210]' : ''} w-full bg-white shadow-lg`}>
                                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateGenerator;
