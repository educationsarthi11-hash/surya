
import { LearningPath, LearningPathStatus } from '../types';

const MOCK_LEARNING_PATH: { [studentId: string]: LearningPath } = {
    'ESS-STU-001': {
        subject: 'Mathematics',
        steps: [
            // Replaced string literals with LearningPathStatus enum values for strict typing
            { step: 1, topic: 'Quadratic Equations Review', objective: 'Strengthen understanding of solving quadratic equations.', status: LearningPathStatus.Completed, suggestion: 'Review chapter 4 of NCERT textbook.' },
            { step: 2, topic: 'Introduction to Trigonometry', objective: 'Understand basic trigonometric ratios and identities.', status: LearningPathStatus.InProgress, suggestion: 'Watch 3D Lab model on Sine/Cosine waves.' },
            { step: 3, topic: 'Trigonometric Applications', objective: 'Apply trigonometry to solve real-world problems.', status: LearningPathStatus.NextUp, suggestion: 'Practice problems in AI Study Guru.' },
            { step: 4, topic: 'Advanced Trigonometry', objective: 'Learn about inverse trigonometric functions.', status: LearningPathStatus.ToReview, suggestion: 'Generate a study guide using the AI Book Generator.' },
            { step: 5, topic: 'Final Assessment', objective: 'Test your knowledge with an online exam.', status: LearningPathStatus.ToReview, suggestion: 'Test your knowledge with an AI-generated Online Exam on Trigonometry.' },
        ],
    }
};

let learningPaths = MOCK_LEARNING_PATH;
let listeners: (() => void)[] = [];

const notify = () => listeners.forEach(l => l());

export const learningPathService = {
    getLearningPathForStudent: (studentId: string): LearningPath | null => {
        return learningPaths[studentId] || null;
    },
    updateStepStatus: (studentId: string, stepNumber: number, newStatus: LearningPathStatus): void => {
        if (learningPaths[studentId]) {
            const path = learningPaths[studentId];
            const updatedSteps = path.steps.map(step => {
                if (step.step === stepNumber) {
                    return { ...step, status: newStatus };
                }
                // Logic to update next step if current one is completed
                if (step.step === stepNumber + 1 && newStatus === LearningPathStatus.Completed && step.status !== LearningPathStatus.Completed) {
                    return { ...step, status: LearningPathStatus.InProgress };
                }
                return step;
            });
            learningPaths[studentId] = { ...path, steps: updatedSteps };
            notify();
        }
    },
    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};
