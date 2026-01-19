
import React, { useState, useEffect } from 'react';
import { HeartIcon, UsersIcon, PlusIcon, MagnifyingGlassIcon, ClipboardDocumentCheckIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { User } from '../types';
import { studentService } from '../services/studentService';

interface MedicalRecord {
    studentId: string;
    studentName: string;
    bloodGroup: string;
    allergies: string;
    medications: string;
    visits: VisitLog[];
}

interface VisitLog {
    date: string;
    symptom: string;
    treatment: string;
    restGiven: boolean;
}

const InfirmaryManagement: React.FC<{ user: User }> = ({ user }) => {
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<MedicalRecord | null>(null);
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'list' | 'log'>('list');

    // Visit Form State
    const [visitSymptom, setVisitSymptom] = useState('');
    const [visitTreatment, setVisitTreatment] = useState('');
    const [visitRest, setVisitRest] = useState(false);

    useEffect(() => {
        // Initialize mock data from student service
        const students = studentService.getStudents();
        const mockRecords: MedicalRecord[] = students.map(s => ({
            studentId: s.id,
            studentName: s.name,
            bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
            allergies: Math.random() > 0.8 ? 'Peanuts' : 'None',
            medications: 'None',
            visits: Math.random() > 0.7 ? [{ date: '2024-08-10', symptom: 'Fever', treatment: 'Paracetamol', restGiven: true }] : []
        }));
        setRecords(mockRecords);
    }, []);

    const handleLogVisit = () => {
        if (!selectedStudent || !visitSymptom || !visitTreatment) {
            toast.error("Please details of the visit.");
            return;
        }
        const newVisit: VisitLog = {
            date: new Date().toISOString().split('T')[0],
            symptom: visitSymptom,
            treatment: visitTreatment,
            restGiven: visitRest
        };
        
        const updatedRecords = records.map(r => 
            r.studentId === selectedStudent.studentId 
                ? { ...r, visits: [newVisit, ...r.visits] } 
                : r
        );
        
        setRecords(updatedRecords);
        setSelectedStudent({ ...selectedStudent, visits: [newVisit, ...selectedStudent.visits] });
        toast.success("Medical visit logged.");
        setVisitSymptom('');
        setVisitTreatment('');
        setVisitRest(false);
    };

    const filteredRecords = records.filter(r => 
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                        <HeartIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">Infirmary (Health Center)</h2>
                        <p className="text-sm text-neutral-500 font-hindi">स्वास्थ्य और चिकित्सा रिकॉर्ड</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Student List */}
                <div className="lg:col-span-1 bg-slate-50 border rounded-xl p-4 flex flex-col h-[600px]">
                    <div className="relative mb-4">
                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Search Student..." 
                            className="w-full pl-10 p-2 border rounded-lg"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredRecords.map(record => (
                            <button 
                                key={record.studentId}
                                onClick={() => setSelectedStudent(record)}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedStudent?.studentId === record.studentId ? 'bg-white border-red-400 shadow-md' : 'bg-white border-transparent hover:bg-slate-100'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-slate-800">{record.studentName}</p>
                                        <p className="text-xs text-slate-500">{record.studentId}</p>
                                    </div>
                                    <span className="text-xs font-bold bg-red-50 text-red-600 px-2 py-1 rounded">{record.bloodGroup}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="lg:col-span-2">
                    {selectedStudent ? (
                        <div className="h-full flex flex-col">
                            <div className="bg-red-50 border border-red-100 p-6 rounded-xl mb-6">
                                <h3 className="text-xl font-bold text-red-900 mb-4">{selectedStudent.studentName} - Medical Profile</h3>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Blood Group</p>
                                        <p className="text-lg font-mono font-semibold">{selectedStudent.bloodGroup}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Allergies</p>
                                        <p className={`font-semibold ${selectedStudent.allergies !== 'None' ? 'text-red-600' : 'text-green-600'}`}>{selectedStudent.allergies}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Ongoing Meds</p>
                                        <p className="font-semibold text-slate-700">{selectedStudent.medications}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border rounded-xl p-6 flex-1 flex flex-col">
                                <div className="flex gap-4 border-b mb-4">
                                    <button onClick={() => setActiveTab('list')} className={`pb-2 px-1 font-semibold text-sm border-b-2 ${activeTab === 'list' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500'}`}>Visit History</button>
                                    <button onClick={() => setActiveTab('log')} className={`pb-2 px-1 font-semibold text-sm border-b-2 ${activeTab === 'log' ? 'border-red-500 text-red-600' : 'border-transparent text-slate-500'}`}>Log New Visit</button>
                                </div>

                                {activeTab === 'list' ? (
                                    <div className="flex-1 overflow-y-auto">
                                        {selectedStudent.visits.length === 0 ? (
                                            <p className="text-center text-slate-400 py-10">No past medical visits recorded.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedStudent.visits.map((v, i) => (
                                                    <div key={i} className="p-3 border rounded-lg bg-slate-50">
                                                        <div className="flex justify-between mb-1">
                                                            <span className="font-bold text-slate-800">{v.symptom}</span>
                                                            <span className="text-xs text-slate-500">{v.date}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-600">Treatment: {v.treatment}</p>
                                                        {v.restGiven && <span className="inline-block mt-2 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Sent to Sick Room</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Symptoms</label>
                                            <input type="text" value={visitSymptom} onChange={e => setVisitSymptom(e.target.value)} className="w-full p-2 border rounded-md mt-1" placeholder="e.g. Headache, Stomach Pain" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Treatment Given</label>
                                            <input type="text" value={visitTreatment} onChange={e => setVisitTreatment(e.target.value)} className="w-full p-2 border rounded-md mt-1" placeholder="e.g. ORS, Rest, Bandage" />
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={visitRest} onChange={e => setVisitRest(e.target.checked)} className="rounded text-red-600 focus:ring-red-500"/>
                                            <span className="text-sm font-medium text-slate-700">Admit to Sick Room for Rest</span>
                                        </label>
                                        <button onClick={handleLogVisit} className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700">
                                            Record Visit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-xl">
                            <ClipboardDocumentCheckIcon className="h-16 w-16 opacity-20 mb-4" />
                            <p>Select a student to view medical records.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfirmaryManagement;
