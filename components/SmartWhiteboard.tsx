
import React, { useRef, useState, useEffect } from 'react';
import { 
    PaintBrushIcon, TrashIcon, SparklesIcon, 
    SpeakerWaveIcon, StopCircleIcon, BoltIcon,
    ArrowPathIcon, CheckCircleIcon, PaperAirplaneIcon,
    UsersIcon, HeartIcon, WhatsAppIcon, AcademicCapIcon,
    XCircleIcon, CalculatorIcon, PhotoIcon, TableCellsIcon,
    ArrowDownTrayIcon, DocumentTextIcon, LockClosedIcon, UserCircleIcon
} from './icons/AllIcons';
import { analyzeImageAndGetJson, generateImageForTopic } from '../services/geminiService';
import { Type } from '@google/genai';
import { useToast } from '../hooks/useToast';
import { useSpeech } from '../hooks/useSpeech';
import Loader from './Loader';

// Global declaration for PDF export
declare global {
  interface Window {
    html2canvas: any;
  }
}

type BoardMode = 'draw' | 'math' | 'diagram';
type BgType = 'plain' | 'graph' | 'ruled';
type UserMode = 'teacher' | 'student';

const SmartWhiteboard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Tools State
    const [mode, setMode] = useState<BoardMode>('draw');
    const [userMode, setUserMode] = useState<UserMode>('teacher'); 
    const [bgType, setBgType] = useState<BgType>('plain');
    const [brushSize, setBrushSize] = useState(5); 
    const [brushColor, setBrushColor] = useState('#1e3a8a');
    
    // AI Output State
    const [aiOutput, setAiOutput] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    
    // Quiz State
    const [quizData, setQuizData] = useState<{question: string, options: string[], answer: string}[] | null>(null);
    const [showQuiz, setShowQuiz] = useState(false);

    const toast = useToast();
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    // Initialize Canvas & Backgrounds
    useEffect(() => {
        const initCanvas = () => {
            if (canvasRef.current && containerRef.current) {
                const container = containerRef.current;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                
                // Save current content
                const tempImage = canvas.toDataURL();
                
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;

                if (ctx) {
                    // Draw Background
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    if (bgType === 'graph') drawGraph(ctx, canvas.width, canvas.height);
                    if (bgType === 'ruled') drawLines(ctx, canvas.width, canvas.height);

                    // Restore content
                    const img = new Image();
                    img.onload = () => ctx.drawImage(img, 0, 0);
                    img.src = tempImage;
                }
            }
        };
        initCanvas();
        window.addEventListener('resize', initCanvas);
        return () => window.removeEventListener('resize', initCanvas);
    }, [bgType]);

    const drawGraph = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        for (let x = 0; x <= w; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = 0; y <= h; y += 40) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
    };

    const drawLines = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        for (let y = 40; y <= h; y += 40) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
    };

    const getCoordinates = (e: any) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: any) => {
        if (userMode === 'student') {
            toast.warning("Student Mode Active: Board is Locked. (केवल शिक्षक लिख सकते हैं)");
            return;
        }
        setIsDrawing(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const coords = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const coords = getCoordinates(e);
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    };

    const clearCanvas = () => {
        if (userMode === 'student') return;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            if (bgType === 'graph') drawGraph(ctx, canvasRef.current.width, canvasRef.current.height);
            if (bgType === 'ruled') drawLines(ctx, canvasRef.current.width, canvasRef.current.height);
        }
        setAiOutput(null);
        setGeneratedImage(null);
        setQuizData(null);
        setShowQuiz(false);
    };

    const handleGenerateQuiz = async () => {
        if (!canvasRef.current) return;
        setLoading(true);
        setShowQuiz(false);
        canvasRef.current.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], "board_content.png", { type: "image/png" });
            try {
                const prompt = `Analyze the whiteboard content. Generate 3 MCQs in Hindi (Devanagari). JSON: { "questions": [{ "question": "...", "options": ["..."], "answer": "..." }] }`;
                const result = await analyzeImageAndGetJson(prompt, file, {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, answer: { type: Type.STRING } }
                            }
                        }
                    }
                });
                if (result?.questions) {
                    setQuizData(result.questions);
                    setShowQuiz(true);
                    toast.success("क्विज़ तैयार है!");
                }
            } catch (e) { toast.error("Quiz failed."); } finally { setLoading(false); }
        });
    };

    const handleSmartSave = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `SmartBoard_Notes_${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
        toast.success("नोट्स सेव हो गए!");
    };

    const handleMagicAction = async () => {
        if (!canvasRef.current) return;
        setLoading(true); setAiOutput(null); setGeneratedImage(null); stopAudio();
        try {
            canvasRef.current.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], "board.png", { type: "image/png" });
                if (mode === 'math') {
                    const prompt = `Act as Math Teacher. Solve problem in image. Explain in Hindi. JSON: { solutionHtml: string, spokenText: string }`;
                    const result = await analyzeImageAndGetJson(prompt, file, { type: Type.OBJECT, properties: { solutionHtml: { type: Type.STRING }, spokenText: { type: Type.STRING } } });
                    setAiOutput(result.solutionHtml); playAudio(result.spokenText, 0);
                } else if (mode === 'diagram') {
                    const prompt = `Read text on board. Return ONLY text.`;
                    const res = await analyzeImageAndGetJson(prompt, file, { type: Type.OBJECT, properties: { text: { type: Type.STRING } } });
                    const imgUrl = await generateImageForTopic(`Clean line diagram of ${res.text}, educational.`);
                    setGeneratedImage(imgUrl);
                } else {
                    const prompt = `Explain content in Hindi. JSON: {explanation: string}`;
                    const res = await analyzeImageAndGetJson(prompt, file, { type: Type.OBJECT, properties: { explanation: { type: Type.STRING } } });
                    setAiOutput(res.explanation); playAudio(res.explanation, 0);
                }
            });
        } catch (e) { toast.error("Processing failed."); } finally { setLoading(false); }
    };

    return (
        <div className="bg-slate-50 h-full flex flex-col relative overflow-hidden">
            
            {/* Top Toolbar (Floating Island Style) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-xl px-2 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/40 transition-all hover:scale-105">
                <div className="flex gap-1 bg-slate-100/50 p-1 rounded-full">
                    <button onClick={() => setMode('draw')} className={`p-3 rounded-full transition-all ${mode === 'draw' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`} title="Free Draw"><PaintBrushIcon className="h-5 w-5"/></button>
                    <button onClick={() => setMode('math')} className={`p-3 rounded-full transition-all ${mode === 'math' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600'}`} title="Math Solver"><CalculatorIcon className="h-5 w-5"/></button>
                    <button onClick={() => setMode('diagram')} className={`p-3 rounded-full transition-all ${mode === 'diagram' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-pink-600'}`} title="Magic Diagram"><SparklesIcon className="h-5 w-5"/></button>
                </div>

                <div className="w-px h-6 bg-slate-300 mx-1"></div>

                <div className="flex gap-2 items-center px-2">
                     <button onClick={() => setBgType('plain')} className={`w-6 h-6 rounded-full border-2 ${bgType === 'plain' ? 'border-primary bg-white' : 'border-slate-300 bg-slate-100'}`}></button>
                     <button onClick={() => setBgType('ruled')} className={`w-6 h-6 rounded-full border-2 flex flex-col justify-center gap-0.5 px-1 ${bgType === 'ruled' ? 'border-primary bg-white' : 'border-slate-300 bg-slate-100'}`}><div className="h-px bg-slate-400 w-full"></div><div className="h-px bg-slate-400 w-full"></div></button>
                </div>

                <div className="w-px h-6 bg-slate-300 mx-1"></div>
                
                <input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} className="w-8 h-8 rounded-full border-none cursor-pointer p-0" />
                <button onClick={clearCanvas} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"><TrashIcon className="h-5 w-5" /></button>
            </div>

            {/* Role & Action Toggles (Top Right) */}
            <div className="absolute top-4 right-4 z-40 flex flex-col gap-3">
                 <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-white/40 flex flex-col gap-2">
                    <button onClick={() => setUserMode('teacher')} className={`p-2 rounded-xl transition-all ${userMode === 'teacher' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`} title="Teacher Mode"><AcademicCapIcon className="h-5 w-5"/></button>
                    <button onClick={() => setUserMode('student')} className={`p-2 rounded-xl transition-all ${userMode === 'student' ? 'bg-green-600 text-white shadow-md' : 'text-slate-400'}`} title="Student Mode"><UserCircleIcon className="h-5 w-5"/></button>
                 </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 pt-24 h-full overflow-hidden">
                {/* Canvas Area */}
                <div className="lg:col-span-8 flex flex-col h-full relative">
                    <div ref={containerRef} className={`flex-1 bg-white rounded-[3rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative group ${userMode === 'teacher' ? 'cursor-crosshair' : 'cursor-not-allowed'}`}>
                        <canvas 
                            ref={canvasRef} 
                            onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} 
                            onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)} 
                            className="w-full h-full" 
                        />
                        {loading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-30">
                                <Loader message="AI सार्थी काम कर रहा है..." />
                            </div>
                        )}
                        {generatedImage && (
                            <div className="absolute inset-0 flex items-center justify-center p-10 bg-white z-20">
                                <img src={generatedImage} className="max-w-full max-h-full object-contain drop-shadow-2xl animate-pop-in rounded-xl" alt="Generated" />
                                <button onClick={() => setGeneratedImage(null)} className="absolute top-4 right-4 bg-slate-900 text-white p-2 rounded-full"><XCircleIcon className="h-6 w-6"/></button>
                            </div>
                        )}
                        {userMode === 'student' && (
                             <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                                <LockClosedIcon className="h-3 w-3"/> Board Locked
                             </div>
                        )}
                    </div>
                    
                    {userMode === 'teacher' && (
                        <div className="mt-4 flex justify-between gap-4 px-4">
                             <div className="flex gap-3">
                                 <button onClick={handleGenerateQuiz} className="px-6 py-3 bg-white text-orange-600 font-bold rounded-2xl shadow-lg border border-orange-100 hover:bg-orange-50 transition-all flex items-center gap-2 text-xs uppercase tracking-wider">
                                    <BoltIcon className="h-5 w-5"/> Instant Quiz
                                 </button>
                                 <button onClick={handleSmartSave} className="px-6 py-3 bg-white text-blue-600 font-bold rounded-2xl shadow-lg border border-blue-100 hover:bg-blue-50 transition-all flex items-center gap-2 text-xs uppercase tracking-wider">
                                    <DocumentTextIcon className="h-5 w-5"/> PDF Notes
                                 </button>
                             </div>
                            <button onClick={handleMagicAction} disabled={loading} className={`px-10 py-3 font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95 text-xs uppercase tracking-widest ${mode === 'math' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : mode === 'diagram' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-slate-900 text-white hover:bg-primary hover:text-slate-900'}`}>
                                <SparklesIcon className="h-5 w-5 animate-pulse"/> 
                                {mode === 'math' ? 'Solve Math' : mode === 'diagram' ? 'Auto Diagram' : 'Explain Board'}
                            </button>
                        </div>
                    )}
                </div>

                {/* AI Sidebar */}
                <div className="lg:col-span-4 h-full overflow-hidden flex flex-col">
                    <div className="flex-1 bg-white border border-slate-100 rounded-[3rem] p-6 shadow-xl flex flex-col overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 bg-slate-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <h3 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2 uppercase tracking-widest border-b pb-3">
                            <SparklesIcon className="h-4 w-4 text-primary"/> AI Assistant
                        </h3>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {showQuiz && quizData ? (
                                <div className="space-y-4 animate-pop-in">
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-3xl">
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3">Live Class Quiz</p>
                                        {quizData.map((q, i) => (
                                            <div key={i} className="mb-6 last:mb-0">
                                                <p className="font-bold text-sm text-slate-800 mb-2">Q{i+1}. {q.question}</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {q.options.map((opt, oi) => (
                                                        <div key={oi} className={`text-xs p-3 rounded-xl border font-medium ${opt === q.answer ? 'bg-green-100 border-green-300 text-green-800' : 'bg-white text-slate-600'}`}>
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setShowQuiz(false)} className="text-xs text-slate-400 hover:text-red-500 w-full text-center font-bold uppercase tracking-widest">End Quiz</button>
                                </div>
                            ) : aiOutput ? (
                                <div className="animate-pop-in space-y-6">
                                    <div className="prose prose-sm font-hindi leading-relaxed text-slate-600 bg-slate-50 p-5 rounded-3xl border border-slate-100 shadow-inner" dangerouslySetInnerHTML={{ __html: aiOutput }} />
                                    {isSpeaking && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-red-500 animate-pulse bg-red-50 px-3 py-1 rounded-full w-fit">
                                            <SpeakerWaveIcon className="h-4 w-4"/> Speaking...
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                         <button onClick={() => stopAudio()} className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-200">Stop</button>
                                         <button onClick={() => toast.success("Sent via WhatsApp!")} className="flex-1 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 flex items-center justify-center gap-2"><WhatsAppIcon className="h-4 w-4"/> Share</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 px-4">
                                    <BoltIcon className="h-20 w-20 mb-4 text-slate-400" />
                                    <p className="text-xs font-black uppercase tracking-[0.2em] leading-loose">
                                        Write or Draw to begin AI analysis.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartWhiteboard;
