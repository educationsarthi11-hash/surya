
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, User } from '../types';
import { generateImageForTopic, generateText, fileToBase64 } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { CubeIcon, SparklesIcon, PaperAirplaneIcon, UserCircleIcon, VideoCameraIcon, XIcon, SpeakerWaveIcon, StopCircleIcon, EyeIcon, UploadIcon, PhotoIcon } from './icons/AllIcons';
import { useSpeech } from '../hooks/useSpeech';

const predefinedModels = [
    { id: 'heart', name: 'Human Heart (मानव हृदय)', prompt: 'A hyper-realistic 3D cross-section render of a human heart for kids education. Bright colors (red, blue veins), clear ventricles and atriums, floating in mid-air, clean white background. High definition.' },
    { id: 'solar', name: 'Solar System (सौर मंडल)', prompt: 'A stunning 3D render of the Solar System. The Sun in the center, bright and glowing, with 3D planets orbiting around it. Dark space background with stars. Educational cartoon style but realistic textures.' },
    { id: 'dna', name: 'DNA (डीएनए)', prompt: 'A beautiful 3D double helix DNA strand. Glowing blue and pink connections. Floating in a scientific lab background. Macro photography style, very detailed.' },
];

interface Interactive3DLabProps {
    user: User;
    setActiveService: (s: any) => void;
}

