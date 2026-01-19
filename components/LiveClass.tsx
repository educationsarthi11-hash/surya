
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { useToast } from '../hooks/useToast';
import { 
    SparklesIcon, MicrophoneIcon, XCircleIcon, MicrophoneSlashIcon, 
    SignalIcon, PresentationChartBarIcon, BoltIcon, StopCircleIcon,
    SpeakerWaveIcon, ShieldCheckIcon, GlobeAltIcon, CameraIcon,
    ChatBubbleIcon, PaperAirplaneIcon, PencilSquareIcon, PhotoIcon,
    CpuChipIcon, LightBulbIcon, MapIcon
} from './icons/AllIcons';
import { generateImageForTopic, getOutputAudioContext, fileToBase64 } from '../services/geminiService';
import Loader from './Loader';
import { Transcript } from '../types';
import UnifiedScanner from './UnifiedScanner';

// Manual Base64 Implementation
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
}

// Raw PCM Audio Decoder
async function decodeAudioStream(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function createBlob(data: Float32Array): { data: string, mimeType: string } {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
        const s = Math.max(-1, Math.min(1, data[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

const LiveClass: React.FC<{ 
    systemInstruction: string; 
    onEnd: (transcripts: Transcript[]) => void; 
    sessionTitle: string; 
    visualAidPromptGenerator: (aiOutput: string) => string; 
    startMuted?: boolean;
    languageName?: string;
    voiceName?: string;
    isRobot?: boolean;
}> = ({ systemInstruction, onEnd, sessionTitle, visualAidPromptGenerator, startMuted = false, languageName = 'English', voiceName = 'Kore', isRobot = false }) => {
    
    const toast = useToast();
    const [status, setStatus] = useState<'connecting' | 'live' | 'error'>('connecting'); 
    
    // Board State
    const [boardNotes, setBoardNotes] = useState<string>(''); // For the blackboard writing effect
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(startMuted);
    const [currentVisual, setCurrentVisual] = useState<string | null>(null);
    const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
    
    // Text Mode State
    const [textInput, setTextInput] = useState('');
    const [showTextInput, setShowTextInput] = useState(false);

    // Vision / Scanner State
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const transcriptsRef = useRef<Transcript[]>([]);
    
    // Auto-scroll board
    const boardEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        transcriptsRef.current = transcripts;
    }, [transcripts]);

    useEffect(() => {
        if (boardEndRef.current) {
            boardEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [boardNotes]);

    const streamRef = useRef<MediaStream | null>(null);
    const sessionRef = useRef<any>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const cleanup = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
        sourcesRef.current.clear();
        if (sessionRef.current) sessionRef.current.close();
    };

    useEffect(() => {
        const startSession = async () => {
            try {
                const outCtx = getOutputAudioContext();
                if (outCtx.state === 'suspended') await outCtx.resume();

                const micStream = await navigator.mediaDevices.getUserMedia({ 
                    audio: { echoCancellation: true, noiseSuppression: true } 
                });
                streamRef.current = micStream;

                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const sessionPromise = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                    callbacks: {
                        onopen: () => {
                            setStatus('live');
                            toast.success("AI गुरु जी क्लास में आ गए हैं! (Connected)");
                            const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                            const source = inCtx.createMediaStreamSource(micStream);
                            const processor = inCtx.createScriptProcessor(4096, 1, 1);
                            processor.onaudioprocess = (audioProcessingEvent) => {
                                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                                const blob = createBlob(inputData);
                                sessionPromise.then(s => {
                                    if (!isMuted) s.sendRealtimeInput({ media: blob });
                                });
                            };
                            source.connect(processor);
                            processor.connect(inCtx.destination);
                        },
                        onmessage: async (message: LiveServerMessage) => {
                            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                            if (audioData) {
                                setIsSpeaking(true);
                                const buffer = await decodeAudioStream(decode(audioData), outCtx, 24000, 1);
                                const source = outCtx.createBufferSource();
                                source.buffer = buffer;
                                source.connect(outCtx.destination);
                                const playTime = Math.max(outCtx.currentTime, nextStartTimeRef.current);
                                source.start(playTime);
                                nextStartTimeRef.current = playTime + buffer.duration;
                                sourcesRef.current.add(source);
                                source.onended = () => {
                                    sourcesRef.current.delete(source);
                                    if (sourcesRef.current.size === 0) setIsSpeaking(false);
                                };
                            }
                            
                            // Accumulate model output text for the BOARD
                            const text = message.serverContent?.modelTurn?.parts?.find(p => p.text)?.text || message.serverContent?.outputAudioTranscription?.text;
                            if (text) {
                                // Add typing effect by appending text
                                setBoardNotes(prev => prev + text);
                                
                                // UPDATED VISUAL TRIGGER LOGIC FOR HINDI
                                // Check for specific Hindi keywords to trigger visuals automatically
                                const lowerText = text.toLowerCase();
                                const shouldGenerate = 
                                    (text.length > 50 && Math.random() > 0.8) || // Random frequent generation
                                    lowerText.includes('dekho') || 
                                    lowerText.includes('chitra') || 
                                    lowerText.includes('photo') ||
                                    lowerText.includes('image') ||
                                    lowerText.includes('udharan') || // Example
                                    lowerText.includes('imagine'); // Imagine

                                if (shouldGenerate && !isGeneratingVisual) {
                                    updateVisuals(text);
                                }
                                
                                setTranscripts(prev => {
                                    const last = prev[prev.length - 1];
                                    if (last && last.role === 'model') {
                                        return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                                    }
                                    return [...prev, { role: 'model', text }];
                                });
                            }

                            const userText = message.serverContent?.inputAudioTranscription?.text;
                            if (userText) {
                                // Show user question on board too
                                setBoardNotes(prev => prev + `\n\n👤 आप: ${userText}\n💡 उत्तर: `);
                                
                                setTranscripts(prev => {
                                    const last = prev[prev.length - 1];
                                    if (last && last.role === 'user') {
                                        return [...prev.slice(0, -1), { ...last, text: last.text + userText }];
                                    }
                                    return [...prev, { role: 'user', text: userText }];
                                });
                            }
                        },
                        onerror: () => setStatus('error'),
                        onclose: () => onEnd(transcriptsRef.current)
                    },
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } } },
                        systemInstruction,
                        outputAudioTranscription: {},
                        inputAudioTranscription: {}
                    }
                });
                sessionRef.current = await sessionPromise;
            } catch (e) { setStatus('error'); }
        };

        startSession();
        return cleanup;
    }, []);

    const updateVisuals = async (text: string) => {
        if (isGeneratingVisual) return;
        setIsGeneratingVisual(true);
        try {
            // Use the generator passed from props which is now updated to handle Hindi text
            const imgPrompt = visualAidPromptGenerator(text);
            const img = await generateImageForTopic(imgPrompt);
            if (img) {
                setCurrentVisual(img);
            }
        } catch (e) {
            console.error("Visual generation failed", e);
        } finally { 
            setIsGeneratingVisual(false); 
        }
    };

    const handleTextSend = async () => {
        if (!textInput.trim() || !sessionRef.current) return;
        setIsMuted(true);
        const session = await sessionRef.current;
        session.sendRealtimeInput({
            content: [{ text: textInput }] 
        });
        setBoardNotes(prev => prev + `\n\n👤 आप: ${textInput}\n💡 उत्तर: `);
        setTranscripts(prev => [...prev, { role: 'user', text: textInput }]);
        setTextInput('');
    };

    const triggerAction = async (action: string) => {
        if (!sessionRef.current) return;
        // Temporarily mute to send command so audio doesn't feedback immediately as user input
        // (Though echo cancellation helps, explicit mute is safer for commands)
        
        const session = await sessionRef.current;
        
        let command = "";
        if (action === "MindMap") {
            command = "ACTION: MINDMAP. Please summarize the recent topic into a structured Mind Map on the board. Do not speak the full list, just summarize verbally.";
            setBoardNotes(prev => prev + `\n\n[🤖 MAKING MIND MAP...]\n`);
        } else if (action === "Quiz") {
            command = "ACTION: QUIZ. Ask me a short conceptual question about what we just discussed. Wait for my answer.";
            setBoardNotes(prev => prev + `\n\n[🤖 QUIZ TIME!]\n`);
        }

        session.sendRealtimeInput({
            content: [{ text: command }] 
        });
    };

    const handleImageInput = async (data: any, file: File) => {
        if (!sessionRef.current) return;
        toast.info("AI गुरु जी आपकी फोटो देख रहे हैं...");
        try {
            const base64 = await fileToBase64(file);
            setCurrentVisual(URL.createObjectURL(file)); 
            const session = await sessionRef.current;
            session.sendRealtimeInput({ media: { mimeType: file.type, data: base64 } });
        } catch (e) {
            console.error("Failed to send image to live session", e);
            toast.error("Image upload failed.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#020617] text-white font-sans">
            {/* Header */}
            <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <h3 className="font-black text-sm uppercase tracking-widest">{sessionTitle}</h3>
                    </div>
                    {isRobot && (
                         <div className="hidden sm:flex items-center gap-2 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                            <CpuChipIcon className="h-4 w-4 text-cyan-400"/>
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Robot Teacher Mode</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                        <GlobeAltIcon className="h-3 w-3"/> Auto-Translate Active
                     </span>
                     <button onClick={() => onEnd(transcripts)} className="p-2 bg-red-600 rounded-xl hover:bg-red-700 transition-colors"><XCircleIcon className="h-6 w-6" /></button>
                </div>
            </div>

            {/* Main Classroom Area */}
            <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                
                {/* 1. SMART BLACKBOARD (Writing Area) */}
                <div className="lg:col-span-8 bg-[#1e293b] rounded-[2rem] relative flex flex-col overflow-hidden border-8 border-slate-800 shadow-3xl">
                    <div className="absolute top-0 left-0 w-full h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <PencilSquareIcon className="h-4 w-4 text-green-400"/>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Digital Board Active...</span>
                        </div>
                        {isSpeaking && <span className="text-[10px] text-green-400 font-bold animate-pulse">WRITING...</span>}
                    </div>
                    
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar font-hindi text-xl sm:text-2xl leading-loose text-white/90 whitespace-pre-wrap font-medium pt-12">
                        {boardNotes ? (
                             <>
                                {boardNotes}
                                {isSpeaking && <span className="inline-block w-2 h-6 bg-green-400 ml-1 animate-pulse align-middle"></span>}
                             </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <PresentationChartBarIcon className="h-24 w-24 mb-4"/>
                                <p className="font-bold text-lg">Waiting for Teacher...</p>
                                <p className="text-sm mt-2 text-center max-w-sm">"नमस्ते! मैं आपका रोबोट टीचर हूँ। मुझसे कुछ भी पूछें, मैं लिखकर और बोलकर समझाऊँगा।"</p>
                            </div>
                        )}
                        <div ref={boardEndRef}></div>
                    </div>
                </div>

                {/* 2. AVATAR & VISUALS (Side Panel) */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    
                    {/* Visualizer / Robot Face */}
                    <div className="bg-black rounded-[2rem] border-4 border-slate-800 relative h-1/2 overflow-hidden flex items-center justify-center group shadow-lg">
                        {/* Robot Avatar Overlay */}
                        {isRobot && !currentVisual && (
                            <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
                                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center bg-slate-900 shadow-[0_0_50px_rgba(6,182,212,0.4)] ${isSpeaking ? 'border-cyan-400 shadow-cyan-500/50' : 'border-slate-600'}`}>
                                    <div className="flex gap-4">
                                        <div className={`w-6 h-6 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-bounce' : 'bg-slate-500'}`}></div>
                                        <div className={`w-6 h-6 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-bounce delay-75' : 'bg-slate-500'}`}></div>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-1">
                                     <span className="w-2 h-6 bg-cyan-500 rounded-full animate-wave"></span>
                                     <span className="w-2 h-10 bg-cyan-500 rounded-full animate-wave delay-75"></span>
                                     <span className="w-2 h-6 bg-cyan-500 rounded-full animate-wave delay-150"></span>
                                </div>
                            </div>
                        )}

                        {isGeneratingVisual && <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"><Loader message="चित्र बना रहा हूँ..." /></div>}
                        
                        {currentVisual && (
                            <>
                                <img src={currentVisual} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="Class Visual"/>
                                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white backdrop-blur-sm flex items-center gap-1"><PhotoIcon className="h-3 w-3"/> AI Image</div>
                            </>
                        )}
                    </div>

                    {/* Interaction Panel (NEW: Mind Map & Quiz Buttons) */}
                    <div className="bg-slate-900 rounded-[2rem] border border-white/5 p-5 flex flex-col gap-4 flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><BoltIcon className="h-4 w-4"/> Interaction</h4>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => triggerAction('MindMap')} 
                                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10" 
                                    title="Create Mind Map (समरी)"
                                >
                                    <MapIcon className="h-4 w-4 text-green-400"/>
                                </button>
                                <button 
                                    onClick={() => triggerAction('Quiz')} 
                                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10" 
                                    title="Quick Quiz (सवाल पूछो)"
                                >
                                    <LightBulbIcon className="h-4 w-4 text-yellow-400"/>
                                </button>
                                <button 
                                    onClick={() => setShowTextInput(!showTextInput)} 
                                    className={`p-2 rounded-lg transition-colors border border-white/10 ${showTextInput ? 'bg-primary text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}
                                >
                                    <ChatBubbleIcon className="h-4 w-4"/>
                                </button>
                            </div>
                        </div>

                        {showTextInput ? (
                            <div className="flex gap-2 animate-slide-in-up mt-auto">
                                <input 
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleTextSend()}
                                    placeholder="लिखकर पूछें..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary font-hindi"
                                />
                                <button onClick={handleTextSend} className="p-3 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors">
                                    <PaperAirplaneIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        ) : (
                            <div className="mt-auto bg-slate-800 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-xs text-slate-300 font-hindi leading-relaxed">
                                    "माइक ऑन करें और पूछें, 'मुझे हिंदी में समझाओ' या 'फोटो दिखाओ'।"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-6 flex justify-center items-center gap-8 bg-slate-900/90 backdrop-blur-xl border-t border-white/5">
                 <button onClick={() => setIsMuted(!isMuted)} className={`p-6 rounded-full shadow-2xl transition-all active:scale-95 border-4 ${isMuted ? 'bg-red-600 border-red-400' : 'bg-slate-700 border-slate-500 hover:bg-slate-600'}`}>
                    {isMuted ? <MicrophoneSlashIcon className="h-8 w-8 text-white" /> : <MicrophoneIcon className="h-8 w-8 text-white" />}
                 </button>
                 
                 <div className="relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-primary/30 animate-bounce whitespace-nowrap">Show Homework / Book</div>
                    <button 
                        onClick={() => setIsScannerOpen(true)} 
                        className="p-8 bg-primary rounded-full shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-110 transition-all border-4 border-white active:scale-95 group"
                    >
                        <CameraIcon className="h-10 w-10 text-slate-900 group-hover:text-white transition-colors"/>
                    </button>
                 </div>
            </div>

            <UnifiedScanner 
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanComplete={handleImageInput}
                title="Live Doubt Scanner"
                prompt="Analyze this image for the live class context. Explain what is in the image to the student."
            />

            <style>{`
                @keyframes wave { 0%, 100% { height: 20%; } 50% { height: 80%; } }
                .animate-wave { animation: wave 0.8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default LiveClass;
