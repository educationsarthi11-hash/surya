
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Institution, Exam, LearningPath, SarkariJob, Scholarship, User, Transcript, TimetableConstraints, Timetable, GitaVerse, YogaPose } from "../types";
import { cacheService } from "./cacheService";

// --- SECURITY CONFIGURATION ---
const USE_SECURE_BACKEND = false; 

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Master Hub Registry for Login Validation
export const MANGMAT_HUB_REGISTRY: Record<string, { name: string, pass: string, state: string, type: any }> = {
    'MGM-HQ-ADMIN': { name: 'Mangmat Global HQ', pass: 'admin123', state: 'Haryana', type: 'School' },
    'MGM-ROHTAK-01': { name: 'Mangmat Rohtak Campus', pass: 'rohtak77', state: 'Haryana', type: 'School' },
};

// --- AUDIO CONTEXT SINGLETON ---
let audioContext: AudioContext | null = null;
export const getOutputAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioContext;
};

// --- UTILS ---
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const sanitizeHtml = (html: string) => {
    return html.replace(/```html|```/g, '').trim();
};

// --- PCM DECODER HELPER ---
const decodePCM = (base64: string, ctx: AudioContext): AudioBuffer => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create Int16Array from the Uint8Array buffer
    const int16Data = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, int16Data.length, 24000);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < int16Data.length; i++) {
        // Convert PCM 16-bit integer (-32768 to 32767) to Float32 (-1.0 to 1.0)
        channelData[i] = int16Data[i] / 32768.0;
    }
    return buffer;
};

// --- CORE GENERATION FUNCTIONS ---

export const generateText = async (prompt: string, model: string = 'gemini-3-flash-preview'): Promise<string> => {
    const cachedResponse = cacheService.findResponse(prompt);
    if (cachedResponse) return cachedResponse;

    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        const text = response.text || "";
        if (text) cacheService.saveResponse(prompt, text);
        return text;
    } catch (error) {
        console.error("Text Gen Error:", error);
        return "AI सेवा अभी उपलब्ध नहीं है। कृपया पुनः प्रयास करें।";
    }
};

export const generateTextWithFile = async (prompt: string, file: File): Promise<string> => {
    const ai = getAI();
    const base64Data = await fileToBase64(file);
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            { text: prompt },
            { inlineData: { data: base64Data, mimeType: file.type } }
        ],
    });
    return response.text || "";
};

// --- TTS FUNCTION WITH RETRY LOGIC (FIX FOR PCM DECODING) ---
export const generateSpeech = async (
    text: string, 
    voice: 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir' = 'Puck', 
    promptWrapper?: (text: string) => string
): Promise<AudioBufferSourceNode> => {
    const ai = getAI();
    const ctx = getOutputAudioContext();

    // 1. Truncate text to avoid server overload (Keep under 600 chars for stability)
    const cleanText = text.replace(/<[^>]*>/g, '').slice(0, 600);
    const finalPrompt = promptWrapper ? promptWrapper(cleanText) : cleanText;

    let lastError;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: { parts: [{ text: finalPrompt }] },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } }
                    }
                }
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!base64Audio) throw new Error("No audio data returned");

            // Manually decode PCM data (Gemini returns raw PCM without headers)
            const audioBuffer = decodePCM(base64Audio, ctx);

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();
            return source;

        } catch (e: any) {
            console.warn(`TTS Attempt ${attempt + 1} failed:`, e);
            lastError = e;
            // Retry only on server errors (5xx)
            if (e.status >= 500 || e.message?.includes('500') || e.message?.includes('Internal error')) {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt))); // Exponential backoff
                continue;
            }
            break; // Don't retry client errors
        }
    }
    throw lastError || new Error("TTS Failed after retries");
};

// --- VIDEO GENERATION ---
export const generateLessonVideo = async (topic: string, duration: string, audience: string): Promise<string> => {
    const ai = getAI();
    // Using Veo model
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `Educational video about ${topic} for ${audience}. Cinematic, clear, high quality.`,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });
        
        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }
        
        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            // Append API key for playback
            return `${videoUri}&key=${process.env.API_KEY}`;
        }
    } catch (e) {
        console.error("Video Gen Error:", e);
        throw e;
    }
    return "";
};

export const generateMarketingVideo = async (topic: string, audience: string, message: string, format: 'portrait' | 'landscape'): Promise<string> => {
     // Similar to lesson video but optimized for ads
     return generateLessonVideo(`Marketing Ad: ${topic}. Message: ${message}`, 'short', audience);
};

// --- IMAGE GENERATION ---
export const generateImageForTopic = async (prompt: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: "1:1" } }
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    } catch (e) {
        console.error("Image Gen Error:", e);
    }
    return "";
};

// --- SPECIFIC SERVICE HELPERS ---

