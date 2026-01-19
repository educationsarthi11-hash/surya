
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useSpeech } from '../hooks/useSpeech';
import { useToast } from '../hooks/useToast';
import { ChatMessage } from '../types';
import { MicrophoneIcon, SpeakerWaveIcon, SparklesIcon, UserCircleIcon, BriefcaseIcon, ShoppingCartIcon, HeartIcon, PlayIcon, CheckCircleIcon, ArrowPathIcon, AcademicCapIcon, StopCircleIcon } from './icons/AllIcons';
import Loader from './Loader';

// --- Types ---
type Mode = 'roleplay' | 'builder';

interface RoleplayScenario {
    id: string;
    title: string;
    role: string;
    context: string;
    icon: React.ReactNode;
    color: string;
}

const scenarios: RoleplayScenario[] = [
    { id: 'cafe', title: 'Coffee Shop (कॉफी शॉप)', role: 'Barista', context: 'Ordering a coffee and a sandwich. The barista is friendly.', icon: <ShoppingCartIcon className="h-6 w-6"/>, color: 'bg-orange-100 text-orange-600' },
    { id: 'interview', title: 'Job Interview (नौकरी इंटरव्यू)', role: 'HR Manager', context: 'An entry-level job interview. Asking about skills and strengths.', icon: <BriefcaseIcon className="h-6 w-6"/>, color: 'bg-blue-100 text-blue-600' },
    { id: 'doctor', title: 'Doctor Visit (डॉक्टर के पास)', role: 'Doctor', context: 'Describing symptoms of fever and cold.', icon: <HeartIcon className="h-6 w-6"/>, color: 'bg-red-100 text-red-600' },
    { id: 'friend', title: 'Meeting a Friend (नए दोस्त)', role: 'Student', context: 'Meeting a new friend at college campus.', icon: <UserCircleIcon className="h-6 w-6"/>, color: 'bg-green-100 text-green-600' },
];

