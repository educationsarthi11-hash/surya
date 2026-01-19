
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { generateText, generateImageForTopic } from '../services/geminiService';
import { 
    WrenchScrewdriverIcon, SparklesIcon, PlayIcon, 
    ArrowPathIcon, SpeakerWaveIcon, StopCircleIcon, 
    BoltIcon, FireIcon, BeakerIcon, MicrophoneIcon,
    PaperAirplaneIcon, ChatBubbleIcon, XCircleIcon,
    BookOpenIcon, ExclamationTriangleIcon, ClipboardDocumentCheckIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';

interface Experiment {
    id: string;
    title: string;
    hindiTitle: string;
    subject: 'Physics' | 'Chemistry' | 'Biology';
    variables: { name: string; min: number; max: number; unit: string; current: number; safeLimit?: number }[];
    description: string;
}

const experiments: Experiment[] = [
    { id: 'ex-1', title: 'Chemical Reaction', hindiTitle: 'रासायनिक प्रतिक्रिया (Chemical Reaction)', subject: 'Chemistry', variables: [{ name: 'Acid Amount', min: 1, max: 100, unit: 'ml', current: 50, safeLimit: 80 }, { name: 'Base Amount', min: 1, max: 100, unit: 'ml', current: 50 }], description: 'See what happens when you mix Acid and Base.' },
    { id: 'ex-2', title: 'Photosynthesis', hindiTitle: 'प्रकाश संश्लेषण (Photosynthesis)', subject: 'Biology', variables: [{ name: 'Sunlight', min: 0, max: 100, unit: '%', current: 50 }, { name: 'Water', min: 0, max: 100, unit: 'ml', current: 50, safeLimit: 90 }], description: 'Grow a plant by changing Light and Water.' },
    { id: 'ex-3', title: 'Electric Circuit', hindiTitle: 'विद्युत सर्किट (Electric Circuit)', subject: 'Physics', variables: [{ name: 'Battery Voltage', min: 0, max: 24, unit: 'V', current: 9, safeLimit: 18 }, { name: 'Resistance', min: 1, max: 100, unit: 'Ω', current: 10 }], description: 'Control the brightness of the bulb using Ohm\'s Law.' }
];

const AiVirtualLab: React.FC = () => {
    const toast = useToast();
    const [selectedEx, setSelectedEx] = useState<Experiment | null>(null);
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
    
    // Notebook State
    const [notebook, setNotebook] = useState<{title: string, result: string, date: string}[]>([]);
    const [showNotebook, setShowNotebook] = useState(false);

    // Virtual Desk State
    const [isDeskOpen, setIsDeskOpen] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
    const [deskInput, setDeskInput] = useState('');
    const [deskLoading, setDeskLoading] = useState(false);

    const { playAudio, stopAudio, isSpeaking, isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ initialLanguage: 'Hindi' });

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({ 
            model: 'gemini-3-flash-preview', 
            config: { systemInstruction: "You are a friendly Virtual Lab Scientist. Explain science to kids in simple HINDI. Use analogies. Be encouraging." } 
        });
        setChat(chatInstance);
    }, []);

    useEffect(() => {
        if (speechInput && !isListening && isDeskOpen) {
            handleDeskQuery(speechInput);
            setSpeechInput('');
        }
    }, [speechInput, isListening, isDeskOpen]);

    const handleDeskQuery = async (textOverride?: string) => {
        const text = textOverride || deskInput;
        if (!text.trim() || !chat) return;
        setDeskInput('');
        setMessages(prev => [...prev, { sender: 'user', text }]);
        setDeskLoading(true);
        stopAudio();
        try {
            const response = await chat.sendMessage({ message: text });
            const aiText = response.text || "बेटा, समझ नहीं आया।";
            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
            playAudio(aiText, messages.length + 1);
        } catch (e) {
            toast.error("AI सर्वर व्यस्त है।");
        } finally {
            setDeskLoading(false);
        }
    };

    const handleVariableChange = (varName: string, value: number) => {
        if (!selectedEx) return;
        const updatedVars = selectedEx.variables.map(v => v.name === varName ? { ...v, current: value } : v);
        setSelectedEx({ ...selectedEx, variables: updatedVars });
        setSafetyAlert(null); // Clear alert on change
    };

    const runExperiment = async () => {
        if (!selectedEx) return;
        
        // Safety Check Logic
        const unsafeVar = selectedEx.variables.find(v => v.safeLimit && v.current > v.safeLimit);
        if (unsafeVar) {
            setSafetyAlert(`WARNING: ${unsafeVar.name} is too high! This could cause an accident.`);
            toast.error("Safety Violation Detected!");
            playAudio(`सावधान! ${unsafeVar.name} बहुत ज्यादा है। इससे विस्फोट या खराबी हो सकती है।`, 0);
            
            // Generate "Failure" Image/Text
            setLoading(true);
            try {
                 const failPrompt = `Scientific illustration of a FAILED experiment: ${selectedEx.title}. 
                 Cause: Too much ${unsafeVar.name}.
                 Visuals: Explosion, broken glass, smoke, or burnt circuit. 
                 Style: Cartoonish warning style.`;
                 
                 const [textRes, imgUrl] = await Promise.all([
                    generateText(`Explain what happens when ${unsafeVar.name} is too high in a ${selectedEx.title} experiment. Simple Hindi. Warn the student.`, 'gemini-3-flash-preview'),
                    generateImageForTopic(failPrompt)
                 ]);
                 setAiExplanation(textRes);
                 setResultImage(imgUrl);
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        setResultImage(null);
        setAiExplanation('');
        stopAudio();
        const varsContext = selectedEx.variables.map(v => `${v.name}: ${v.current}${v.unit}`).join(', ');
        
        try {
            // Enhanced 3D Prompt
            const imagePrompt = `
                A high-quality 3D scientific visualization of ${selectedEx.title}.
                Scenario: ${varsContext}.
                Style: Educational 3D render, bright colors, clear glass apparatus (if chemistry), glowing components (if physics), vibrant plants (if biology).
                Background: Clean lab setting.
                Make it look like a high-end textbook illustration.
            `;
            
            // Simplified Hindi Explanation Prompt
            const textPrompt = `
                You are a Science Teacher explaining an experiment to a child.
                Experiment: ${selectedEx.title}
                Settings used: ${varsContext}
                
                Task:
                1. Describe what happened in the experiment based on these settings.
                2. Use VERY SIMPLE HINDI (Hinglish allowed for terms).
                3. Use an analogy (e.g. comparing voltage to water pressure).
                4. Format as HTML (<b> for keywords).
                5. Keep it under 4 sentences.
            `;

            const [textRes, imgUrl] = await Promise.all([
                generateText(textPrompt, 'gemini-3-flash-preview'), 
                generateImageForTopic(imagePrompt)
            ]);
            
            setAiExplanation(textRes);
            setResultImage(imgUrl);
            playAudio(textRes, 0);
            toast.success("प्रयोग सफल रहा! (Experiment Success)");
        } catch (e) { 
            toast.error("Lab is busy. Try again."); 
        } finally { 
            setLoading(false); 
        }
    };

    const saveToNotebook = () => {
        if (selectedEx && aiExplanation) {
            setNotebook(prev => [...prev, {
                title: selectedEx.title,
                result: aiExplanation.replace(/<[^>]*>/g, '').substring(0, 100) + "...",
                date: new Date().toLocaleTimeString()
            }]);
            toast.success("Added to Lab Notebook!");
            setShowNotebook(true);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-soft h-full flex flex-col min-h-[600px] relative border border-slate-100">
            {/* Assistance Button */}
            <button 
                onClick={() => setIsDeskOpen(true)}
                className="fixed bottom-32 right-12 z-40 bg-indigo-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-pulse border-4 border-white"
            >
                <ChatBubbleIcon className="h-8 w-8" />
            </button>

            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><WrenchScrewdriverIcon className="h-8 w-8" /></div>
                    <div><h2 className="text-2xl font-bold text-neutral-900">AI Virtual Lab (स्मार्ट लैब)</h2><p className="text-sm text-neutral-500 font-hindi">3D सिमुलेशन और विज्ञान के प्रयोग</p></div>
                </div>
                <button onClick={() => setShowNotebook(!showNotebook)} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all">
                    <BookOpenIcon className="h-4 w-4"/> Lab Notebook ({notebook.length})
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
                {/* Left: Controls */}
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-3">
                        {experiments.map(ex => (
                            <button key={ex.id} onClick={() => { setSelectedEx(ex); setResultImage(null); setAiExplanation(''); setSafetyAlert(null); }} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedEx?.id === ex.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                <h4 className="font-bold text-slate-800 text-sm">{ex.hindiTitle}</h4>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ex.description}</p>
                            </button>
                        ))}
                    </div>
                    {selectedEx && (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6 animate-pop-in">
                            {selectedEx.variables.map(v => (
                                <div key={v.name}>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase"><span>{v.name}</span><span className="text-primary">{v.current} {v.unit}</span></div>
                                    <input type="range" min={v.min} max={v.max} value={v.current} onChange={(e) => handleVariableChange(v.name, Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                                </div>
                            ))}
                            <button onClick={runExperiment} disabled={loading} className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
                                {loading ? <Loader message="..." /> : <><PlayIcon className="h-5 w-5"/> Run Experiment (प्रयोग करें)</>}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Results */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden flex flex-col relative shadow-2xl border-4 border-slate-800">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-white">
                            <Loader message="AI Lab Simulation Running..." />
                            <p className="text-xs text-indigo-300 mt-4 uppercase tracking-widest font-black animate-pulse">Rendering 3D Visuals</p>
                        </div>
                    ) : resultImage ? (
                        <div className="flex-1 flex flex-col overflow-hidden animate-pop-in">
                            <div className={`h-[60%] p-6 flex items-center justify-center relative ${safetyAlert ? 'bg-red-900/50' : 'bg-black/40'}`}>
                                <img src={resultImage} className="max-h-full max-w-full object-contain rounded-xl shadow-2xl drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" alt="Result" />
                                <div className={`absolute bottom-4 right-4 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-widest backdrop-blur-sm ${safetyAlert ? 'bg-red-600' : 'bg-black/60'}`}>
                                    {safetyAlert ? 'FAILURE SIMULATION' : 'AI Generated 3D View'}
                                </div>
                            </div>
                            <div className="flex-1 bg-white p-6 overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><SparklesIcon className="h-6 w-6 text-primary"/> लैब रिपोर्ट (Lab Report)</h3>
                                    <div className="flex gap-2">
                                        <button onClick={saveToNotebook} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600" title="Save to Notebook"><ClipboardDocumentCheckIcon className="h-5 w-5"/></button>
                                        <button onClick={() => isSpeaking ? stopAudio() : playAudio(aiExplanation, 0)} className={`p-2 rounded-full shadow-md transition-all ${isSpeaking ? 'bg-red-500 text-white' : 'bg-slate-100 text-primary'}`}>{isSpeaking ? <StopCircleIcon className="h-5 w-5"/> : <SpeakerWaveIcon className="h-5 w-5"/>}</button>
                                    </div>
                                </div>
                                {safetyAlert && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg flex items-center gap-3">
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600"/>
                                        <p className="text-sm font-bold text-red-800">{safetyAlert}</p>
                                    </div>
                                )}
                                <div className="prose prose-sm max-w-none text-slate-700 font-hindi leading-relaxed font-medium text-lg" dangerouslySetInnerHTML={{ __html: aiExplanation }} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-10 text-center">
                            <BeakerIcon className="h-24 w-24 opacity-20 mb-4" />
                            <h3 className="text-xl font-black text-slate-700 font-hindi">प्रयोग शुरू करें और जादुई विज्ञान देखें।</h3>
                            <p className="text-sm text-slate-500 mt-2 uppercase tracking-widest">Select an experiment to start</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Lab Desk Drawer */}
            {isDeskOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-4 animate-fade-in backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl h-[70vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-pop-in">
                         <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3"><SparklesIcon className="h-8 w-8 text-yellow-300" /><h3 className="font-black text-xl uppercase">AI लैब उस्ताद डेस्क</h3></div>
                            <button onClick={() => {setIsDeskOpen(false); stopAudio();}} className="p-2 hover:bg-white/10 rounded-full"><XCircleIcon className="h-8 w-8"/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50 custom-scrollbar">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-lg font-hindi leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none text-slate-700'}`}>
                                        {m.text}
                                        {m.sender === 'ai' && <button onClick={() => playAudio(m.text, i)} className="ml-2 inline-block"><SpeakerWaveIcon className="h-4 w-4 text-indigo-500"/></button>}
                                    </div>
                                </div>
                            ))}
                            {deskLoading && <Loader message="उस्ताद जी गणना कर रहे हैं..." />}
                        </div>
                        <div className="p-4 bg-white border-t flex gap-3 items-center">
                             <button onClick={toggleListening} className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-bounce' : 'bg-slate-100 text-slate-400'}`}><MicrophoneIcon className="h-6 w-6"/></button>
                             <input value={deskInput} onChange={e => setDeskInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleDeskQuery()} placeholder="अपना विज्ञान का सवाल पूछें..." className="flex-1 p-4 bg-slate-100 rounded-full font-hindi text-sm border-none focus:ring-2 focus:ring-indigo-600 outline-none" />
                             <button onClick={() => handleDeskQuery()} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg"><PaperAirplaneIcon className="h-6 w-6"/></button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Notebook Drawer */}
            {showNotebook && (
                <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-slate-200 transform transition-transform z-20 flex flex-col">
                    <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Lab Notebook</h3>
                        <button onClick={() => setShowNotebook(false)}><XCircleIcon className="h-6 w-6 text-slate-400"/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {notebook.length === 0 ? (
                            <p className="text-center text-slate-400 text-sm mt-10">No experiments saved yet.</p>
                        ) : (
                            notebook.map((entry, i) => (
                                <div key={i} className="p-3 border rounded-lg bg-yellow-50 border-yellow-100 shadow-sm relative">
                                    <div className="absolute top-2 right-2 text-[10px] text-slate-400">{entry.date}</div>
                                    <h4 className="font-bold text-sm text-slate-800 mb-1">{entry.title}</h4>
                                    <p className="text-xs text-slate-600 line-clamp-3">{entry.result}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t">
                        <button className="w-full py-2 bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest">Export PDF</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiVirtualLab;