export const generateTest = async (params: any): Promise<string> => {
    const ai = getAI();
    const prompt = `Generate a printable test paper for ${params.schoolName}. 
    Subject: ${params.subject}, Class: ${params.className}, Chapter: ${params.chapterName}.
    Number of questions: ${params.numQuestions}. Language: ${params.language}.
    Format as HTML with professional layout.`;
    return generateText(prompt, 'gemini-3-pro-preview');
};

export const generateOnlineExamContent = async (course: string, className: string, subject: string, chapter: string, numQ: number, types: string[]): Promise<Exam> => {
     const prompt = `Create an online exam JSON.
     Subject: ${subject}, Class: ${className}, Chapter: ${chapter}.
     Questions: ${numQ}. Types: ${types.join(', ')}.
     Return JSON: { "subject": "${subject}", "className": "${className}", "duration": 30, "totalMarks": ${numQ*2}, "questions": [{ "question": "...", "options": ["A","B"], "answer": "A", "marks": 2, "type": "multiple-choice" }] }`;
     
     const text = await generateText(prompt, 'gemini-3-flash-preview');
     return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const generateAdCreative = async (topic: string, audience: string, message: string, style: string): Promise<any> => {
    const ai = getAI();
    const prompt = `Create ad copy for: ${topic}, Audience: ${audience}. JSON: {"adCopy": {"headline": "...", "body": "..."}}`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    const text = response.text || '{}';
    const json = JSON.parse(text);
    const imgUrl = await generateImageForTopic(`Ad image for ${topic}, style: ${style}`);
    return { ...json, imageUrl: imgUrl };
};

export const analyzeImageAndGetJson = async (prompt: string, file: File, schema: any): Promise<any> => {
    const ai = getAI();
    const base64Data = await fileToBase64(file);
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Stronger model for analysis
        contents: [
            { text: prompt },
            { inlineData: { data: base64Data, mimeType: file.type } }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });
    return JSON.parse(response.text || '{}');
};

export const analyzeMultipleImagesAndGetJson = async (prompt: string, files: File[], schema: any): Promise<any> => {
    const ai = getAI();
    const parts = [{ text: prompt }];
    for (const file of files) {
        const b64 = await fileToBase64(file);
        parts.push({ inlineData: { data: b64, mimeType: file.type } } as any);
    }
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: parts,
        config: { responseMimeType: "application/json", responseSchema: schema }
    });
    return JSON.parse(response.text || '{}');
};

export const findInstitutionsByQuery = async (query: string): Promise<Institution[]> => {
    const prompt = `Find 5 real educational institutions in India matching: "${query}". 
    Return JSON array: [{ "name": "...", "address": "...", "lat": 28.0, "lng": 77.0 }]`;
    const response = await generateText(prompt, 'gemini-3-flash-preview');
    try {
         return JSON.parse(response.replace(/```json|```/g, '').trim());
    } catch { return []; }
};

export const searchWithGrounding = async (query: string): Promise<any> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Changed to Pro for better grounding
        contents: query,
        config: { tools: [{ googleSearch: {} }] }
    });
    // Simplified parsing for demo
    return { 
        summary: response.text || "", 
        places: [], 
        webResults: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ title: c.web?.title, uri: c.web?.uri })) || [] 
    };
};

export const analyzeMarketGap = async (career: string): Promise<any> => {
    const prompt = `Analyze job market for "${career}" in India. JSON: { "trend": "Hindi summary", "demand": "High/Med/Low" }`;
    const text = await generateText(prompt, 'gemini-3-flash-preview');
    try { return JSON.parse(text.replace(/```json|```/g, '').trim()); } catch { return { trend: "Data unavailable", demand: "Unknown" }; }
};

