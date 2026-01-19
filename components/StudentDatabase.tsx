
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StudentData, AcademicRecord, SubjectResult } from '../types';
import { UsersIcon, PlusIcon, ArrowLeftIcon, XCircleIcon, DocumentTextIcon, EnvelopeIcon, PhoneIcon, WhatsAppIcon, SparklesIcon, PrinterIcon, FolderIcon, ArrowDownTrayIcon, ArchiveBoxIcon, UploadIcon, KeyIcon } from './icons/AllIcons';
import { academicService } from '../services/academicService';
import { useToast } from '../hooks/useToast';
import { feeService } from '../services/feeService';
import { studentService } from '../services/studentService';
import MessageModal from './MessageModal';
import { generateStudentReport } from '../services/geminiService';
import Loader from './Loader';

type View = 'list' | 'profile';

// Mock Document Interface
interface StudentDocument {
    id: string;
    title: string;
    type: string;
    date: string;
    url?: string; // In a real app, this would be a file URL
}

// Mock Documents for Demo
const mockDocuments: StudentDocument[] = [
    { id: 'doc1', title: 'Class 10 Marksheet', type: 'Marksheet', date: '2023-05-15' },
    { id: 'doc2', title: 'Transfer Certificate (TC)', type: 'Certificate', date: '2023-04-10' },
    { id: 'doc3', title: 'Character Certificate', type: 'Certificate', date: '2023-04-10' },
    { id: 'doc4', title: 'Sports Merit Certificate', type: 'Award', date: '2022-12-20' },
];

const MemoizedStudentRow: React.FC<{ student: StudentData; onViewProfile: (student: StudentData) => void; onMessage: (student: StudentData) => void; onSendCreds: (student: StudentData) => void; formatPhoneNumberForWhatsApp: (phone: string) => string; }> = React.memo(({ student, onViewProfile, onMessage, onSendCreds, formatPhoneNumberForWhatsApp }) => {
    return (
        <tr key={student.id}>
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                         {student.photoUrl ? (
                             <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
                         ) : (
                             <UsersIcon className="h-4 w-4 text-slate-400"/>
                         )}
                    </div>
                    <div>
                        <div className="font-medium text-neutral-900">{student.name}</div>
                        <div className="text-xs font-mono text-neutral-500">{student.id}</div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">{student.className}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">
                <div className="flex items-center">
                    <span>{student.mobileNumber}</span>
                    <div className="inline-flex gap-2 ml-2">
                        <a href={`tel:${student.mobileNumber}`} title="Call" className="text-neutral-500 hover:text-primary"><PhoneIcon className="h-4 w-4"/></a>
                        <a href={`sms:${student.mobileNumber}`} title="Send SMS" className="text-neutral-500 hover:text-primary"><EnvelopeIcon className="h-4 w-4"/></a>
                        <a href={`https://wa.me/${formatPhoneNumberForWhatsApp(student.mobileNumber)}`} target="_blank" rel="noopener noreferrer" title="Send WhatsApp" className="text-neutral-500 hover:text-green-500"><WhatsAppIcon className="h-4 w-4"/></a>
                    </div>
                </div>
                <div className="text-xs text-neutral-500">{student.email}</div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-4">
                <button onClick={() => onViewProfile(student)} className="text-primary hover:underline">View</button>
                <button onClick={() => onMessage(student)} className="text-secondary hover:underline">Message</button>
                <button 
                    onClick={() => onSendCreds(student)} 
                    className="text-slate-500 hover:text-orange-600 flex items-center gap-1"
                    title="Send Parent Login Credentials"
                >
                    <KeyIcon className="h-4 w-4"/> Login
                </button>
            </td>
        </tr>
    );
});


