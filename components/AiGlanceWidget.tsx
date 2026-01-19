
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { generateText } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { SparklesIcon, ArrowPathIcon, ExclamationTriangleIcon } from './icons/AllIcons';
import { attendanceService } from '../services/attendanceService';

// Mock data to simulate fetching user-specific information
const MOCK_DATA = {
    STUDENT: {
        upcomingDeadlines: "Math homework due tomorrow, Science project proposal due in 3 days.",
        weakestSubject: "Trigonometry in Mathematics",
        lastActivity: "Completed a quiz on Indian History.",
    },
    TEACHER: {
        todaysSchedule: "09:00 AM - Science (10A), 11:00 AM - Physics (12B), 02:00 PM - Staff Meeting.",
        studentsToWatch: "Aarav Sharma (improving in Algebra), Priya Patel (missed last assignment).",
        pendingTasks: "5 essays from Class 10A need grading.", 
        submittedHomeworkCount: 5, 
    },
    ADMIN: {
        pendingAdmissions: 3,
        openSupportTickets: 2,
        systemStatus: "All systems operational.",
    },
    PARENT: {
        childsUpcomingEvents: "Parent-Teacher meeting on Friday, Science Fair next week.",
        recentPerformance: "Aarav scored 85% in the last Math test (an improvement).",
        feeStatus: "Next fee payment is due on the 5th of next month.",
    },
    COMPANY: {
        totalFranchises: 5,
        revenueThisMonth: "₹12.5 Lakhs",
        pendingApprovals: "2 new franchise requests."
    }
};

const AiGlanceWidget: React.FC<{ user: User }> = ({ user }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const generateBriefing = useCallback(async (forceRefresh = false) => {
        setLoading(true);
        const today = new Date().toDateString();
        const cacheKey = `aiBriefing_${user.id}_${today}`;

        // Check cache first
        if (!forceRefresh) {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                setSummary(cachedData);
                setLoading(false);
                return;
            }
        }

        let prompt = "";

        if (user.role === UserRole.Student) {
            const context = MOCK_DATA.STUDENT;
            prompt = `Act as a motivating study companion for ${user.name}. 
            Here is their current status:
            - Upcoming: ${context.upcomingDeadlines}
            - Focus Area: ${context.weakestSubject}
            - Last Activity: ${context.lastActivity}
            
            Generate a short, 2-3 sentence "Daily Briefing". Include a specific study tip related to their focus area and a motivating quote. Use emojis. Format as plain text.`;
        } else if (user.role === UserRole.Teacher) {
            const context = MOCK_DATA.TEACHER;
            prompt = `Act as a professional teaching assistant for ${user.name}.
            Here is today's context:
            - Schedule: ${context.todaysSchedule}
            - Students to Watch: ${context.studentsToWatch}
            - Tasks: ${context.pendingTasks}
            
            Generate a concise "Daily Briefing" (bullet points). Highlight the most urgent task and suggest a quick teaching tip for the day.`;
        } else if (user.role === UserRole.Admin) {
             const attendanceCount = attendanceService.getTodaysAttendanceCount();
             const context = MOCK_DATA.ADMIN;
             prompt = `Act as an executive assistant for ${user.name} (${user.role}).
             System Status:
             - Attendance Today: ${attendanceCount} students present.
             - Pending Admissions: ${context.pendingAdmissions}
             - Support Tickets: ${context.openSupportTickets}
             
             Generate a concise, professional executive summary of the day's key metrics and action items.`;
        } else if (user.role === UserRole.Company) {
             const context = MOCK_DATA.COMPANY;
             prompt = `Act as an executive assistant for ${user.name} (${user.role}).
             System Status:
             - Total Franchises: ${context.totalFranchises}
             - Revenue This Month: ${context.revenueThisMonth}
             - Pending Approvals: ${context.pendingApprovals}
             
             Generate a concise, professional executive summary of the day's key metrics and action items.`;
        } else if (user.role === UserRole.Parent) {
             const context = MOCK_DATA.PARENT;
             prompt = `Act as a helpful assistant for ${user.name}.
             Child Status:
             - Upcoming: ${context.childsUpcomingEvents}
             - Performance: ${context.recentPerformance}
             - Fees: ${context.feeStatus}
             
             Generate a helpful daily summary.`;
        } else {
             prompt = `Act as a helpful assistant for ${user.name}. Generate a positive and helpful daily greeting and summary based on general academic trends.`;
        }

        try {
            const text = await generateText(prompt);
            setSummary(text);
            localStorage.setItem(cacheKey, text); // Cache the result
        } catch (error: any) {
            console.error("Failed to generate AI summary:", error);
            if (error.message?.includes('429') || error.status === 429) {
                 setSummary("✨ Daily briefing temporarily unavailable due to high traffic. Focus on your goals today!");
            } else {
                 setSummary("Could not generate briefing at this time.");
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        generateBriefing();
    }, [generateBriefing]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft border-l-4 border-primary relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <SparklesIcon className="h-24 w-24 text-primary" />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                        <SparklesIcon className="h-5 w-5 text-primary" />
                        AI Daily Briefing
                    </h3>
                    <button 
                        onClick={() => generateBriefing(true)} 
                        className="text-xs text-neutral-400 hover:text-primary flex items-center gap-1 transition-colors"
                        title="Refresh Briefing"
                        disabled={loading}
                    >
                        <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                
                {loading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                        <div className="h-4 bg-neutral-100 rounded w-full"></div>
                        <div className="h-4 bg-neutral-100 rounded w-5/6"></div>
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none text-neutral-600">
                        <p className="whitespace-pre-wrap leading-relaxed font-hindi text-base font-medium text-slate-700">{summary}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiGlanceWidget;