export const generateCurriculum = async (className: string, subject: string, board: string, weeks: number): Promise<any> => {
    const prompt = `Create a ${weeks}-week curriculum for ${subject} (${className}, ${board}). JSON: { "weeks": [{ "week": 1, "topic": "...", "objective": "...", "activity": "..." }] }`;
    const text = await generateText(prompt, 'gemini-3-pro-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const generateLearningPath = async (subject: string, className: string, performance: string): Promise<LearningPath> => {
    const prompt = `Create a remedial learning path for ${subject} (${className}). Student status: ${performance}.
    JSON: { "subject": "${subject}", "steps": [{ "step": 1, "topic": "...", "objective": "...", "status": "To Review", "suggestion": "..." }] }`;
    const text = await generateText(prompt, 'gemini-3-pro-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const generateInterviewFeedback = async (transcripts: Transcript[], role: string, type: string, desc: string): Promise<string> => {
    const conversation = transcripts.map(t => `${t.role}: ${t.text}`).join('\n');
    const prompt = `Analyze this mock interview for ${role} (${type}). 
    Desc: ${desc}.
    Transcript: ${conversation}
    
    Provide feedback in HTML (<h3>, <ul>). Highlight strengths, weaknesses, and a score.`;
    return generateText(prompt, 'gemini-3-pro-preview');
};

export const generateNgoApplicationEssay = async (scholarship: Scholarship, user: User): Promise<string> => {
    const prompt = `Write a Statement of Purpose for ${user.name} applying to ${scholarship.title}. Focus on financial need and academic merit.`;
    return generateText(prompt, 'gemini-3-pro-preview');
};

export const analyzePsychometricResults = async (answers: string[]): Promise<any> => {
    const prompt = `Analyze these psychometric answers: ${JSON.stringify(answers)}. Recommend a career stream. JSON: { "stream": "...", "career": "...", "personality": "..." }`;
    const text = await generateText(prompt, 'gemini-3-flash-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const analyzeGrievance = async (complaint: string): Promise<any> => {
    const prompt = `Analyze complaint: "${complaint}". JSON: { "sentiment": "Urgent/Normal", "category": "Academic/Infra/Other", "summary": "..." }`;
    const text = await generateText(prompt, 'gemini-3-flash-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const generateStudentReport = async (data: any): Promise<string> => {
    const prompt = `Generate a student progress report in HTML based on: ${JSON.stringify(data)}. Use Hindi headings.`;
    return generateText(prompt, 'gemini-3-pro-preview');
};

export const getGitaVerse = async (): Promise<GitaVerse> => {
    const prompt = `Give me a random Bhagavad Gita verse for students. JSON: { "shloka": "...", "hindi_explanation": "...", "english_explanation": "..." }`;
    const text = await generateText(prompt, 'gemini-3-flash-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const getYogaPose = async (): Promise<YogaPose> => {
    const prompt = `Recommend a yoga pose for students. JSON: { "sanskrit_name": "...", "english_name": "...", "instructions_hindi": "...", "instructions_english": "...", "benefits_hindi": "...", "benefits_english": "..." }`;
    const text = await generateText(prompt, 'gemini-3-flash-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const generateSubstitutionPlan = async (absent: string, subject: string, period: string, available: any[]): Promise<any> => {
    const prompt = `Teacher ${absent} (${subject}) is absent for ${period}. Available: ${JSON.stringify(available)}. Pick best substitute. JSON: { "bestMatch": "Name", "reason": "..." }`;
    const text = await generateText(prompt, 'gemini-3-flash-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const generateRecruitmentMaterial = async (exam: string, subject: string, topic: string, mode: string, lang: string): Promise<any> => {
    const prompt = `Create ${mode} content for ${exam} (${subject}: ${topic}) in ${lang}. If quiz, return JSON. If notes, return HTML.`;
    const text = await generateText(prompt, 'gemini-3-pro-preview');
    if (mode === 'quiz') return JSON.parse(text.replace(/```json|```/g, '').trim());
    return text;
};

export const generateProjectDescription = async (title: string, skills: string): Promise<string> => {
    return generateText(`Write a project description for "${title}" requiring ${skills}.`, 'gemini-3-flash-preview');
};

export const generateStudentServicePortfolio = async (title: string, desc: string, skills: string[]): Promise<any> => {
    const prompt = `Create a portfolio HTML and business plan HTML for student service: ${title}. Skills: ${skills.join(', ')}. Return JSON: { "portfolioHtml": "...", "businessPlanHtml": "..." }`;
    const text = await generateText(prompt, 'gemini-3-pro-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const predictFranchiseGrowth = async (name: string, type: string, count: number): Promise<any> => {
    const prompt = `Predict growth for ${name} (${type}) with ${count} students. JSON: { "forecast": "...", "recommendedAction": "..." }`;
    const text = await generateText(prompt, 'gemini-3-flash-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const generateTimetable = async (constraints: TimetableConstraints): Promise<Timetable[]> => {
    const prompt = `Generate a school timetable JSON based on: ${JSON.stringify(constraints)}. Return [{ "className": "...", "timetable": [...] }]`;
    const text = await generateText(prompt, 'gemini-3-pro-preview');
    return JSON.parse(text.replace(/```json|```/g, '').trim());
};

export const generateCertificateText = async (type: string, name: string, exam: string, subjects: any[]): Promise<string> => {
    return generateText(`Write a 2-line congratulatory message for ${name} receiving ${type} for ${exam}. Mention their good performance in ${subjects[0].name}.`, 'gemini-3-flash-preview');
};

export const extractImageFromPdf = async (file: File): Promise<File> => {
    // Placeholder: Real implementation requires PDF.js which is heavy. 
    // For now, we return a mock image or throw if strict. 
    // In a real app, use pdfjs-dist to render page 1 to canvas and toBlob.
    console.warn("PDF image extraction is mocked in this version.");
    return file; // Returning original file as placeholder
};

export const findSarkariJobs = async (qualification: string): Promise<SarkariJob[]> => {
    const prompt = `List 5 latest government jobs in India for ${qualification}. JSON: [{ "title": "...", "organization": "...", "eligibility": "...", "lastDate": "DD-Mon-YYYY", "link": "...", "requiredDocuments": ["..."] }]`;
    const text = await generateText(prompt, 'gemini-3-flash-preview');
    try { return JSON.parse(text.replace(/```json|```/g, '').trim()); } catch { return []; }
};
