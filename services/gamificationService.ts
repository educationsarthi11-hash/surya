import React from 'react';
import { UserStats, Badge } from '../types';
import { SparklesIcon, FireIcon, BriefcaseIcon, StarIcon, DocumentTextIcon, VideoCameraIcon } from '../components/icons/AllIcons';

const mockUserStats: { [studentId: string]: UserStats } = {
    'ESS-STU-001': { studentId: 'ESS-STU-001', points: 750, level: 7, levelName: 'Prodigy', progress: 50 },
    'ESS-STU-002': { studentId: 'ESS-STU-002', points: 620, level: 6, levelName: 'Scholar', progress: 20 },
    'ESS-STU-003': { studentId: 'ESS-STU-003', points: 480, level: 4, levelName: 'Explorer', progress: 80 },
    'ESS-STU-004': { studentId: 'ESS-STU-004', points: 910, level: 9, levelName: 'Master', progress: 10 },
};

const allBadges: Badge[] = [
    { id: 'b01', name: 'Streak Starter', description: 'Maintain a 3-day learning streak.', icon: React.createElement(FireIcon, { className: "h-full w-full" }) },
    { id: 'b02', name: 'AI Conversationalist', description: 'Have your first 10 interactions with the AI Guru.', icon: React.createElement(SparklesIcon, { className: "h-full w-full" }) },
    { id: 'b03', name: 'Video Virtuoso', description: 'Generate your first video lesson.', icon: React.createElement(VideoCameraIcon, { className: "h-full w-full" }) },
    { id: 'b04', name: 'Career Ready', description: 'Create your first CV with the CV Generator.', icon: React.createElement(BriefcaseIcon, { className: "h-full w-full" }) },
    { id: 'b05', name: 'Perfect Score', description: 'Get a perfect score on an online exam.', icon: React.createElement(StarIcon, { className: "h-full w-full" }) },
    { id: 'b06', name: 'Paper Maker', description: 'Generate your first test paper.', icon: React.createElement(DocumentTextIcon, { className: "h-full w-full" }) },
];

const mockEarnedBadges: { [studentId: string]: string[] } = {
    'ESS-STU-001': ['b01', 'b02', 'b03', 'b04'],
    'ESS-STU-002': ['b01', 'b02'],
    'ESS-STU-003': ['b01'],
    'ESS-STU-004': ['b01', 'b02', 'b03', 'b04', 'b05'],
};

const mockLeaderboard: UserStats[] = Object.values(mockUserStats).sort((a, b) => b.points - a.points);

const mockStudents: { [id: string]: string } = {
    'ESS-STU-001': 'Aarav Sharma',
    'ESS-STU-002': 'Priya Patel',
    'ESS-STU-003': 'Rohan Mehta',
    'ESS-STU-004': 'Sneha Verma'
};

export const gamificationService = {
    getUserStats: (studentId: string): UserStats | null => {
        return mockUserStats[studentId] || null;
    },

    getEarnedBadges: (studentId: string): Badge[] => {
        const badgeIds = mockEarnedBadges[studentId] || [];
        return allBadges.filter(badge => badgeIds.includes(badge.id));
    },

    getAllBadges: (): Badge[] => allBadges,

    getLeaderboard: (): { rank: number; name: string; points: number; levelName: string; studentId: string; }[] => {
        return mockLeaderboard.map((stats, index) => {
            const studentName = mockStudents[stats.studentId] || 'Unknown Student';
            return {
                rank: index + 1,
                name: studentName,
                points: stats.points,
                levelName: stats.levelName,
                studentId: stats.studentId,
            };
        });
    }
};