const StudentDatabase: React.FC = () => {
    const [studentList, setStudentList] = useState(studentService.getStudents());
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<View>('list');
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
    const [studentRecords, setStudentRecords] = useState<AcademicRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messagingStudent, setMessagingStudent] = useState<StudentData | null>(null);
    
    // Profile Tabs
    const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'documents'>('overview');
    const [documents, setDocuments] = useState<StudentDocument[]>(mockDocuments); // Mock data
    
    const toast = useToast();

    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [aiReportHtml, setAiReportHtml] = useState<string | null>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribe = studentService.subscribe(() => {
            setStudentList([...studentService.getStudents()]);
        });
        const unsubscribeAcademic = academicService.subscribe(() => {
            if (selectedStudent) {
                setStudentRecords([...academicService.getRecordsForStudent(selectedStudent.id)]);
            }
        });

        return () => {
            unsubscribe();
            unsubscribeAcademic();
        };
    }, [selectedStudent]);

    const handleViewProfile = useCallback((student: StudentData) => {
        setSelectedStudent(student);
        setStudentRecords(academicService.getRecordsForStudent(student.id));
        setAiReportHtml(null); // Reset report when changing profile
        setActiveProfileTab('overview'); // Reset tab
        setView('profile');
    }, []);

    const handleOpenMessageModal = useCallback((student: StudentData) => {
        setMessagingStudent(student);
        setIsMessageModalOpen(true);
    }, []);
    
    // Simulate Sending Parent Login Credentials
    const handleSendParentCredentials = useCallback((student: StudentData) => {
        const parentName = student.fatherName || "Guardian";
        const msg = `Login Credentials sent to ${parentName} on ${student.mobileNumber}.`;
        
        console.log("--- SIMULATING PARENT LOGIN SMS ---");
        console.log(`To: ${student.mobileNumber}`);
        console.log(`Msg: Hello ${parentName}, track ${student.name}'s progress. Login at: educationsarthi.com/login?u=${student.id}&role=parent`);
        console.log("-----------------------------------");
        
        toast.success(msg);
    }, [toast]);
    
    const handleGenerateReport = async () => {
        if (!selectedStudent) return;
        
        setIsGeneratingReport(true);
        setAiReportHtml(null);
        
        try {
            const studentData = {
                profile: selectedStudent,
                academics: studentRecords,
                fees: feeService.getFeeSummaryForStudent(selectedStudent.id),
            };
            const report = await generateStudentReport(studentData);
            setAiReportHtml(report);
            toast.success("AI Student Report generated successfully!");
        } catch (error) {
            console.error("Failed to generate AI report:", error);
            toast.error("Could not generate the AI report.");
        } finally {
            setIsGeneratingReport(false);
        }
    };
    
    const handlePrintReport = () => {
        window.print();
    };
    
    const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newDoc: StudentDocument = {
                id: `doc-${Date.now()}`,
                title: file.name,
                type: 'Uploaded Record',
                date: new Date().toISOString().split('T')[0]
            };
            setDocuments([newDoc, ...documents]);
            toast.success(`${file.name} uploaded to archive.`);
        }
    };

    const formatPhoneNumberForWhatsApp = useCallback((phone: string) => {
        let cleaned = phone.replace(/\D/g, ''); // Remove all non-digit characters
        if (cleaned.length === 10 && !cleaned.startsWith('91')) {
            cleaned = '91' + cleaned;
        }
        return cleaned;
    }, []);

    const filteredStudents = studentList.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.mobileNumber.includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderListView = () => (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name, ID, mobile, or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-72 p-2 border rounded-md shadow-sm border-neutral-300 focus:ring-primary focus:border-primary"
                    aria-label="Search student database"
                />
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary-dark"
                >
                    <PlusIcon className="h-5 w-5" /> Add Academic Record
                </button>
            </div>
            <p className="text-sm text-neutral-600 mb-6">A centralized view of all student records in the system.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Student</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Class</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Contact</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {filteredStudents.map(student => (
                            <MemoizedStudentRow
                                key={student.id}
                                student={student}
                                onViewProfile={handleViewProfile}
                                onMessage={handleOpenMessageModal}
                                onSendCreds={handleSendParentCredentials}
                                formatPhoneNumberForWhatsApp={formatPhoneNumberForWhatsApp}
                            />
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">No students found matching your search.</div>
                )}
            </div>
        </>
    );

    const renderProfileView = () => {
        if (!selectedStudent) return null;
        const feeSummary = feeService.getFeeSummaryForStudent(selectedStudent.id);
        
        return (
            <div className="animate-pop-in">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-4">
                    <button onClick={() => setView('list')} className="inline-flex items-center gap-2 px-3 py-1 border rounded-md text-sm hover:bg-neutral-50 no-print">
                        <ArrowLeftIcon className="h-4 w-4" /> Back to Student List
                    </button>
                    {selectedStudent && (
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto no-print">
                            <button
                                onClick={() => handleSendParentCredentials(selectedStudent)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 font-semibold rounded-md shadow-sm hover:bg-orange-200 border border-orange-300"
                            >
                                <KeyIcon className="h-5 w-5" /> Send Login to Parent
                            </button>
                            <button
                                onClick={() => handleOpenMessageModal(selectedStudent)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white font-semibold rounded-md shadow-sm hover:bg-secondary-dark"
                            >
                                <EnvelopeIcon className="h-5 w-5" /> Send Message
                            </button>
                             <button
                                onClick={handleGenerateReport}
                                disabled={isGeneratingReport}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-md shadow-sm hover:bg-accent-dark disabled:opacity-50"
                            >
                                <SparklesIcon className="h-5 w-5" /> {isGeneratingReport ? 'Generating...' : 'Generate AI Student Report'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-neutral-50 p-8 rounded-2xl border border-slate-200">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Photo Section */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white mb-4">
                                {selectedStudent.photoUrl ? (
                                    <img src={selectedStudent.photoUrl} alt={selectedStudent.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                        <UsersIcon className="h-20 w-20"/>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 font-mono">{selectedStudent.id}</p>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1">
                            <h3 className="text-3xl font-black text-neutral-900 mb-6">{selectedStudent.name}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Class</p>
                                    <p className="font-semibold text-lg">{selectedStudent.className}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                                    <p className="flex items-center gap-2 font-medium">
                                        {selectedStudent.mobileNumber}
                                        <span className="inline-flex gap-2 no-print ml-2">
                                            <a href={`tel:${selectedStudent.mobileNumber}`} title="Call" className="text-neutral-400 hover:text-primary"><PhoneIcon className="h-4 w-4"/></a>
                                            <a href={`https://wa.me/${formatPhoneNumberForWhatsApp(selectedStudent.mobileNumber)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-neutral-400 hover:text-green-500"><WhatsAppIcon className="h-4 w-4"/></a>
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Father's Name</p>
                                    <p className="font-medium">{selectedStudent.fatherName}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mother's Name</p>
                                    <p className="font-medium">{selectedStudent.motherName}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Address</p>
                                    <p className="font-medium">{selectedStudent.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b mt-10 mb-6">
                        <button
                            onClick={() => setActiveProfileTab('overview')}
                            className={`px-6 py-3 text-sm font-bold tracking-wide uppercase ${activeProfileTab === 'overview' ? 'text-primary border-b-4 border-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveProfileTab('documents')}
                            className={`px-6 py-3 text-sm font-bold tracking-wide uppercase flex items-center gap-2 ${activeProfileTab === 'documents' ? 'text-primary border-b-4 border-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            <ArchiveBoxIcon className="h-4 w-4"/> Documents
                        </button>
                    </div>
                    
                    {activeProfileTab === 'overview' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-lg mb-4 text-slate-800">Academic Summary</h4>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Recent Performance</p>
                                        {studentRecords.length > 0 ? (
                                            <ul className="space-y-3">
                                                {studentRecords.slice(0, 3).map(rec => (
                                                    <li key={rec.recordId} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                                                        <span className="font-medium text-slate-700">{rec.examName}</span>
                                                        <span className="font-black text-primary bg-primary/5 px-2 py-1 rounded">{rec.overallPercentage}%</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p className="text-sm text-neutral-400 italic">No academic records found.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-4 text-slate-800">Fee Status</h4>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Due</span>
                                            <span className="text-2xl font-black text-slate-900">₹{feeSummary.totalDue.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 font-medium">Current Status</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${feeSummary.status === 'Paid' ? 'bg-green-100 text-green-800' : feeSummary.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {feeSummary.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Report Section */}
                            {isGeneratingReport && <div className="mt-8 p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white text-center"><Loader message="AI is analyzing performance and generating report..."/></div>}
                            {aiReportHtml && (
                                <div className="mt-8 p-8 bg-white rounded-3xl border border-slate-200 shadow-lg animate-pop-in printable-content" ref={reportRef}>
                                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                                        <h3 className="text-xl font-black text-primary flex items-center gap-3 uppercase tracking-tight">
                                            <SparklesIcon className="h-6 w-6"/> AI Student Progress Report
                                        </h3>
                                        <button onClick={handlePrintReport} className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-200 no-print transition-colors"><PrinterIcon className="h-5 w-5 text-neutral-600"/></button>
                                    </div>
                                    <div className="prose prose-sm max-w-none text-slate-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: aiReportHtml }} />
                                </div>
                            )}
                        </>
                    ) : (
                        /* Documents Tab Content */
                        <div className="mt-4 animate-pop-in">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-lg text-neutral-800">Document Repository</h4>
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        className="hidden" 
                                        onChange={handleUploadDocument}
                                        accept="application/pdf,image/*"
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-md transition-all"
                                    >
                                        <UploadIcon className="h-4 w-4" /> Upload Record
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="group bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-lg transition-all relative hover:border-primary/30">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                                <FolderIcon className="h-8 w-8" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-sm text-neutral-900 truncate" title={doc.title}>{doc.title}</h5>
                                                <p className="text-xs text-neutral-500 mt-1 font-medium">{doc.type} • {doc.date}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-2 border-t pt-4">
                                            <button className="flex-1 text-xs font-bold text-slate-500 hover:text-primary flex items-center justify-center gap-1 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                                                <DocumentTextIcon className="h-3.5 w-3.5" /> View
                                            </button>
                                            <div className="w-px bg-slate-200 my-1"></div>
                                            <button className="flex-1 text-xs font-bold text-slate-500 hover:text-primary flex items-center justify-center gap-1 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                                                <PrinterIcon className="h-3.5 w-3.5" /> Print
                                            </button>
                                            <div className="w-px bg-slate-200 my-1"></div>
                                            <button className="flex-1 text-xs font-bold text-slate-500 hover:text-primary flex items-center justify-center gap-1 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                                                <ArrowDownTrayIcon className="h-3.5 w-3.5" /> Save
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-6">
                <UsersIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Student Database</h2>
                    <p className="text-sm text-neutral-500 font-hindi">छात्रों का विवरण देखें और प्रबंधित करें</p>
                </div>
            </div>

            {view === 'list' ? renderListView() : renderProfileView()}

            {/* Add Record Modal (Mock) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">Add Academic Record</h3>
                        <p className="text-sm text-neutral-500 mb-4">This feature allows adding new exam results. (Mock Interface)</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-neutral-200 rounded-md text-sm">Cancel</button>
                            <button onClick={() => { toast.success("Record added!"); setIsModalOpen(false); }} className="px-4 py-2 bg-primary text-white rounded-md text-sm">Save Record</button>
                        </div>
                    </div>
                </div>
            )}

            {isMessageModalOpen && messagingStudent && (
                <MessageModal
                    student={messagingStudent}
                    onClose={() => { setIsMessageModalOpen(false); setMessagingStudent(null); }}
                />
            )}
        </div>
    );
};

export default StudentDatabase;
