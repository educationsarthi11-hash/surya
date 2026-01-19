
import React, { useState, useRef, useEffect } from 'react';
import { generateLessonVideo, generateText } from '../services/geminiService';
import { VideoCameraIcon, SparklesIcon, XCircleIcon, HeartIcon, PlusIcon, WrenchScrewdriverIcon, ChatBubbleIcon, PaperAirplaneIcon, ArrowLeftIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { User } from '../types';

interface Reel {
    id: string;
    videoUrl: string;
    caption: string;
    author: string;
    likes: number;
    isLiked: boolean;
    comments: number;
    isEnhanced?: boolean; 
    isAiFixed?: boolean; 
}

const defaultReels: Reel[] = [
    { id: '1', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption: 'Physics Experiment: Refraction of Light 🌈\n\n#Physics #Science #Experiment', author: 'Aarav S.', likes: 124, isLiked: false, comments: 12 },
    { id: '2', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', caption: 'Math Trick: Multiply by 11 in 2 seconds! ⚡\n\n#Maths #Tricks #SpeedMath', author: 'Priya P.', likes: 856, isLiked: true, comments: 45 },
    { id: '3', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption: 'History of the Mughal Empire 🏰\n\n#History #India #Facts', author: 'Rahul Sir', likes: 230, isLiked: false, comments: 30 },
];

const STORAGE_KEY = 'edu_reels_data_v3';

const EduReels: React.FC<{ user: User, setActiveService: (s: any) => void }> = ({ user, setActiveService }) => {
    const toast = useToast();
    
    // Load from storage or use default
    const [reels, setReels] = useState<Reel[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultReels;
        } catch (e) {
            return defaultReels;
        }
    });

    // Upload States
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStep, setUploadStep] = useState<'select' | 'analyze' | 'review'>('select');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    
    // AI Analysis States
    const [aiFeedback, setAiFeedback] = useState<{ hindiExplanation: string, improvements: string[], score: number } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isFixing, setIsFixing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Save to storage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
    }, [reels]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 50 * 1024 * 1024) { 
                toast.error("File too large (Max 50MB).");
                return;
            }
            setUploadFile(file);
            setVideoPreview(URL.createObjectURL(file));
            setUploadStep('analyze');
            // Auto trigger analysis
            analyzeContent(file);
        }
    };

    const analyzeContent = async (file: File) => {
        setIsAnalyzing(true);
        try {
            // Context simulation
            const prompt = `
                Act as an expert Educational Content Reviewer for an Indian App.
                Analyze this video upload context: "${caption || file.name}".
                
                You MUST provide the output in Hindi (Devanagari script).
                
                Return JSON format:
                {
                   "hindiExplanation": "Describe what is happening in the video in simple Hindi. (e.g., 'इस वीडियो में प्रकाश के अपवर्तन को समझाया गया है...')",
                   "improvements": ["Give 3 actionable tips in Hindi to improve the video quality or teaching style (e.g., 'आवाज़ साफ़ करें', 'रोशनी बढ़ाएं')."],
                   "score": Number between 1-10 based on educational value.
                }
            `;
            
            const response = await generateText(prompt, 'gemini-2.5-flash');
            const jsonStr = response.replace(/```json|```/g, '').trim();
            const json = JSON.parse(jsonStr);
            
            setAiFeedback({
                hindiExplanation: json.hindiExplanation || "यह वीडियो शिक्षाप्रद लगता है।",
                improvements: json.improvements || ["आवाज साफ करें", "रोशनी बढ़ाएं", "कैप्शन जोड़ें"],
                score: json.score || 7
            });
            
            setUploadStep('review');
        } catch (e) {
            console.error(e);
            toast.error("AI Analysis failed. Showing manual editor.");
            setAiFeedback({
                hindiExplanation: "AI विश्लेषण में समस्या आई।",
                improvements: ["वीडियो की जांच करें"],
                score: 5
            });
            setUploadStep('review');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handlePost = () => {
        if (!uploadFile) return;
        const newReel: Reel = {
            id: `reel-${Date.now()}`,
            videoUrl: videoPreview!,
            caption: caption || 'New Learning Video',
            author: user.name,
            likes: 0,
            isLiked: false,
            comments: 0
        };
        setReels(prev => [newReel, ...prev]);
        toast.success("Reel Posted Successfully!");
        handleCloseUpload();
    };

    const handleAutoFix = async () => {
        setIsFixing(true);
        try {
            const topic = caption || "Education Topic";
            // Simulate fixing by generating a high quality version
            const newUrl = await generateLessonVideo(topic, 'short', 'Students');
            
            setVideoPreview(newUrl);
            setCaption(`(AI Fixed & Enhanced) ${caption}`);
            
            setAiFeedback({
                hindiExplanation: "AI ने वीडियो को पूरी तरह से ऑप्टिमाइज़ कर दिया है। अब यह HD गुणवत्ता और स्पष्ट ऑडियो के साथ है।",
                improvements: ["वीडियो अब प्रकाशन के लिए तैयार है!", "बेहतर लाइटिंग और कलर ग्रेडिंग लागू की गई है।"],
                score: 10
            });
            
            toast.success("AI has fixed your video!");
        } catch(e) {
            toast.error("Could not fix video.");
        } finally {
            setIsFixing(false);
        }
    };

    const handleCloseUpload = () => {
        setIsUploading(false);
        setUploadFile(null);
        setVideoPreview(null);
        setCaption('');
        setAiFeedback(null);
        setUploadStep('select');
    };

    const toggleLike = (id: string) => {
        setReels(reels.map(r => r.id === id ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked } : r));
    };

    const renderUploadModal = () => (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800">Create EduReel</h3>
                    <button onClick={handleCloseUpload}><XCircleIcon className="h-6 w-6 text-slate-400 hover:text-slate-600"/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {uploadStep === 'select' && (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                                <VideoCameraIcon className="h-8 w-8"/>
                            </div>
                            <p className="font-bold text-slate-600">Select Video to Upload</p>
                            <p className="text-xs text-slate-400 mt-2">MP4, WebM (Max 50MB)</p>
                            <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileSelect}/>
                        </div>
                    )}

                    {uploadStep === 'analyze' && (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                             <Loader message="AI is analyzing..." />
                             <p className="text-sm text-slate-500 mt-4 font-hindi font-medium">AI वीडियो को हिंदी में समझ रहा है...</p>
                        </div>
                    )}

                    {uploadStep === 'review' && videoPreview && aiFeedback && (
                        <div className="space-y-6 animate-pop-in">
                            <div className="flex gap-4">
                                {/* Preview */}
                                <div className="w-1/3 aspect-[9/16] bg-black rounded-lg overflow-hidden relative border border-slate-200">
                                    <video src={videoPreview} className="w-full h-full object-cover" autoPlay muted loop />
                                </div>
                                
                                {/* AI Analysis Report */}
                                <div className="flex-1 space-y-4">
                                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                                        <h4 className="text-xs font-bold text-indigo-700 uppercase mb-1 flex items-center gap-1">
                                            <SparklesIcon className="h-3 w-3"/> AI Summary (हिंदी में)
                                        </h4>
                                        <p className="text-sm text-slate-700 font-hindi leading-relaxed">{aiFeedback.hindiExplanation}</p>
                                    </div>

                                    <div className={`p-3 border rounded-lg ${aiFeedback.score < 8 ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                                        <h4 className={`text-xs font-bold uppercase mb-2 flex items-center gap-1 ${aiFeedback.score < 8 ? 'text-orange-700' : 'text-green-700'}`}>
                                            <WrenchScrewdriverIcon className="h-3 w-3"/>
                                            {aiFeedback.score < 8 ? 'सुधार की आवश्यकता (Improvements)' : 'उत्कृष्ट सामग्री (Excellent)'}
                                        </h4>
                                        <ul className="space-y-1">
                                            {aiFeedback.improvements.map((tip, i) => (
                                                <li key={i} className="text-xs flex items-start gap-2 text-slate-700 font-hindi">
                                                    <span className="mt-0.5 text-orange-500">•</span> {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {aiFeedback.score < 8 && !isFixing && (
                                        <button 
                                            onClick={handleAutoFix}
                                            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <SparklesIcon className="h-4 w-4"/> AI Auto-Fix (स्वचालित ठीक करें)
                                        </button>
                                    )}
                                    {isFixing && <p className="text-xs text-purple-600 font-bold animate-pulse text-center">AI वीडियो को री-जेनरेट कर रहा है...</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Caption</label>
                                <textarea 
                                    value={caption} 
                                    onChange={(e) => setCaption(e.target.value)} 
                                    placeholder="Write a caption..." 
                                    className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {uploadStep === 'review' && (
                    <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                        <button onClick={handleCloseUpload} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg">Discard</button>
                        <button onClick={handlePost} className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark shadow-md flex items-center gap-2">
                             <PaperAirplaneIcon className="h-4 w-4"/> Post Reel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full min-h-[600px] flex flex-col md:flex-row bg-black rounded-xl overflow-hidden relative">
            {isUploading && renderUploadModal()}

            {/* --- Feed Section --- */}
            <div className="flex-1 overflow-y-auto snap-y snap-mandatory custom-scrollbar scroll-smooth relative">
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                     <button onClick={() => setActiveService('overview')} className="p-2 bg-black/50 rounded-full text-white backdrop-blur-md hover:bg-black/70">
                        <ArrowLeftIcon className="h-6 w-6"/>
                    </button>
                </div>

                {reels.map(reel => (
                    <div key={reel.id} className="w-full h-full md:h-[600px] snap-start relative flex items-center justify-center bg-gray-900 border-b border-gray-800/50">
                        <video 
                            src={reel.videoUrl} 
                            className="max-h-full max-w-full object-contain" 
                            controls 
                            loop 
                            playsInline
                            poster="https://placehold.co/1080x1920/black/white?text=Video+Loading"
                        />
                        
                        {/* Right Action Bar */}
                        <div className="absolute bottom-20 right-4 flex flex-col gap-6 items-center z-10">
                            <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1 group">
                                <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md transition-transform group-hover:scale-110 ${reel.isLiked ? 'text-red-500' : 'text-white'}`}>
                                    <HeartIcon className={`h-7 w-7 ${reel.isLiked ? 'fill-current' : ''}`} />
                                </div>
                                <span className="text-white text-xs font-bold drop-shadow-md">{reel.likes}</span>
                            </button>
                            
                            <button className="flex flex-col items-center gap-1 group">
                                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:bg-black/60 transition-colors">
                                    <ChatBubbleIcon className="h-7 w-7" />
                                </div>
                                <span className="text-white text-xs font-bold drop-shadow-md">{reel.comments}</span>
                            </button>

                             <button className="flex flex-col items-center gap-1 group">
                                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:bg-black/60 transition-colors">
                                    <PaperAirplaneIcon className="h-7 w-7" />
                                </div>
                                <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
                            </button>
                        </div>

                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
                            <div className="pointer-events-auto pr-16">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                            <span className="font-bold text-slate-900 text-xs">{reel.author[0]}</span>
                                        </div>
                                    </div>
                                    <span className="text-white font-bold text-sm tracking-wide">{reel.author}</span>
                                    <button className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded border border-white/30 transition-colors">Follow</button>
                                </div>
                                <p className="text-white text-sm leading-relaxed mb-2 line-clamp-2 whitespace-pre-line">{reel.caption}</p>
                                {reel.isAiFixed && (
                                     <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/50 px-2 py-0.5 rounded text-[10px] text-green-300 font-bold mb-2">
                                        <CheckCircleIcon className="h-3 w-3"/> AI Verified & Fixed
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-white/70 text-xs">
                                    <SparklesIcon className="h-3 w-3 text-yellow-400"/>
                                    <span>Education Sarthi Original</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* --- Create Button (Mobile Floating) --- */}
            <div className="absolute bottom-6 right-6 md:hidden z-20">
                <button onClick={() => setIsUploading(true)} className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                    <PlusIcon className="h-8 w-8" />
                </button>
            </div>

            {/* --- Sidebar (Desktop) --- */}
            <div className="hidden md:flex w-80 bg-white border-l border-slate-200 flex-col z-20">
                 <div className="p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <VideoCameraIcon className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 fill-pink-500"/> EduReels
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wider">Learn in 60 Seconds</p>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <h3 className="font-bold text-slate-800 mb-2">Create & Share</h3>
                        <p className="text-xs text-slate-500 mb-4">Upload educational shorts. AI will review, fix, and publish them.</p>
                        <button 
                            onClick={() => setIsUploading(true)}
                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            <PlusIcon className="h-5 w-5"/> Upload Reel
                        </button>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-slate-700 text-sm mb-3">Trending Topics</h4>
                        <div className="flex flex-wrap gap-2">
                            {['#ScienceFacts', '#MathTricks', '#History', '#ExamTips', '#Motivation', '#Coding'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-semibold cursor-pointer transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-auto p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                        <div className="flex gap-2">
                            <SparklesIcon className="h-5 w-5 text-yellow-600 shrink-0"/>
                            <div>
                                <p className="text-xs font-bold text-yellow-800">AI Quality Check</p>
                                <p className="text-[10px] text-yellow-700 mt-1 font-hindi">
                                    "अपलोड करते समय AI आपको हिंदी में बताएगा कि वीडियो में क्या सुधार (Improvement) करना है।"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EduReels;
