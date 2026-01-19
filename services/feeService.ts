
import { FeeRecord, FeeStatus, StudentData } from '../types';
import { studentService } from './studentService';

const STORAGE_KEY = 'edu_sarthi_fees_v1';

const feeStructures: { [className: string]: { tuition: number, annual: number } } = {
    'Class 8': { tuition: 2500, annual: 5000 },
    'Class 10': { tuition: 3000, annual: 6000 },
    'Class 6': { tuition: 2000, annual: 4500 },
    'Class 12': { tuition: 4000, annual: 7500 },
    'default': { tuition: 2500, annual: 5000 } 
};

const loadFeeRecords = (): FeeRecord[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

let feeRecords: FeeRecord[] = loadFeeRecords(); 
let listeners: (() => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

const saveToStorage = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(feeRecords));
    } catch (e) {
        console.error("Failed to save fees", e);
    }
};

export const feeService = {
    getAllFeeRecords: (): FeeRecord[] => feeRecords,
    
    getFeeRecordsForStudent: (studentId: string): FeeRecord[] => {
        return feeRecords.filter(r => r.studentId === studentId);
    },

    generateFeesForNewStudent: (student: StudentData): void => {
         if (feeRecords.some(r => r.studentId === student.id)) return;

         const structure = feeStructures[student.className] || feeStructures['default'];
         const today = new Date();
         const newRecords: FeeRecord[] = [];

         newRecords.push({
             id: `FEE-${student.id}-ADM`,
             studentId: student.id,
             description: `Admission & Annual Charges`,
             amount: structure.annual,
             dueDate: new Date().toISOString().split('T')[0],
             status: FeeStatus.Due,
             paidAmount: 0
         });

         const dueDate = new Date(today.getFullYear(), today.getMonth(), 10);
         newRecords.push({
             id: `FEE-${student.id}-TUIT`,
             studentId: student.id,
             description: `Tuition Fee - ${today.toLocaleString('default', { month: 'long' })}`,
             amount: structure.tuition,
             dueDate: dueDate.toISOString().split('T')[0],
             status: FeeStatus.Due, 
             paidAmount: 0
         });

         feeRecords = [...newRecords, ...feeRecords];
         saveToStorage();
         notifyListeners();
    },

    getFeeSummaryForAllStudents: () => {
        const students = studentService.getStudents();
        return students.map(student => {
            const studentFees = feeRecords.filter(f => f.studentId === student.id);
            const totalDue = studentFees.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
            const hasOverdue = studentFees.some(f => f.status === FeeStatus.Overdue);
            
            let status = FeeStatus.Paid;
            if (totalDue > 0) status = hasOverdue ? FeeStatus.Overdue : FeeStatus.Due;
            
            return {
                studentId: student.id,
                studentName: student.name,
                className: student.className,
                totalDue,
                status,
            };
        });
    },

    getFeeSummaryForStudent: (studentId: string) => {
        const studentFees = feeRecords.filter(f => f.studentId === studentId);
        const totalDue = studentFees.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
        let status = 'Paid';
        if (totalDue > 0) {
             const hasOverdue = studentFees.some(f => f.status === FeeStatus.Overdue);
             status = hasOverdue ? 'Overdue' : 'Due';
        }
        return { totalDue, status };
    },

    // Added missing method getOverdueStudents
    getOverdueStudents: () => {
        const students = studentService.getStudents();
        return students.map(student => {
            const studentFees = feeRecords.filter(f => f.studentId === student.id);
            const overdueFees = studentFees.filter(f => f.status === FeeStatus.Overdue);
            if (overdueFees.length === 0) return null;
            
            const totalDue = studentFees.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
            return {
                studentName: student.name,
                email: student.email || '',
                mobileNumber: student.mobileNumber || '',
                className: student.className,
                dueAmount: totalDue
            };
        }).filter(s => s !== null);
    },

    processOnlinePayment: (recordId: string, amount: number, transactionId: string): boolean => {
        const index = feeRecords.findIndex(r => r.id === recordId);
        if (index > -1) {
            feeRecords[index].paidAmount += amount;
            feeRecords[index].paymentDate = new Date().toISOString();
            // Store transaction ID in description for receipt purposes in this demo
            feeRecords[index].description += ` (TXN: ${transactionId})`;
            
            if (feeRecords[index].paidAmount >= feeRecords[index].amount) {
                feeRecords[index].status = FeeStatus.Paid;
            } else {
                feeRecords[index].status = FeeStatus.PartiallyPaid;
            }
            saveToStorage();
            notifyListeners();
            return true;
        }
        return false;
    },

    getOverallStats: () => {
        const totalRevenue = feeRecords.reduce((sum, f) => sum + f.paidAmount, 0);
        const totalDue = feeRecords.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
        const totalOverdue = feeRecords.filter(f => f.status === FeeStatus.Overdue).reduce((sum, f) => sum + (f.amount - f.paidAmount), 0);
        return { totalRevenue, totalDue, totalOverdue };
    },

    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};
