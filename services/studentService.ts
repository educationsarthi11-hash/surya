
import { StudentData } from '../types';

const STORAGE_KEY = 'edu_sarthi_students_v1';

export const mockStudentDatabase: StudentData[] = [
    {
        id: 'ESS-STU-001',
        name: 'Aarav Sharma',
        age: '14',
        className: 'Class 8',
        address: '123, Sunshine Apartments, Delhi',
        fatherName: 'Rajesh Sharma',
        motherName: 'Priya Sharma',
        mobileNumber: '9876543210',
        email: 'aarav.sharma@example.com',
        photoUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aarav'
    },
    {
        id: 'ESS-STU-002',
        name: 'Priya Patel',
        age: '16',
        className: 'Class 10',
        address: '456, Moonlit Towers, Mumbai',
        fatherName: 'Sanjay Patel',
        motherName: 'Meena Patel',
        mobileNumber: '9123456789',
        email: 'priya.patel@example.com',
        photoUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Priya'
    },
    {
        id: 'ESS-STU-003',
        name: 'Rohan Mehta',
        age: '12',
        className: 'Class 6',
        address: '789, Starry Heights, Bangalore',
        fatherName: 'Vikram Mehta',
        motherName: 'Anjali Mehta',
        mobileNumber: '9988776655',
        email: 'rohan.mehta@example.com',
        photoUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rohan'
    },
    {
        id: 'ESS-STU-004',
        name: 'Sneha Verma',
        age: '17',
        className: 'Class 12',
        address: '321, Galaxy Residency, Kolkata',
        fatherName: 'Alok Verma',
        motherName: 'Sunita Verma',
        mobileNumber: '9000011111',
        email: 'sneha.verma@example.com',
        photoUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sneha'
    },
];

// --- Student Service with Persistence ---
const loadStudents = (): StudentData[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [...mockStudentDatabase];
    } catch (e) {
        return [...mockStudentDatabase];
    }
};

let students: StudentData[] = loadStudents();
let listeners: (() => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

const saveToStorage = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
        console.error("Failed to save students", e);
    }
};

export const studentService = {
    getStudents: (): StudentData[] => students,
    
    addStudent: (student: StudentData): void => {
        // Check for duplicates
        if (!students.some(s => s.id === student.id)) {
             students = [student, ...students];
             saveToStorage();
             notifyListeners();
        }
    },
    
    updateStudent: (updatedStudent: StudentData): void => {
        students = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
        saveToStorage();
        notifyListeners();
    },

    deleteStudent: (studentId: string): void => {
        students = students.filter(s => s.id !== studentId);
        saveToStorage();
        notifyListeners();
    },

    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};
