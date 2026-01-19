
import { StatusItem, UserRole } from '../types';

// Mock Data
const mockStatuses: StatusItem[] = [
    {
        id: 'st-001',
        userId: 'admin-1',
        userName: 'Education Sarthi (Admin)',
        userRole: UserRole.Admin,
        contentText: 'School will remain closed tomorrow due to heavy rain. Online classes will run as schedule.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        isViewed: false
    },
    {
        id: 'st-002',
        userId: 'student-1',
        userName: 'Aarav Sharma',
        userRole: UserRole.Student,
        userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aarav',
        contentImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
        contentText: 'Won 1st prize in the Science Fair today! 🏆',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        isViewed: false
    }
];

let statuses: StatusItem[] = [...mockStatuses];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const statusService = {
    getAllStatuses: (): StatusItem[] => {
        // Sort by timestamp descending (newest first), but grouped by "my status" vs others in UI
        return statuses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    addStatus: (status: Omit<StatusItem, 'id' | 'timestamp' | 'isViewed'>): void => {
        const newStatus: StatusItem = {
            ...status,
            id: `st-${Date.now()}`,
            timestamp: new Date().toISOString(),
            isViewed: false
        };
        statuses = [newStatus, ...statuses];
        notifyListeners();
    },

    markAsViewed: (statusId: string) => {
        const index = statuses.findIndex(s => s.id === statusId);
        if (index > -1 && !statuses[index].isViewed) {
            statuses[index].isViewed = true;
            notifyListeners();
        }
    },

    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }
};
