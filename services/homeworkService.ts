import { HomeworkAssignment, HomeworkSubmission, User } from '../types';
import { studentService } from './studentService';

// --- MOCK DATA ---
const mockAssignments: HomeworkAssignment[] = [
    {
        id: 'HW-001',
        teacherId: 'ESS-TCH-001',
        teacherName: 'Mr. David Chen',
        title: 'Essay on Photosynthesis',
        description: 'Write a 200-word essay explaining the process of photosynthesis, its importance, and the chemical equation involved.',
        className: 'Class 10',
        subject: 'Science',
        dueDate: '2024-08-10',
        createdAt: '2024-08-01',
    },
    {
        id: 'HW-002',
        teacherId: 'ESS-TCH-001',
        teacherName: 'Mr. David Chen',
        title: 'Solve Algebraic Equations',
        description: 'Solve the first 10 problems from Chapter 5, "Linear Equations", of the NCERT textbook.',
        className: 'Class 8',
        subject: 'Mathematics',
        dueDate: '2024-08-05',
        createdAt: '2024-07-30',
    },
];

const mockSubmissions: HomeworkSubmission[] = [
    {
        id: 'SUB-001',
        assignmentId: 'HW-002',
        studentId: 'ESS-STU-001',
        studentName: 'Aarav Sharma',
        submissionDate: '2024-08-02',
        content: 'I have solved all the problems in my notebook. The answers for the first 5 are: 1) x=5, 2) y=10, 3) a=2, 4) b= -3, 5) z=1.5. I found question 7 a bit difficult.',
        status: 'Submitted',
    }
];

// --- SERVICE STATE ---
let assignments: HomeworkAssignment[] = [...mockAssignments];
let submissions: HomeworkSubmission[] = [...mockSubmissions];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

// --- SERVICE EXPORT ---
export const homeworkService = {
    // --- Assignment Methods ---
    getAssignmentsForTeacher: (teacherId: string): HomeworkAssignment[] => {
        return assignments
            .filter(a => a.teacherId === teacherId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    getAssignmentsForStudent: (studentId: string): { assignment: HomeworkAssignment, submission: HomeworkSubmission | undefined }[] => {
        const student = studentService.getStudents().find(s => s.id === studentId);
        if (!student) return [];
        
        return assignments
            .filter(a => a.className === student.className)
            .map(assignment => ({
                assignment,
                submission: submissions.find(s => s.assignmentId === assignment.id && s.studentId === studentId)
            }))
            .sort((a, b) => new Date(b.assignment.dueDate).getTime() - new Date(a.assignment.dueDate).getTime());
    },

    createAssignment: (data: Omit<HomeworkAssignment, 'id' | 'createdAt'>): void => {
        const newAssignment: HomeworkAssignment = {
            ...data,
            id: `HW-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        assignments = [newAssignment, ...assignments];
        notifyListeners();
    },

    // --- Submission Methods ---
    getSubmissionsForAssignment: (assignmentId: string): HomeworkSubmission[] => {
        return submissions.filter(s => s.assignmentId === assignmentId);
    },

    submitHomework: (submissionData: Omit<HomeworkSubmission, 'id' | 'submissionDate' | 'status'>): void => {
        const newSubmission: HomeworkSubmission = {
            ...submissionData,
            id: `SUB-${Date.now()}`,
            submissionDate: new Date().toISOString(),
            status: 'Submitted',
        };
        submissions = [newSubmission, ...submissions];
        notifyListeners();
    },

    addAIFeedback: (submissionId: string, feedback: string): void => {
        const index = submissions.findIndex(s => s.id === submissionId);
        if (index > -1) {
            submissions[index].feedback = feedback;
            submissions[index].status = 'Graded';
            notifyListeners();
        }
    },

    // --- Subscription ---
    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};