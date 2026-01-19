
import { UserRole } from '../types';

interface UsageLimit {
    textQueries: number; // Daily text chat limit
    mediaGenerations: number; // Daily image/video limit
    planName: string;
}

// Plan Definitions - Control your costs here
const PLAN_LIMITS: { [key: string]: UsageLimit } = {
    'economy': { textQueries: 20, mediaGenerations: 0, planName: '₹25 जन-शिक्षा' },
    'standard': { textQueries: 100, mediaGenerations: 5, planName: '₹99 सार्थी स्मार्ट' },
    'premium': { textQueries: 500, mediaGenerations: 50, planName: '₹299 प्रीमियम' },
    'admin': { textQueries: 9999, mediaGenerations: 9999, planName: 'Administrator' } // Admins are unlimited
};

interface DailyUsage {
    date: string;
    textCount: number;
    mediaCount: number;
}

const STORAGE_KEY = 'sarthi_user_usage_v1';

export const usageService = {
    getLimits: (userRole: UserRole): UsageLimit => {
        // In a real app, this would come from the user's subscription in DB
        // Here we simulate based on role for demo
        if (userRole === UserRole.Admin || userRole === UserRole.Director) return PLAN_LIMITS['admin'];
        if (userRole === UserRole.Student) return PLAN_LIMITS['economy']; // Default to cheapest plan for safety
        return PLAN_LIMITS['standard'];
    },

    getCurrentUsage: (): DailyUsage => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (stored) {
            const data: DailyUsage = JSON.parse(stored);
            if (data.date === today) {
                return data;
            }
        }
        
        // Reset for new day
        return { date: today, textCount: 0, mediaCount: 0 };
    },

    canUseTextAI: (userRole: UserRole): { allowed: boolean; message?: string } => {
        const limits = usageService.getLimits(userRole);
        const usage = usageService.getCurrentUsage();
        
        if (usage.textCount >= limits.textQueries) {
            return { 
                allowed: false, 
                message: `दैनिक सीमा समाप्त! (Daily Limit Reached). आपने ${limits.textQueries} प्रश्न पूछ लिए हैं। कृपया प्लान अपग्रेड करें।` 
            };
        }
        return { allowed: true };
    },

    canUseMediaAI: (userRole: UserRole): { allowed: boolean; message?: string } => {
        const limits = usageService.getLimits(userRole);
        const usage = usageService.getCurrentUsage();
        
        if (usage.mediaCount >= limits.mediaGenerations) {
            return { 
                allowed: false, 
                message: `मीडिया लिमिट समाप्त! (Media Limit Reached). ${limits.planName} में वीडियो/इमेज की सीमा खत्म हो गई है।` 
            };
        }
        return { allowed: true };
    },

    trackTextUsage: () => {
        const usage = usageService.getCurrentUsage();
        usage.textCount += 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
    },

    trackMediaUsage: () => {
        const usage = usageService.getCurrentUsage();
        usage.mediaCount += 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
    },

    getUsageStats: (userRole: UserRole) => {
        const usage = usageService.getCurrentUsage();
        const limits = usageService.getLimits(userRole);
        return {
            text: { used: usage.textCount, total: limits.textQueries },
            media: { used: usage.mediaCount, total: limits.mediaGenerations },
            plan: limits.planName
        };
    }
};
