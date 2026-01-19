import { JobOpening, JobApplication } from '../types';
import { GoogleGenAI } from "@google/genai";

let jobs: JobOpening[] = [];
let applications: JobApplication[] = [];
let listeners: (() => void)[] = [];

const notify = () => listeners.forEach(l => l());

// MLM / Network Marketing Banned Keywords
const BANNED_KEYWORDS = [
    "network marketing", "mlm", "chain system", "refer and earn", 
    "direct selling", "member joining", "no investment", "work from home money",
    "pyramid scheme", "marketing executive chain", "binary plan", "downline", 
    "upline", "passive income stream", "money making app", "networking"
];

export const placementService = {
    getJobOpenings: () => jobs.filter(j => j.isApproved),
    
    postJobOpening: async (job: JobOpening) => {
        // 1. Basic Keyword Check (Fast Filter)
        const content = (job.jobTitle + " " + job.description).toLowerCase();
        const containsMLM = BANNED_KEYWORDS.some(keyword => content.includes(keyword));

        if (containsMLM) {
            throw new Error("MGM Shield: MLM / Chain Systems are strictly forbidden on this platform.");
        }

        // 2. AI Semantic Scanning (Gemini Protection)
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Analyze this job posting. Is it a Multi-Level Marketing (MLM), Pyramid Scheme, or suspicious 'Easy Money' scam? 
            Job Title: ${job.jobTitle}
            Description: ${job.description}
            
            Legitimate hiring for Dance, Arts, Technical, or Corporate is OK.
            Return ONLY a JSON: {"isScam": boolean, "reason": "string"}`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const result = JSON.parse(response.text || '{}');
            if (result.isScam) {
                throw new Error(`MGM Shield Alert: This post looks like a scam. Reason: ${result.reason}`);
            }
        } catch (e: any) {
            if (e.message.includes("MGM Shield")) throw e;
            console.error("Safety scan bypassed due to error, basic filter active.");
        }

        jobs = [job, ...jobs];
        notify();
    },

    approveJob: (jobId: string) => {
        jobs = jobs.map(j => j.id === jobId ? { ...j, isApproved: true } : j);
        notify();
    },

    applyForJob: (studentId: string, jobId: string) => {
        const app: JobApplication = {
            id: `APP-${Date.now()}`,
            jobId,
            studentId,
            status: 'Applied',
            applicationDate: new Date().toISOString()
        };
        applications = [app, ...applications];
        notify();
    },

    getApplicationsForJob: (jobId: string): JobApplication[] => {
        return applications.filter(app => app.jobId === jobId);
    },

    getJobsAppliedByStudent: (studentId: string): JobApplication[] => {
        return applications.filter(app => app.studentId === studentId);
    },

    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => { listeners = listeners.filter(li => li !== listener); };
    }
};