

import React from 'react';
import { Notification, UserRole, ServiceName } from '../types';
import { AcademicCapIcon, BriefcaseIcon, CurrencyRupeeIcon, UserPlusIcon } from '../components/icons/AllIcons';

const MOCK_NOTIFICATIONS: { [key in UserRole]?: Notification[] } = {
    [UserRole.Student]: [
        { id: 's1', title: 'New Homework Assigned', message: 'Mr. David Chen assigned "Solve Algebraic Equations" for Mathematics.', timestamp: '2 hours ago', isRead: false, icon: React.createElement(AcademicCapIcon), link: { service: 'AI Homework Hub' } },
        { id: 's2', title: 'Fee Reminder', message: 'Your monthly tuition fee of ₹2,500 is due next week.', timestamp: '1 day ago', isRead: false, icon: React.createElement(CurrencyRupeeIcon), link: { service: 'Fee Management' } },
        { id: 's3', title: 'Exam Results Published', message: 'Your Mid-Term Examination results are now available.', timestamp: '3 days ago', isRead: true, icon: React.createElement(AcademicCapIcon), link: { service: 'Progress Monitor' } },
    ],
    [UserRole.Teacher]: [
        { id: 't1', title: 'Homework Submitted', message: 'Aarav Sharma has submitted the assignment "Solve Algebraic Equations".', timestamp: '5 minutes ago', isRead: false, icon: React.createElement(AcademicCapIcon), link: { service: 'AI Homework Hub' } },
        { id: 't2', title: 'Meeting Scheduled', message: 'A staff meeting is scheduled for tomorrow at 2:00 PM.', timestamp: '6 hours ago', isRead: false, icon: React.createElement(BriefcaseIcon) },
        { id: 't3', title: 'Curriculum Update', message: 'The science curriculum for Class 10 has been updated.', timestamp: '2 days ago', isRead: true, icon: React.createElement(BriefcaseIcon) },
    ],
    [UserRole.Admin]: [
        { id: 'a1', title: 'New Admission Pending', message: 'A new online admission form for "Riya Singh" requires your approval.', timestamp: '30 minutes ago', isRead: false, icon: React.createElement(UserPlusIcon), link: { service: 'Smart Admissions' } },
        { id: 'a2', title: 'Support Ticket Received', message: 'A new technical support ticket has been opened by a franchise.', timestamp: '4 hours ago', isRead: false, icon: React.createElement(BriefcaseIcon), link: { service: 'Franchise Support' } },
        { id: 'a3', title: 'Fee Payments Processed', message: 'Batch processing of online fee payments completed successfully.', timestamp: '1 day ago', isRead: true, icon: React.createElement(CurrencyRupeeIcon), link: { service: 'Fee Management' } },
    ],
    [UserRole.Parent]: [
        { id: 'p1', title: 'Attendance Alert', message: "Aarav was marked present today.", timestamp: '1 hour ago', isRead: false, icon: React.createElement(AcademicCapIcon), link: { service: 'Face Attendance' } },
        { id: 'p2', title: 'Fee Reminder', message: "Your child's monthly tuition fee of ₹2,500 is due next week.", timestamp: '1 day ago', isRead: false, icon: React.createElement(CurrencyRupeeIcon), link: { service: 'Fee Management' } },
        { id: 'p3', title: 'New Report Available', message: "A new progress report for Aarav is available to view.", timestamp: '3 days ago', isRead: true, icon: React.createElement(AcademicCapIcon), link: { service: 'Progress Monitor' } },
    ],
};

// Make notifications mutable for state changes
let notificationsState: { [key in UserRole]?: Notification[] } = JSON.parse(JSON.stringify(MOCK_NOTIFICATIONS));

// Store specific user notifications (since we don't have a real DB, we map by ID or Role)
// For simplicity in this demo, we append to the Role list, but in a real app, this would be user-specific.
// We will add a temporary mechanism to filter by 'targetStudentId' if we were implementing full auth.
// Here, we just push to the role list so any user with that role sees it (Demo limitation handled).

let listeners: (() => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

export const notificationService = {
    getNotifications: (role: UserRole): Notification[] => {
        return notificationsState[role] || [];
    },

    getUnreadCount: (role: UserRole): number => {
        return (notificationsState[role] || []).filter(n => !n.isRead).length;
    },

    markAllAsRead: (role: UserRole): void => {
        if (notificationsState[role]) {
            notificationsState[role] = notificationsState[role]!.map(n => ({ ...n, isRead: true }));
            notifyListeners();
        }
    },

    // New method to push notification dynamically
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>, targetUserId?: string) => {
        const newNotif: Notification = {
            ...notification,
            id: `sys-${Date.now()}-${Math.random()}`,
            timestamp: 'Just now',
            isRead: false
        };

        // For this demo, we push to Student role array. 
        // In real backend, we'd push to specific user ID relation.
        if (!notificationsState[UserRole.Student]) {
            notificationsState[UserRole.Student] = [];
        }
        notificationsState[UserRole.Student]!.unshift(newNotif);
        notifyListeners();
    },
    
    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};
