import { AcademicRecord } from '../types';

const MOCK_ACADEMIC_RECORDS: AcademicRecord[] = [
    {
        recordId: 'REC-001',
        studentId: 'ESS-STU-001', // Aarav Sharma
        examName: 'Mid-Term Examination 2024',
        date: '2024-05-15',
        results: [
            { subject: 'Science', marksObtained: 88, totalMarks: 100 },
            { subject: 'Mathematics', marksObtained: 92, totalMarks: 100 },
            { subject: 'English', marksObtained: 76, totalMarks: 100 },
        ],
        overallPercentage: 85.3,
        comments: 'Excellent performance in Mathematics. Needs to focus more on creative writing in English.'
    },
    {
        recordId: 'REC-002',
        studentId: 'ESS-STU-002', // Priya Patel
        examName: 'Mid-Term Examination 2024',
        date: '2024-05-15',
        results: [
            { subject: 'Science', marksObtained: 95, totalMarks: 100 },
            { subject: 'Mathematics', marksObtained: 89, totalMarks: 100 },
            { subject: 'Social Studies', marksObtained: 91, totalMarks: 100 },
        ],
        overallPercentage: 91.7,
        comments: 'Outstanding performance across all subjects. A very diligent student.'
    }
];

let records: AcademicRecord[] = [...MOCK_ACADEMIC_RECORDS];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const academicService = {
    getAllRecords: (): AcademicRecord[] => records,

    getRecordsForStudent: (studentId: string): AcademicRecord[] => {
        return records.filter(r => r.studentId === studentId)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    addRecord: (record: Omit<AcademicRecord, 'recordId' | 'overallPercentage'>): void => {
        const totalMarksObtained = record.results.reduce((sum, r) => sum + r.marksObtained, 0);
        const totalMaxMarks = record.results.reduce((sum, r) => sum + r.totalMarks, 0);
        const overallPercentage = totalMaxMarks > 0 ? parseFloat(((totalMarksObtained / totalMaxMarks) * 100).toFixed(2)) : 0;

        const newRecord: AcademicRecord = {
            ...record,
            recordId: `REC-${Date.now()}`,
            overallPercentage,
        };
        records = [newRecord, ...records];
        notifyListeners();
    },

    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};