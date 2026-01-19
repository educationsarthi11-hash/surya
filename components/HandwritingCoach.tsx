
import React, { useRef, useState, useEffect } from 'react';
import { PencilSquareIcon, TrashIcon, SparklesIcon, CheckCircleIcon } from './icons/AllIcons';
import { analyzeImageAndGetJson } from '../services/geminiService';
import { Type } from '@google/genai';
import { useToast } from '../hooks/useToast';

const HandwritingCoach: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const toast = useToast();

    const startDrawing = (e: any) => {
        setIsDrawing(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath(); ctx.moveTo(x, y);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.strokeStyle = '#1e3a8a';
        ctx.lineTo(x, y); ctx.stroke();
    };

    const clear = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        setFeedback('');
    };

    const analyze = async () => {
        if (!canvasRef.current) return;
        setLoading(true);
        canvasRef.current.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], "writing.png", { type: "image/png" });
            try {
                const result = await analyzeImageAndGetJson("Analyze this handwriting. Provide a score out of 10 and 1 tip in Hindi to improve. JSON: {score: number, tip: string}", file, {
                    type: Type.OBJECT,
                    properties: { score: { type: Type.NUMBER }, tip: { type: Type.STRING } },
                    required: ["score", "tip"]
                });
                setFeedback(`Score: ${result.score}/10 - ${result.tip}`);
                toast.success("AI विश्लेषण पूरा हुआ!");
            } catch (e) { toast.error("Error analyzing."); }
            finally { setLoading(false); }
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-soft h-full flex flex-col items-center">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                <PencilSquareIcon className="h-6 w-6 text-primary"/> स्मार्ट स्लेट (AI Coach)
            </h2>
            <canvas 
                ref={canvasRef} width={500} height={300} 
                className="bg-slate-50 border-4 border-slate-200 rounded-3xl cursor-crosshair touch-none shadow-inner"
                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)}
                onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)}
            />
            <div className="flex gap-4 mt-6 w-full max-w-[500px]">
                <button onClick={clear} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2"><TrashIcon className="h-5 w-5"/> साफ़ करें</button>
                <button onClick={analyze} disabled={loading} className="flex-[2] py-3 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                    {loading ? "जांच हो रही है..." : <><SparklesIcon className="h-5 w-5"/> AI से चेक कराएं</>}
                </button>
            </div>
            {feedback && <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-primary font-bold font-hindi animate-pop-in">{feedback}</div>}
        </div>
    );
};

export default HandwritingCoach;
