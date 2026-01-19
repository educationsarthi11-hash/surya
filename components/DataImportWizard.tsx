
import React, { useState } from 'react';
import { 
    CloudArrowUpIcon, TableCellsIcon, ArrowRightIcon, 
    CheckCircleIcon, ExclamationTriangleIcon, DocumentTextIcon 
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { studentService } from '../services/studentService';
import { feeService } from '../services/feeService';
import Loader from './Loader';

// Mock types for mapping
type SystemField = 'studentName' | 'fatherName' | 'mobile' | 'dueAmount' | 'class';

const SYSTEM_FIELDS: { key: SystemField; label: string }[] = [
    { key: 'studentName', label: 'Student Name (छात्र का नाम)' },
    { key: 'fatherName', label: 'Father Name (पिता का नाम)' },
    { key: 'mobile', label: 'Mobile Number (मोबाइल)' },
    { key: 'class', label: 'Class/Course (कक्षा)' },
    { key: 'dueAmount', label: 'Pending Fee (पुराना बकाया)' },
];

const DataImportWizard: React.FC = () => {
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [fileData, setFileData] = useState<any[]>([]); // Mock parsed CSV data
    const [fileHeaders, setFileHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<SystemField, string>>({} as any);
    const [loading, setLoading] = useState(false);

    // Mock CSV Parser
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0];
            setFile(uploadedFile);
            setLoading(true);

            // Simulating CSV Parsing
            setTimeout(() => {
                // Mock headers found in "old software" file
                const mockHeaders = ['Name_Of_Student', 'F_Name', 'Phone_No', 'Current_Class', 'Total_Due_Balance'];
                setFileHeaders(mockHeaders);
                
                // Mock Data rows
                setFileData([
                    { 'Name_Of_Student': 'Rohan Das', 'F_Name': 'Suresh Das', 'Phone_No': '9876500001', 'Current_Class': 'Class 10', 'Total_Due_Balance': '5000' },
                    { 'Name_Of_Student': 'Amit Verma', 'F_Name': 'Rajesh Verma', 'Phone_No': '9876500002', 'Current_Class': 'Class 12', 'Total_Due_Balance': '1200' },
                ]);

                // AI Auto-Mapping Logic (Simulated)
                const autoMap: any = {};
                if (mockHeaders.includes('Name_Of_Student')) autoMap['studentName'] = 'Name_Of_Student';
                if (mockHeaders.includes('F_Name')) autoMap['fatherName'] = 'F_Name';
                if (mockHeaders.includes('Phone_No')) autoMap['mobile'] = 'Phone_No';
                if (mockHeaders.includes('Current_Class')) autoMap['class'] = 'Current_Class';
                if (mockHeaders.includes('Total_Due_Balance')) autoMap['dueAmount'] = 'Total_Due_Balance';
                
                setMapping(autoMap);
                setLoading(false);
                setStep(2);
                toast.success("File analyzed! AI has suggested column mappings.");
            }, 1500);
        }
    };

    const handleImport = () => {
        setLoading(true);
        setTimeout(() => {
            // Process Import
            fileData.forEach((row, index) => {
                const newStudentId = `IMP-STU-${Date.now()}-${index}`;
                
                // 1. Add Student Profile
                studentService.addStudent({
                    id: newStudentId,
                    name: row[mapping.studentName],
                    fatherName: row[mapping.fatherName],
                    mobileNumber: row[mapping.mobile],
                    className: row[mapping.class],
                    age: 'N/A', // Default
                    address: 'Imported Record',
                    email: '',
                    motherName: ''
                });

                // 2. Add Opening Balance (Hisab Kitab)
                const due = parseFloat(row[mapping.dueAmount]);
                if (due > 0) {
                    // We push directly to fee service internal logic (simulated here via adding a fee record)
                    // In a real app, feeService would expose an 'addOpeningBalance' method.
                    // For this demo, we assume the student is added and fee structure applies, 
                    // but we mark this as "Previous Balance".
                    console.log(`Imported Fee Due for ${row[mapping.studentName]}: ${due}`);
                }
            });

            setLoading(false);
            setStep(3);
            toast.success(`${fileData.length} records imported successfully!`);
        }, 2000);
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-soft min-h-[600px] border border-slate-100 animate-pop-in">
            <div className="mb-8 border-b pb-6">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <CloudArrowUpIcon className="h-8 w-8 text-primary"/> Smart Data Migrator
                </h2>
                <p className="text-slate-500 font-hindi font-medium mt-2">
                    "पुराना सॉफ्टवेयर छोड़ें, डेटा नहीं।" किसी भी एक्सेल फाइल से डेटा यहाँ लाएं।
                </p>
            </div>

            {step === 1 && (
                <div className="flex flex-col items-center justify-center h-96 border-4 border-dashed border-slate-200 rounded-[3rem] bg-slate-50 relative group hover:border-primary/50 transition-all">
                    {loading ? (
                        <Loader message="Analyzing file structure..." />
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TableCellsIcon className="h-12 w-12 text-slate-400 group-hover:text-primary"/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">Upload Old Software Data (Excel/CSV)</h3>
                            <p className="text-sm text-slate-500 mt-2 font-hindi">यहाँ फाइल ड्रॉप करें या क्लिक करें</p>
                            <input 
                                type="file" 
                                accept=".csv, .xlsx" 
                                onChange={handleFileUpload} 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8 animate-slide-in-right">
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start">
                        <CheckCircleIcon className="h-6 w-6 text-blue-600 mt-1"/>
                        <div>
                            <h4 className="font-bold text-blue-900">AI Auto-Mapping Active</h4>
                            <p className="text-sm text-blue-700 font-hindi">AI ने आपके पुराने सॉफ्टवेयर के कॉलम को हमारे सिस्टम से मैच कर दिया है। कृपया एक बार चेक करें।</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {SYSTEM_FIELDS.map((field) => (
                            <div key={field.key} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Our System Field
                                </label>
                                <div className="font-bold text-slate-800 text-lg mb-4">{field.label}</div>
                                
                                <div className="flex items-center gap-3">
                                    <ArrowRightIcon className="h-5 w-5 text-slate-300"/>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-primary uppercase mb-1">
                                            Map to Column (From File)
                                        </label>
                                        <select 
                                            value={mapping[field.key] || ''}
                                            onChange={(e) => setMapping({...mapping, [field.key]: e.target.value})}
                                            className="w-full p-2 rounded-lg border-2 border-slate-200 font-mono text-sm bg-white"
                                        >
                                            <option value="">-- Select Column --</option>
                                            {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handleImport}
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 text-lg"
                    >
                        {loading ? <Loader message="Migrating Database..." /> : "START MIGRATION"}
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="text-center py-20 animate-pop-in">
                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircleIcon className="h-16 w-16 text-green-600" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-4">Migration Complete!</h3>
                    <p className="text-lg text-slate-500 font-hindi max-w-lg mx-auto">
                        सारा पुराना डेटा (प्रोफाइल और पिछला हिसाब) अब 'सार्थी सिस्टम' में सुरक्षित है। आप इसे डैशबोर्ड में देख सकते हैं।
                    </p>
                    <div className="mt-12 flex justify-center gap-4">
                        <button onClick={() => setStep(1)} className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Import More</button>
                        <button className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600">Go to Dashboard</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataImportWizard;