const AILanguageLab: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<Mode>('roleplay');
    
    // Voice Hook
    const { isListening, speechInput, setSpeechInput, toggleListening, playAudio, stopAudio, playingMessageIndex } = useSpeech({ 
        enableSpeechRecognition: true, 
        initialLanguage: 'English' 
    });

    // --- ROLEPLAY STATE ---
    const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- SENTENCE BUILDER STATE ---
    const [builderQuestion, setBuilderQuestion] = useState<{ hindi: string, englishWords: string[], correct: string } | null>(null);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [builderStatus, setBuilderStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isAiTyping]);

    // Handle Speech Input
    useEffect(() => {
        if (speechInput && !isListening) {
            if (activeTab === 'roleplay' && selectedScenario) {
                handleRoleplaySend(speechInput);
            }
            setSpeechInput('');
        }
    }, [speechInput, isListening, activeTab, selectedScenario]);

    // --- ROLEPLAY LOGIC ---
    const startRoleplay = async (scenario: RoleplayScenario) => {
        setSelectedScenario(scenario);
        setChatMessages([]);
        setIsAiTyping(true);
        stopAudio();

        const prompt = `Act as a ${scenario.role} in a ${scenario.title} scenario. The user is a student learning English. 
        Start the conversation with a simple, friendly greeting in English. 
        Context: ${scenario.context}.
        Keep your response concise (max 2 sentences).`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            const text = response.text || "Hello! How can I help you today?";
            setChatMessages([{ sender: 'ai', text }]);
            playAudio(text, 0, 'Puck');
        } catch (e) {
            toast.error("Could not start conversation.");
            setSelectedScenario(null);
        } finally {
            setIsAiTyping(false);
        }
    };

    const handleRoleplaySend = async (textOverride?: string) => {
        const text = textOverride || input;
        if (!selectedScenario || !text.trim()) return;
        
        setInput('');
        stopAudio();
        
        // Add user message
        const newMsgs = [...chatMessages, { sender: 'user', text } as ChatMessage];
        setChatMessages(newMsgs);
        setIsAiTyping(true);

        const contextHistory = newMsgs.map(m => `${m.sender === 'user' ? 'Student' : selectedScenario.role}: ${m.text}`).join('\n');

        const prompt = `
            You are a friendly English tutor playing the role of a ${selectedScenario.role}.
            
            Conversation History:
            ${contextHistory}

            User's last message: "${text}"

            Task:
            1. Analyze the user's English grammar and vocabulary.
            2. If there is a mistake, explain it gently in **HINDI**. Tell them the correct English sentence.
            3. Then, continue the roleplay naturally as the ${selectedScenario.role} in English.

            Output Format (HTML):
            <div class="mb-2">
                [Your Roleplay Response in English]
            </div>
            <div class="text-xs bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-200">
                💡 <b>फीडबैक:</b> [Explanation in Hindi if needed, otherwise say "बहुत बढ़िया! (Great job!)"]
            </div>
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });
            const responseText = response.text || "I didn't catch that.";
            
            // Extract just the English part for audio reading (simple heuristic)
            let spokenText = responseText.replace(/<[^>]*>/g, ' ').replace(/💡.*$/, '').trim();
            // If the regex stripped too much, fallback to raw text (Gemini usually structures well)
            if (spokenText.length < 5) spokenText = "Can you say that again?";

            const aiMsg = { sender: 'ai', text: responseText } as ChatMessage;
            setChatMessages(prev => [...prev, aiMsg]);
            
            // Speak only the English response part
            playAudio(spokenText, newMsgs.length, 'Puck');

        } catch (e) {
            toast.error("AI connection failed.");
        } finally {
            setIsAiTyping(false);
        }
    };

    // --- SENTENCE BUILDER LOGIC ---
    const loadBuilderQuestion = async () => {
        setBuilderQuestion(null);
        setBuilderStatus('idle');
        setSelectedWords([]);
        
        try {
            // Generate a dynamic sentence
            const prompt = `Generate a simple English sentence (5-8 words) for a beginner student and its Hindi translation. Return JSON: { "hindi": "...", "english": "..." }`;
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });
            
            const data = JSON.parse(response.text || '{}');
            if (data.english) {
                const words = data.english.split(' ').sort(() => Math.random() - 0.5);
                setBuilderQuestion({ hindi: data.hindi, englishWords: words, correct: data.english });
            }
        } catch(e) {
            // Fallback
            const fallback = { hindi: "मैं अंग्रेजी सीख रहा हूँ।", english: "I am learning English" };
            setBuilderQuestion({ 
                hindi: fallback.hindi, 
                englishWords: fallback.english.split(' ').sort(() => Math.random() - 0.5), 
                correct: fallback.english 
            });
        }
    };

    useEffect(() => {
        if (activeTab === 'builder' && !builderQuestion) loadBuilderQuestion();
    }, [activeTab]);

    const handleWordClick = (word: string) => {
        setSelectedWords([...selectedWords, word]);
        setBuilderQuestion(prev => prev ? ({ ...prev, englishWords: prev.englishWords.filter(w => w !== word) }) : null);
    };

    const handleWordRemove = (word: string) => {
        setSelectedWords(selectedWords.filter(w => w !== word));
        setBuilderQuestion(prev => prev ? ({ ...prev, englishWords: [...prev.englishWords, word] }) : null);
    };

    const checkSentence = () => {
        if (!builderQuestion) return;
        const formed = selectedWords.join(' ').replace(/[.,!?]/g, '').trim().toLowerCase();
        const correct = builderQuestion.correct.replace(/[.,!?]/g, '').trim().toLowerCase();
        
        if (formed === correct) {
            setBuilderStatus('success');
            playAudio("Correct! " + builderQuestion.correct, 0, 'Zephyr');
            toast.success("बिल्कुल सही! (Correct!)");
            setTimeout(() => loadBuilderQuestion(), 2000);
        } else {
            setBuilderStatus('error');
            toast.error("फिर से कोशिश करें (Try Again)");
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-soft h-full min-h-[600px] flex flex-col overflow-hidden border border-slate-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 shrink-0 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
                        <AcademicCapIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Language Lab</h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">English Speaking Course</p>
                    </div>
                </div>
                
                <div className="flex bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto">
                    <button onClick={() => setActiveTab('roleplay')} className={`flex-1 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'roleplay' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                        Roleplay (बातचीत)
                    </button>
                    <button onClick={() => setActiveTab('builder')} className={`flex-1 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'builder' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                        Grammar Game
                    </button>
                </div>
            </div>

            {/* --- ROLEPLAY VIEW --- */}
            {activeTab === 'roleplay' && (
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {!selectedScenario ? (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            <h3 className="text-lg font-bold text-slate-700 mb-4">Choose a Scenario (परिस्थिति चुनें)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {scenarios.map(scene => (
                                    <button 
                                        key={scene.id}
                                        onClick={() => startRoleplay(scene)}
                                        className="flex items-start gap-4 p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/50 hover:shadow-lg transition-all text-left group bg-white"
                                    >
                                        <div className={`p-4 rounded-xl ${scene.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                            {scene.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">{scene.title}</h3>
                                            <p className="text-sm text-slate-500 mt-1 font-medium">Role: {scene.role}</p>
                                            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{scene.context}</p>
                                        </div>
                                        <PlayIcon className="self-center h-8 w-8 text-slate-200 group-hover:text-indigo-500 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative">
                            {/* Chat Header */}
                            <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${selectedScenario.color}`}>{selectedScenario.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{selectedScenario.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium">Practice with AI {selectedScenario.role}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setSelectedScenario(null); stopAudio(); }} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-100">End Session</button>
                            </div>
                            
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                                {chatMessages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl shadow-sm overflow-hidden ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-100 rounded-bl-none text-slate-800'}`}>
                                            <div className="p-4 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }} />
                                            {msg.sender === 'ai' && (
                                                <div className="px-4 pb-3 pt-0">
                                                    <button 
                                                        onClick={() => playAudio(msg.text.replace(/<[^>]*>/g, ' ').replace(/💡.*$/, ''), idx, 'Puck')} 
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors w-fit ${playingMessageIndex === idx ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                    >
                                                         {playingMessageIndex === idx ? <><StopCircleIcon className="h-3 w-3"/> Stop</> : <><SpeakerWaveIcon className="h-3 w-3"/> Listen</>}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isAiTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 flex gap-1.5 items-center">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef}></div>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t">
                                <div className="flex gap-2 items-center bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                    <button 
                                        onClick={toggleListening}
                                        className={`p-3 rounded-full transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-500 hover:text-indigo-600'}`}
                                    >
                                        <MicrophoneIcon className="h-5 w-5"/>
                                    </button>
                                    <input 
                                        type="text" 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2 text-slate-800 placeholder:text-slate-400"
                                        placeholder="Type or speak in English..."
                                        onKeyPress={(e) => e.key === 'Enter' && handleRoleplaySend()}
                                    />
                                    <button 
                                        onClick={() => handleRoleplaySend()}
                                        disabled={!input.trim()}
                                        className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-transform active:scale-95"
                                    >
                                        <ArrowPathIcon className="h-5 w-5 rotate-90" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- BUILDER VIEW --- */}
            {activeTab === 'builder' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in-up bg-slate-50/50 rounded-2xl border border-slate-100">
                    {!builderQuestion ? (
                        <div className="text-center">
                            <Loader message="Creating a new challenge..." />
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl text-center space-y-10">
                            <div>
                                <p className="text-xs font-extrabold text-indigo-500 uppercase tracking-widest mb-3">Translate into English</p>
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 font-hindi leading-snug">{builderQuestion.hindi}</h3>
                            </div>

                            {/* Drop Zone */}
                            <div className={`min-h-[100px] p-6 border-2 border-dashed rounded-2xl flex flex-wrap gap-3 justify-center items-center transition-all ${builderStatus === 'success' ? 'border-green-500 bg-green-50' : builderStatus === 'error' ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'}`}>
                                {selectedWords.length === 0 && <span className="text-slate-400 text-sm font-medium">Tap words below to build the sentence</span>}
                                {selectedWords.map((word, idx) => (
                                    <button key={idx} onClick={() => handleWordRemove(word)} className="px-5 py-2 bg-indigo-600 text-white shadow-md rounded-xl font-bold hover:bg-red-500 transition-colors animate-pop-in">
                                        {word}
                                    </button>
                                ))}
                            </div>

                            {/* Word Bank */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                {builderQuestion.englishWords.map((word, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => handleWordClick(word)}
                                        className="px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
                                    >
                                        {word}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-center gap-4 pt-4">
                                <button onClick={loadBuilderQuestion} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Skip</button>
                                <button onClick={checkSentence} className="px-10 py-3 bg-green-600 text-white font-bold rounded-xl shadow-xl hover:bg-green-700 transform hover:-translate-y-1 transition-all flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5"/> Check Answer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AILanguageLab;