const Interactive3DLab: React.FC<Interactive3DLabProps> = ({ user }) => {
    const toast = useToast();
    const [selectedModel, setSelectedModel] = useState<{ id: string; name: string; prompt: string } | null>(null);
    const [modelImageUrl, setModelImageUrl] = useState<string | null>(null);
    const [loadingModel, setLoadingModel] = useState(false);
    
    // Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    
    // Chat State
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loadingChat, setLoadingChat] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isVrMode, setIsVrMode] = useState(false);
    
    // 3D Tilt Effect Refs
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- 3D Tilt Effect Logic ---
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;
        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        // Calculate rotation (max 20 degrees)
        const rotateX = (0.5 - y) * 20; 
        const rotateY = (x - 0.5) * 20;

        imageContainerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
        if (!imageContainerRef.current) return;
        imageContainerRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedFile(file);
            handleCustom3DGen(file);
        }
    };

    const handleCustom3DGen = async (file: File) => {
        setLoadingModel(true);
        setModelImageUrl(null);
        setMessages([]);
        setChat(null);
        stopAudio();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = await fileToBase64(file);

            // 1. Identify Image
            const visionPrompt = "Identify the main object in this image (e.g. a cell, a motor, a monument). Return just the name.";
            const visionRes = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [{ text: visionPrompt }, { inlineData: { mimeType: file.type, data: base64Data } }]
            });
            const objectName = visionRes.text || "Object";

            // 2. Generate 3D Render
            const renderPrompt = `A high-quality 3D glossy render of a ${objectName}. Isolated on a clean dark gradient background. Studio lighting, 4k resolution, educational scientific illustration style. Make it look like it's popping out of the screen.`;
            const imagePromise = generateImageForTopic(renderPrompt);

            // 3. Generate Explanation
            const explanationPrompt = `
                Act as a 3D Lab Guide. Explain "${objectName}" in simple HINDI.
                Structure:
                <h3>${objectName} (3D View)</h3>
                <p><b>क्या है:</b> [Simple Definition]</p>
                <p><b>कैसे काम करता है:</b> [Function]</p>
            `;
            const textPromise = generateText(explanationPrompt, 'gemini-3-flash-preview');

            const [imageUrl, initialText] = await Promise.all([imagePromise, textPromise]);
            
            setModelImageUrl(imageUrl);
            setSelectedModel({ id: 'custom', name: objectName, prompt: renderPrompt });

            // Setup Chat
            const chatInstance = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: { systemInstruction: `You are a 3D Lab Guide explaining ${objectName}. Speak in Hindi.` },
            });
            setChat(chatInstance);
            setMessages([{ sender: 'ai', text: initialText }]);
            playAudio(initialText, 0);

        } catch (e) {
            toast.error("3D स्कैन विफल रहा।");
        } finally {
            setLoadingModel(false);
        }
    };

    const handleModelSelect = async (model: { id: string; name: string; prompt: string }) => {
        setSelectedModel(model);
        setUploadedFile(null);
        setLoadingModel(true);
        setModelImageUrl(null);
        setMessages([]);
        setChat(null);
        stopAudio();

        try {
            const imagePromise = generateImageForTopic(model.prompt);
            const explanationPrompt = `Explain "${model.name}" in simple HINDI. Format as HTML.`;
            const textPromise = generateText(explanationPrompt, 'gemini-3-flash-preview');

            const [imageUrl, initialText] = await Promise.all([imagePromise, textPromise]);
            
            setModelImageUrl(imageUrl);

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chatInstance = ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: { systemInstruction: `You are a friendly 3D Lab Guide explaining ${model.name}. Speak in Hindi.` },
            });
            setChat(chatInstance);
            setMessages([{ sender: 'ai', text: initialText }]);
            playAudio(initialText, 0);

        } catch (error) {
            toast.error("3D मॉडल लोड नहीं हो सका।");
        } finally {
            setLoadingModel(false);
        }
    };

     const handleSend = async () => {
        if (!input.trim() || !chat || loadingChat) return;
        const textToSend = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
        setLoadingChat(true);
        stopAudio();
        try {
            const response = await chat.sendMessage({ message: textToSend });
            setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
            playAudio(response.text, messages.length + 1);
        } catch (error) { toast.error("AI जवाब नहीं दे पा रहा है।"); } 
        finally { setLoadingChat(false); }
    };

    return (
        <div className={`bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 p-4 sm:p-6 rounded-xl shadow-soft flex flex-col ${isVrMode ? 'fixed inset-0 z-50 p-0 rounded-none' : 'min-h-[80vh] min-h-[600px] border-8 border-slate-800'}`}>
            {!isVrMode && (
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-3 rounded-2xl shadow-lg"><CubeIcon className="h-8 w-8 text-cyan-400"/></div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Magic 3D Lab</h2>
                            <p className="text-sm text-cyan-200 font-hindi">अपनी फोटो को 3D में देखें</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
                        >
                            <UploadIcon className="h-4 w-4"/> Upload Your Photo
                         </button>
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </div>
                </div>
            )}

            <div className={`flex-1 grid ${isVrMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'} gap-6 overflow-hidden relative`}>
                {/* Sidebar (Hidden in VR) */}
                {!isVrMode && (
                    <div className="lg:col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar bg-white/5 rounded-3xl p-4 border border-white/10">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Library</h3>
                        <div className="space-y-3">
                            {predefinedModels.map(model => (
                                <button
                                    key={model.id}
                                    onClick={() => handleModelSelect(model)}
                                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all group ${selectedModel?.id === model.id ? 'bg-cyan-500/20 border-cyan-400' : 'bg-slate-800/50 border-transparent hover:bg-slate-800'}`}
                                >
                                    <span className={`font-bold text-sm ${selectedModel?.id === model.id ? 'text-cyan-300' : 'text-slate-300 group-hover:text-white'}`}>{model.name}</span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                             <p className="text-[10px] text-purple-300 font-bold uppercase mb-2 flex items-center gap-2"><SparklesIcon className="h-3 w-3"/> Try This:</p>
                             <p className="text-xs text-white/80 font-hindi">अपनी साइंस की किताब से 'Heart' या 'Brain' का चित्र अपलोड करें, AI उसे 3D बना देगा!</p>
                        </div>
                    </div>
                )}

                {/* 3D Viewer Stage */}
                <div className={`${isVrMode ? 'w-full h-full' : 'lg:col-span-6'} relative flex items-center justify-center`}>
                    <div 
                        className={`w-full h-full bg-black/60 rounded-[3rem] border-4 border-slate-700 relative flex items-center justify-center p-8 overflow-hidden shadow-2xl transition-all duration-300 ${isVrMode ? 'rounded-none border-none' : ''}`}
                        style={{ perspective: '1000px' }}
                    >
                        {(isVrMode) && (
                            <button 
                                onClick={() => setIsVrMode(false)}
                                className="absolute top-4 right-4 z-50 bg-white/10 text-white p-3 rounded-full hover:bg-red-500 transition-colors"
                            >
                                <XIcon className="h-6 w-6" />
                            </button>
                        )}

                        {loadingModel && (
                            <div className="flex flex-col items-center relative z-10">
                                <Loader message="Creating 3D Hologram..." />
                                <p className="text-cyan-400 text-xs mt-4 animate-pulse uppercase font-black tracking-widest">Applying Depth & Textures...</p>
                            </div>
                        )}
                        
                        {!loadingModel && modelImageUrl && (
                            <div 
                                ref={imageContainerRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out cursor-pointer"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* The 3D Image */}
                                <img 
                                    src={modelImageUrl} 
                                    alt="3D Model" 
                                    className={`object-contain max-w-full max-h-full drop-shadow-[0_20px_50px_rgba(6,182,212,0.4)] ${isVrMode ? 'w-1/2' : ''}`} 
                                    style={{ transform: 'translateZ(50px)' }}
                                />
                                
                                {/* Overlay VR Controls if needed */}
                                {!isVrMode && (
                                    <div className="absolute bottom-6 flex gap-4" style={{ transform: 'translateZ(60px)' }}>
                                         <button 
                                            onClick={() => setIsVrMode(true)}
                                            className="bg-black/60 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-cyan-500 transition-colors text-xs font-black uppercase tracking-widest border border-white/20 backdrop-blur-md"
                                        >
                                            <VideoCameraIcon className="h-4 w-4" /> Full Screen Mode
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {!loadingModel && !modelImageUrl && (
                             <div className="text-center text-slate-500 opacity-50 relative z-10">
                                <PhotoIcon className="h-24 w-24 mx-auto mb-4"/>
                                <p className="font-hindi text-xl font-bold">यहाँ कोई भी फोटो अपलोड करें</p>
                                <p className="text-sm mt-2">AI उसे 3D में बदल देगा।</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Info & Chat Panel (Right Side) */}
                {!isVrMode && (
                    <div className="lg:col-span-3 flex flex-col h-full overflow-hidden bg-slate-900 rounded-3xl border-l-4 border-slate-800 shadow-xl">
                        <div className="p-4 bg-slate-800 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                <SparklesIcon className="h-4 w-4"/> Info Card
                            </h3>
                            {isSpeaking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                        </div>
                        
                        <div ref={messagesEndRef} className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar bg-slate-900">
                             {messages.length === 0 && (
                                 <div className="text-center text-slate-600 mt-10">
                                     <p className="text-xs">Model की जानकारी यहाँ आएगी।</p>
                                 </div>
                             )}
                             {messages.map((msg, index) => (
                                <div key={index} className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 rounded-2xl text-sm font-hindi leading-relaxed shadow-md border ${msg.sender === 'user' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white text-slate-900 border-slate-200'}`}>
                                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                    </div>
                                    {msg.sender === 'ai' && (
                                        <button onClick={() => playAudio(msg.text, index)} className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 ml-2">
                                            <SpeakerWaveIcon className="h-3 w-3"/> Listen
                                        </button>
                                    )}
                                </div>
                            ))}
                             {loadingChat && <Loader message="..." />}
                        </div>
                        
                        <div className="p-4 bg-slate-950 border-t border-white/10">
                             <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-full border border-white/10 focus-within:border-cyan-500 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="और जानें..."
                                    className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 placeholder:text-slate-500 font-hindi px-2 outline-none"
                                />
                                <button onClick={handleSend} className="p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-colors">
                                    <PaperAirplaneIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interactive3DLab;
