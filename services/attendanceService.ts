import { AttendanceRecord, StudentData } from '../types';
import { studentService } from './studentService';

let attendanceList: AttendanceRecord[] = [];
let listeners: (() => void)[] = [];

// Clear attendance at the start of a new session for demo purposes
const today = new Date().toLocaleDateString();
const lastCleared = localStorage.getItem('attendanceClearedDate');
if (lastCleared !== today) {
    localStorage.setItem('attendanceList', '[]');
    localStorage.setItem('attendanceClearedDate', today);
} else {
    try {
        const storedList = localStorage.getItem('attendanceList');
        if (storedList) {
            attendanceList = JSON.parse(storedList);
        }
    } catch (e) {
        attendanceList = [];
    }
}


const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

const saveToLocalStorage = () => {
    try {
        localStorage.setItem('attendanceList', JSON.stringify(attendanceList));
    } catch (e) {
        console.error("Failed to save attendance list to localStorage", e);
    }
};

export const attendanceService = {
    getAttendanceList: (): AttendanceRecord[] => {
        return [...attendanceList].sort((a, b) => b.time.localeCompare(a.time));
    },

    markPresent: (student: StudentData, imageSrc: string): boolean => {
        if (attendanceList.some(record => record.studentId === student.id)) {
            return false; // Already present
        }

        const newRecord: AttendanceRecord = {
            studentId: student.id,
            name: student.name,
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            imageSrc: imageSrc,
            status: 'Present',
        };

        attendanceList.unshift(newRecord); // Add to the beginning of the array
        saveToLocalStorage();
        notifyListeners();
        return true;
    },

    getStudentStatus: (studentId: string): 'Present' | 'Absent' => {
        return attendanceList.some(record => record.studentId === studentId) ? 'Present' : 'Absent';
    },

    getTodaysAttendanceCount: (): number => {
        return attendanceList.length;
    },

    getTotalStudentCount: (): number => {
        return studentService.getStudents().length;
    },

    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};
