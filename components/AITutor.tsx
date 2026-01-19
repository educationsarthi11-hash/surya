
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { ChatMessage } from '../types';
import { fileToBase64 } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import { SparklesIcon, UploadIcon, XCircleIcon, PaperAirplaneIcon, ArrowLeftIcon, BookOpenIcon, CalculatorIcon, SpeakerWaveIcon, StopCircleIcon, CameraIcon, MicrophoneIcon, ShieldCheckIcon, ClockIcon, UserCircleIcon, FaceSmileIcon } from './icons/AllIcons';
import Loader from './Loader';
import { useClassroom } from '../contexts/ClassroomContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpeech } from '../hooks/useSpeech';
import UnifiedScanner from './UnifiedScanner';
import { allLevels, getSubjectsForClass } from '../config/classroomData';

type Mode = 'upload' | 'chat';
type TutorType = 'explainer' | 'solver';
type Persona = 'strict' | 'friend' | 'grandparent';

const AITutor: React.FC = () => {
    const toast = useToast();
    const { selectedClass: contextClass, setSelectedClass } = useClassroom();
    const { selectedLanguage } = useLanguage();

    const [tutorType, setTutorType] = useState<TutorType>('explainer');
    const [localClass, setLocalClass] = useState(contextClass || 'Class 10');
    const [persona, setPersona] = useState<Persona>('friend');
    
    // Inputs
    const [localSubject, setLocalSubject] = useState('');
    const [bookName, setBookName] = useState('');
    const [activeField, setActiveField] = useState<'subject' | 'book' | null>(null);

    // Get available subjects for the selected class
    const availableSubjects = useMemo(() => getSubjectsForClass(localClass), [localClass]);

    // History
    const [history, setHistory] = useState<{subject: string, book: string}[]>([]);

    const [files, setFiles] = useState<File[]>([]);
    const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
    const [mode, setMode] = useState<Mode>('upload');
    const [loading, setLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const { playAudio, stopAudio, playingMessageIndex, isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ 
        enableSpeechRecognition: true,
        initialLanguage: selectedLanguage.code === 'hi' ? 'Hindi' : 'English'
    });

    // Load History
    useEffect(() => {
        const saved = localStorage.getItem('ai_tutor_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // Set default subject when list changes if not set
    useEffect(() => {
        if (availableSubjects.length > 0 && !localSubject) {
            setLocalSubject(availableSubjects[0].name);
        }
    }, [availableSubjects, localSubject]);

    // Handle Voice Input routing
    useEffect(() => {
        if (speechInput && !isListening) {
            if (activeField === 'subject') setLocalSubject(speechInput);
            else if (activeField === 'book') setBookName(speechInput);
            else {
                setInput(speechInput);
                handleSend(speechInput);
            }
            setSpeechInput('');
            setActiveField(null);
        }
    }, [speechInput, isListening, activeField]);

    const handleMicClick = (field: 'subject' | 'book' | null) => {
        if (isListening && activeField === field) {
            toggleListening();
            setActiveField(null);
        } else {
            setActiveField(field);
            setSpeechInput(''); 
            if (!isListening) toggleListening();
        }
    };

    const handleFileChange = (selectedFiles: FileList | null) => {
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prev => [...prev, ...newFiles]);
            const newUrls = newFiles.map(file => URL.createObjectURL(file));
            setFilePreviewUrls(prev => [...prev, ...newUrls]);
        }
    };

    const handleHistoryClick = (item: {subject: string, book: string}) => {
        setLocalSubject(item.subject);
        setBookName(item.book);
    };

    const handleScanIndex = (data: any, file: File) => {
        setFiles([file]);
        setFilePreviewUrls([URL.createObjectURL(file)]);
        toast.success("Index Scanned! AI now knows the syllabus.");
    };

    const handleStartSession = async () => {
        if (!localSubject) {
            toast.error("कृपया विषय (Subject) चुनें।");
            return;
        }

        // Save History
        const newHistory = [{ subject: localSubject, book: bookName }, ...history.filter(h => h.subject !== localSubject)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('ai_tutor_history', JSON.stringify(newHistory));

        setLoading(true);
        setSelectedClass(localClass); 
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let toneInstruction = "";
            if (persona === 'strict') toneInstruction = "You are a Strict Teacher. Focus on facts, accuracy, and discipline. No jokes. Be concise.";
            else if (persona === 'grandparent') toneInstruction = "You are a loving Grandparent (Dadi/Nani/Dada). Start sentences with 'Beta' or 'Bachhe'. Use stories to explain. Be very patient and kind.";
            else toneInstruction = "You are a Friendly Buddy. Use casual language, emojis, analogies, and be encouraging (Example: 'Are waah!', 'Chill').";

            const instruction = `
                You are 'AI Sarthi Tutor' for ${localClass}.
                
                **CONTEXT:**
                - Subject: "${localSubject}"
                - Reference Book: "${bookName || 'Standard Curriculum'}"
                
                **LANGUAGE RULE:**
                - Explanation Language: **${selectedLanguage.nativeName}** (${selectedLanguage.name}).
                - Technical Terms: Keep them in **ENGLISH** (e.g. 'Photosynthesis', 'Gravity').
                
                **PERSONA:**
                ${toneInstruction}
                
                **OUTPUT:**
                - Format response in clean HTML.
            `;
            
            const chatInstance = ai.chats.create({
                model: 'gemini-3-pro-preview',
                config: { systemInstruction: instruction },
            });
            setChat(chatInstance);

            const fileParts: Part[] = await Promise.all(
                files.map(async (file) => {
                    const base64Data = await fileToBase64(file);
                    return { inlineData: { data: base64Data, mimeType: file.type } };
                })
            );
            
            const initialPrompt: Part = { text: files.length > 0 ? "I have uploaded my book index/content. Please analyze it and tell me what we should study first." : `नमस्ते! मैं आपका ${localSubject} (${bookName}) का AI ट्यूटर हूँ। आज हम क्या पढ़ेंगे?` };
            const response = await chatInstance.sendMessage({ message: [initialPrompt, ...fileParts] });

            setMessages([{ sender: 'ai', text: response.text }]);
            setMode('chat');
        } catch (error) {
            toast.error("AI विश्लेषण विफल रहा।");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = useCallback(async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || !chat || loading) return;
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
        setLoading(true);
        try {
            const response = await chat.sendMessage({ message: textToSend });
            setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
        } catch (error) {
            toast.error("Failed to get response.");
        } finally {
            setLoading(false);
        }
    }, [chat, input, loading]);

    return (
        <div className="bg-white rounded-[3.5rem] shadow-2xl h-full flex flex-col overflow-hidden border border-slate-100">
            {mode === 'upload' ? (
                <div className="max-w-4xl mx-auto w-full p-8 sm:p-12 animate-pop-in overflow-y-auto custom-scrollbar">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <SparklesIcon className="h-4 w-4"/> AI Personal Tutor
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">AI सार्थी ट्यूटर</h2>
                        <p className="text-slate-400 font-hindi mt-4 text-lg">आपकी अपनी भाषा ({selectedLanguage.nativeName}) में पढ़ाई।</p>
                    </div>

                    <div className="space-y-6 mb-10">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">1. कक्षा चुनें (Class)</label>
                            <select 
                                value={localClass} 
                                onChange={e => setLocalClass(e.target.value)}
                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-primary outline-none appearance-none"
                            >
                                {allLevels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">2. विषय (Subject)</label>
                                <div className="relative">
                                    <select
                                        value={localSubject}
                                        onChange={e => setLocalSubject(e.target.value)}
                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-primary outline-none appearance-none text-slate-800"
                                    >
                                        <option value="" disabled>विषय चुनें</option>
                                        {availableSubjects.map((sub, idx) => (
                                            <option key={idx} value={sub.name}>{sub.hindi}</option>
                                        ))}
                                        <option value="Other">अन्य (Other)</option>
                                    </select>
                                    {/* Fallback text input if 'Other' is selected or needed manually */}
                                    {localSubject === 'Other' && (
                                         <input 
                                            type="text"
                                            value={localSubject === 'Other' ? '' : localSubject}
                                            onChange={e => setLocalSubject(e.target.value)}
                                            placeholder="विषय का नाम लिखें"
                                            className="w-full p-3 mt-2 bg-white border border-slate-200 rounded-2xl font-medium text-sm"
                                            autoFocus
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">3. किताब (Book Name)</label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        value={bookName} 
                                        onChange={e => setBookName(e.target.value)}
                                        placeholder="जैसे: NCERT, HC Verma..."
                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold focus:border-primary outline-none"
                                    />
                                    <button onClick={() => handleMicClick('book')} className={`absolute right-4 top-4 p-1 rounded-full ${isListening && activeField === 'book' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                                        <MicrophoneIcon className="h-6 w-6"/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent History */}
                        {history.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                <span className="text-[10px] font-bold text-slate-400 self-center uppercase tracking-widest mr-2"><ClockIcon className="h-3 w-3 inline"/> Recent:</span>
                                {history.map((h, i) => (
                                    <button key={i} onClick={() => handleHistoryClick(h)} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-primary hover:text-primary whitespace-nowrap">
                                        {h.subject} ({h.book})
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Teaching Persona */}
                        <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">4. पढ़ाने का तरीका (Teacher Style)</label>
                             <div className="grid grid-cols-3 gap-3 mt-2">
                                 {[
                                     { id: 'friend', label: 'Dost (Funny)', icon: <FaceSmileIcon className="h-5 w-5"/> },
                                     { id: 'strict', label: 'Strict Teacher', icon: <ShieldCheckIcon className="h-5 w-5"/> },
                                     { id: 'grandparent', label: 'Dadi/Nani (Love)', icon: <UserCircleIcon className="h-5 w-5"/> }
                                 ].map(p => (
                                     <button 
                                        key={p.id} 
                                        onClick={() => setPersona(p.id as Persona)}
                                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${persona === p.id ? 'border-primary bg-primary/10 text-primary' : 'border-slate-100 bg-white text-slate-400'}`}
                                     >
                                         {p.icon}
                                         <span className="text-xs font-bold">{p.label}</span>
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        <button onClick={() => setIsScannerOpen(true)} className="p-8 border-4 border-dashed border-primary/20 bg-primary/5 rounded-[3rem] flex flex-col items-center gap-3 hover:bg-primary/10 hover:border-primary transition-all group">
                            <CameraIcon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform"/>
                            <span className="font-black text-primary uppercase text-xs tracking-widest">Scan Book Index / Syllabus</span>
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="p-8 border-4 border-slate-100 bg-slate-50 rounded-[3rem] flex flex-col items-center gap-3 hover:bg-slate-100 transition-all group">
                            <UploadIcon className="h-10 w-10 text-slate-300 group-hover:scale-110 transition-transform"/>
                            <span className="font-black text-slate-400 uppercase text-xs tracking-widest">Upload PDF / Image</span>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" multiple={false} onChange={e => handleFileChange(e.target.files)}/>
                    </div>

                    <button 
                        onClick={handleStartSession}
                        disabled={loading}
                        className="w-full py-6 bg-slate-950 text-white font-black rounded-[2rem] shadow-2xl hover:bg-primary transition-all disabled:opacity-50 transform active:scale-95 text-xl tracking-tight"
                    >
                        {loading ? <Loader message="AI गुरु जी आ रहे हैं..." /> : 'क्लास शुरू करें (Start Class)'}
                    </button>

                    <UnifiedScanner 
                        isOpen={isScannerOpen} 
                        onClose={() => setIsScannerOpen(false)} 
                        onScanComplete={handleScanIndex}
                        prompt="Extract the chapter names and topics from this book index page."
                        title="Book Index Scanner"
                    />
                </div>
            ) : (
                <div className="flex flex-col h-full bg-slate-50">
                    <div className="p-5 bg-white border-b flex justify-between items-center px-10 shadow-sm relative z-20">
                        <button onClick={() => setMode('upload')} className="text-[10px] font-black text-primary flex items-center gap-2 bg-primary/5 px-6 py-2.5 rounded-full hover:bg-primary/10 transition-all uppercase tracking-widest">
                            <ArrowLeftIcon className="h-4 w-4"/> End Class
                        </button>
                        <div className="text-center">
                            <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">{localSubject} Master</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Mode: {persona}</p>
                        </div>
                        <div className="w-24 flex justify-end" title="Safety Active">
                            <ShieldCheckIcon className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar relative">
                         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-xl relative ${m.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-100 rounded-tl-none'}`}>
                                     <div className={`absolute top-0 w-0 h-0 border-[10px] border-transparent ${m.sender === 'user' ? 'right-[-10px] border-t-primary border-l-primary' : 'left-[-10px] border-t-white border-r-white'}`}></div>
                                    <div className={`prose prose-sm font-hindi leading-relaxed ${m.sender === 'user' ? 'text-white' : 'text-slate-700'}`} dangerouslySetInnerHTML={{ __html: m.text }} />
                                    {m.sender === 'ai' && (
                                        <button onClick={() => playAudio(m.text, i)} className="mt-6 text-[10px] font-black uppercase text-primary bg-primary/5 px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/10 transition-all shadow-sm">
                                            {playingMessageIndex === i ? <StopCircleIcon className="h-4 w-4 animate-pulse"/> : <SpeakerWaveIcon className="h-4 w-4"/>} Listen
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="flex justify-start"><div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100"><Loader message="विचार कर रहा हूँ..." /></div></div>}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="p-6 bg-white border-t flex gap-4 px-10 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                        <div className="flex-1 flex items-center bg-slate-50 rounded-[2rem] border-2 border-slate-100 focus-within:border-primary focus-within:bg-white transition-all overflow-hidden shadow-inner pr-2">
                             <button onClick={() => handleMicClick(null)} className={`p-4 transition-all ${isListening && !activeField ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-primary'}`}><MicrophoneIcon className="h-7 w-7"/></button>
                             <input 
                                value={input} 
                                onChange={e => setInput(e.target.value)} 
                                onKeyPress={e => e.key === 'Enter' && handleSend()} 
                                placeholder={`${selectedLanguage.nativeName} में सवाल पूछें...`} 
                                className="flex-1 p-4 bg-transparent border-none focus:ring-0 font-bold font-hindi text-lg"
                             />
                        </div>
                        <button onClick={() => handleSend()} className="p-5 bg-primary text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-primary/30">
                            <PaperAirplaneIcon className="h-8 w-8"/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AITutor;
