
import React, { useMemo, useCallback } from 'react';
import LiveClass from './LiveClass';
import { useToast } from '../hooks/useToast';
import { Transcript } from '../types';

interface RecruitmentLiveClassProps {
    onEnd: (finalTranscripts: Transcript[]) => void;
    examName: string;
    subject: string;
    topic: string;
    language: string;
}

const RecruitmentLiveClass: React.FC<RecruitmentLiveClassProps> = ({ onEnd, examName, subject, topic, language }) => {
    const toast = useToast();

    const systemInstruction = useMemo(() => 
        `You are an expert AI interview coach preparing a student for the "${examName}" exam. The current subject is "${subject}". Your teaching language is ${language}. 
        Conduct a live, interactive audio practice session on the topic: "${topic}". 
        Ask common interview questions related to this topic, listen to the student's response, and provide gentle, constructive feedback. 
        Your tone should be that of a professional and encouraging hiring manager or coach.`,
    [examName, subject, topic, language]);

    const visualAidPromptGenerator = useCallback((text: string) => {
        return `A simple, professional diagram or flowchart for a job candidate to understand the concept of: "${text.substring(0, 200)}". 
        
        IMPORTANT: All text, labels, and annotations in the image MUST be in ENGLISH only, regardless of the teaching language.`;
    }, []);

    const handleEndLiveClass = useCallback((transcripts: Transcript[]) => {
        toast.info("Interview practice session ended.");
        onEnd(transcripts);
    }, [onEnd, toast]);

    return (
        <div className="h-[75vh] min-h-[600px]">
            <LiveClass 
                systemInstruction={systemInstruction}
                onEnd={handleEndLiveClass}
                sessionTitle={`Interview Practice: ${topic}`}
                visualAidPromptGenerator={visualAidPromptGenerator}
                startMuted={true} // Start muted so the "coach" speaks first.
            />
        </div>
    );
};

export default RecruitmentLiveClass;
