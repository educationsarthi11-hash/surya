
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User, Transcript } from '../types';
import LiveClass from './LiveClass';
import { useToast } from '../hooks/useToast';
import { generateInterviewFeedback } from '../services/geminiService';
import Loader from './Loader';
import { BriefcaseIcon, SparklesIcon, ArrowLeftIcon } from './icons/AllIcons';

type InterviewStage = 'setup' | 'live' | 'feedback';

const AIInterviewCoach: React.FC<{ user: User }> = () => {
    const toast = useToast();
    const [stage, setStage] = useState<InterviewStage>('setup');
    const [jobRole, setJobRole] = useState('Software Engineer Intern');
    const [interviewType, setInterviewType] = useState('Technical Round');
    const [jobDescription, setJobDescription] = useState('');
    const [feedbackHtml, setFeedbackHtml] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneral, setIsGeneral] = useState(false);

    useEffect(() => {
        if (isGeneral) {
            setJobRole('General Job Role');
            setJobDescription('A general job interview for any entry-level position focusing on common behavioral and situational questions.');
        } else {
            // Revert to defaults
            setJobRole('Software Engineer Intern');
            setJobDescription('');
        }
    }, [isGeneral]);

    const systemInstruction = useMemo(() => `You are an expert AI Interviewer conducting a mock interview for the role of "${jobRole}" (${interviewType} round). The candidate has provided the following job description for context: "${jobDescription || 'Not provided. Ask general questions for the role.'}".
    Your task is to:
    1. Ask one question at a time, clearly and professionally.
    2. Wait for the candidate to finish their response.
    3. Ask a mix of technical, behavioral (STAR method), and situational questions based on the role and job description.
    4. Maintain a conversational but professional tone. Do not provide feedback during the interview itself.
    5. After a few questions (around 5-7), politely conclude the interview by saying "Thank you for your time. That's all the questions I have for today."`,
    [jobRole, interviewType, jobDescription]);

    const visualAidPromptGenerator = useCallback((text: string) => {
        return `A simple, professional diagram or flowchart for a job candidate to understand a concept related to: "${text.substring(0, 200)}". IMPORTANT: All labels and text inside the image MUST be in ENGLISH only.`;
    }, []);

    const handleEndInterview = useCallback(async (finalTranscripts: Transcript[]) => {
        if (finalTranscripts.length < 2) { // At least one user and one AI turn
            toast.info("Interview ended early. No feedback to generate.");
            setStage('setup');
            return;
        }
        setIsLoading(true);
        setStage('feedback');
        try {
            const feedback = await generateInterviewFeedback(finalTranscripts, jobRole, interviewType, jobDescription);
            setFeedbackHtml(feedback);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate AI feedback for your interview.");
            setFeedbackHtml("<p>Sorry, there was an error generating your feedback report.</p>");
        } finally {
            setIsLoading(false);
        }
    }, [jobRole, interviewType, jobDescription, toast]);

    const renderSetup = () => (
        <div className="max-w-xl mx-auto p-4 border rounded-lg bg-neutral-50 space-y-4">
            <h3 className="text-xl font-bold text-neutral-800">Prepare for Your Mock Interview</h3>
            
            <div className="flex items-center">
                <input
                    id="general-interview"
                    type="checkbox"
                    checked={isGeneral}
                    onChange={(e) => setIsGeneral(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="general-interview" className="ml-3 block text-sm font-medium text-neutral-700">
                    Practice for a General Job <span className="font-hindi">(किसी भी नौकरी के लिए अभ्यास करें)</span>
                </label>
            </div>

            <div>
                <label htmlFor="jobRole" className="block text-sm font-medium text-neutral-700">Job Role</label>
                <input
                    type="text"
                    id="jobRole"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g., Software Engineer Intern"
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 disabled:bg-neutral-200"
                    disabled={isGeneral}
                />
            </div>
             <div>
                <label htmlFor="interviewType" className="block text-sm font-medium text-neutral-700">Interview Type</label>
                <select
                    id="interviewType"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"
                >
                    <option>Technical Round</option>
                    <option>HR / Behavioral Round</option>
                    <option>Managerial Round</option>
                </select>
            </div>
             <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-neutral-700">Job Description (Optional)</label>
                <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={5}
                    placeholder="Paste the job description here for more relevant questions..."
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 disabled:bg-neutral-200"
                    disabled={isGeneral}
                />
                <p className="text-xs text-neutral-500 mt-1">Providing a job description will help the AI ask highly relevant questions.</p>
            </div>
            <button
                onClick={() => {
                    if (!jobRole.trim()) {
                        toast.error("Please provide a Job Role.");
                        return;
                    }
                    setStage('live');
                }}
                className="w-full flex justify-center items-center py-2.5 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
            >
                Start Mock Interview
            </button>
        </div>
    );
    
    const renderLive = () => (
        <div className="h-[75vh] min-h-[600px]">
            <LiveClass
                systemInstruction={systemInstruction}
                onEnd={handleEndInterview}
                sessionTitle={`Interview Practice: ${jobRole}`}
                visualAidPromptGenerator={visualAidPromptGenerator}
                startMuted={false}
            />
        </div>
    );

    const renderFeedback = () => (
         <div className="animate-pop-in">
             <button onClick={() => { setStage('setup'); setFeedbackHtml(null); }} className="inline-flex items-center mb-4 text-sm font-medium">
                <ArrowLeftIcon className="h-4 w-4 mr-1"/>Start New Interview
            </button>
            <div className="p-6 bg-white border rounded-lg">
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Your Performance Report</h3>
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <Loader message="AI is analyzing your performance and generating your detailed report..." />
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none prose-h3:text-primary prose-table:w-full prose-table:border prose-td:border prose-td:p-2 prose-th:p-2" dangerouslySetInnerHTML={{ __html: feedbackHtml || '' }} />
                )}
            </div>
         </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-6">
                <BriefcaseIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">AI Interview Coach</h2>
                    <p className="text-sm text-neutral-500 font-hindi">AI साक्षात्कारकर्ता के साथ अभ्यास करें</p>
                </div>
            </div>
            {stage === 'setup' && renderSetup()}
            {stage === 'live' && renderLive()}
            {stage === 'feedback' && renderFeedback()}
        </div>
    );
};

export default AIInterviewCoach;
