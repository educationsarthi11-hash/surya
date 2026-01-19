
import React, { useMemo, useCallback } from 'react';
import LiveClass from './LiveClass';
import { Transcript } from '../types';

interface ITILiveClassProps {
    onEnd: (finalTranscripts: Transcript[]) => void;
    course: string;
    subject: string;
    book: string;
    chapter: string;
    topic: string;
    language: string;
    duration: number;
}

const ITILiveClass: React.FC<ITILiveClassProps> = ({ onEnd, course, subject, book, chapter, topic, language }) => {
    
    const systemInstruction = useMemo(() => `You are an expert AI workshop instructor conducting a live, interactive audio class for a student in the "${course}" trade. The content is from the subject "${subject}", book "${book}", chapter "${chapter}". Your teaching language is ${language}. Explain concepts clearly on the topic: "${topic}". Emphasize safety procedures.
    
    **Your teaching method must follow a clear structure: First, provide a complete and thorough explanation of the topic. Do not ask the student any questions until your explanation is finished.** After you have fully explained the concept, you should then ask the student if they understand or have any questions. Only after that, you can proceed to ask questions to test their knowledge.
    
    Be encouraging and professional.`, [course, subject, book, chapter, language, topic]);
    
    const visualAidPromptGenerator = useCallback((text: string) => {
        return `A technical diagram or schematic explaining the concept of: "${text.substring(0, 200)}". 
        
        IMPORTANT: All text, labels, and annotations in the image MUST be in ENGLISH only, regardless of the teaching language.`;
    }, []);

    return (
        <LiveClass 
            systemInstruction={systemInstruction}
            // Removed duration prop as it does not exist on LiveClass
            onEnd={onEnd}
            sessionTitle={`${subject}: ${topic}`}
            visualAidPromptGenerator={visualAidPromptGenerator}
        />
    );
};

export default ITILiveClass;
