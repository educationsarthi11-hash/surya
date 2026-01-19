
import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, XIcon, SparklesIcon, PhotoIcon, ArrowPathIcon, CheckCircleIcon, DocumentTextIcon, UploadIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { analyzeImageAndGetJson, fileToBase64 } from '../services/geminiService';
import { Type } from '@google/genai';
import Loader from './Loader';

interface UnifiedScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScanComplete: (data: any, imageFile: File) => void;
    prompt?: string;
    schema?: any;
    title?: string;
}

const UnifiedScanner: React.FC<UnifiedScannerProps> = ({ 
    isOpen, 
    onClose, 
    onScanComplete, 
    prompt = "Extract text from this document accurately.", 
    schema = { type: Type.OBJECT, properties: { text: { type: Type.STRING } } },
    title = "AI Smart Scanner"
}) => {
    const toast = useToast();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'camera' | 'upload'>('camera');
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && mode === 'camera' && !capturedFile) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen, mode, capturedFile]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
            toast.error("Camera access denied or unavailable.");
            setMode('upload');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
    };

    const capture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0);
            
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], `scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    setCapturedFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                    stopCamera();
                }
            }, 'image/jpeg', 0.95);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCapturedFile(file);
            setPreviewUrl(file.type.includes('pdf') ? null : URL.createObjectURL(file));
            setMode('upload');
        }
    };

    const handleAnalyze = async () => {
        if (!capturedFile) return;
        setLoading(true);
        try {
            const result = await analyzeImageAndGetJson(prompt, capturedFile, schema);
            onScanComplete(result, capturedFile);
            toast.success("AI Scan Successful!");
            handleReset();
            onClose();
        } catch (e) {
            console.error(e);
            toast.error("Analysis Failed. Ensure document is clear.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCapturedFile(null);
        setPreviewUrl(null);
        setLoading(false);
        setMode('camera');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-md">
            <div className="bg-slate-900 w-full max-w-4xl h-[90vh] rounded-[3rem] overflow-hidden flex flex-col relative border-4 border-slate-800 shadow-2xl">
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-xl"><CameraIcon className="h-6 w-6 text-white"/></div>
                        <div>
                            <h3 className="text-white font-black text-xl tracking-tight uppercase">{title}</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">AI Vision Engine</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-red-500 transition-colors">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Main Body */}
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                    {!capturedFile ? (
                        <>
                            {mode === 'camera' ? (
                                <>
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
                                    {/* Scanning Corner Guides */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute top-10 left-10 w-16 h-16 border-t-8 border-l-8 border-primary rounded-tl-3xl animate-pulse"></div>
                                        <div className="absolute top-10 right-10 w-16 h-16 border-t-8 border-r-8 border-primary rounded-tr-3xl animate-pulse"></div>
                                        <div className="absolute bottom-10 left-10 w-16 h-16 border-b-8 border-l-8 border-primary rounded-bl-3xl animate-pulse"></div>
                                        <div className="absolute bottom-10 right-10 w-16 h-16 border-b-8 border-r-8 border-primary rounded-br-3xl animate-pulse"></div>
                                    </div>
                                    <div className="absolute bottom-10 left-0 right-0 flex justify-center px-10 gap-6 pointer-events-auto">
                                        <button onClick={capture} className="w-20 h-20 bg-white rounded-full border-8 border-primary/30 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95">
                                            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                                                <CameraIcon className="h-8 w-8 text-white"/>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-full flex flex-col items-center justify-center bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer group p-10"
                                >
                                    <UploadIcon className="h-24 w-24 text-slate-500 group-hover:text-primary transition-colors mb-6"/>
                                    <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">Upload File</h3>
                                    <p className="text-slate-500 mt-2 font-bold">Image or PDF (Max 10MB)</p>
                                </div>
                            )}

                            {/* Mode Toggle */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 flex">
                                <button onClick={() => setMode('camera')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${mode === 'camera' ? 'bg-primary text-slate-900' : 'text-white hover:bg-white/10'}`}>Camera</button>
                                <button onClick={() => setMode('upload')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${mode === 'upload' ? 'bg-primary text-slate-900' : 'text-white hover:bg-white/10'}`}>Upload</button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col p-6 animate-pop-in">
                            {loading ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <Loader message="AI सार्थी डॉक्युमेंट पढ़ रहा है..." />
                                    <p className="mt-4 text-primary font-bold animate-pulse text-lg uppercase tracking-widest">Scanning in Progress</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-hidden rounded-[2rem] border-4 border-slate-800 shadow-2xl bg-slate-800 flex items-center justify-center">
                                        {capturedFile.type.includes('pdf') ? (
                                            <div className="text-center">
                                                <DocumentTextIcon className="h-24 w-24 text-red-500 mx-auto mb-4"/>
                                                <p className="text-white font-bold">{capturedFile.name}</p>
                                                <p className="text-slate-400 text-sm">PDF Document Ready</p>
                                            </div>
                                        ) : (
                                            <img src={previewUrl!} className="w-full h-full object-contain" alt="Scan Preview" />
                                        )}
                                    </div>
                                    <div className="mt-6 flex gap-4 shrink-0">
                                        <button onClick={handleReset} className="flex-1 py-4 bg-slate-800 text-white font-black rounded-2xl border border-white/5 flex items-center justify-center gap-2">
                                            <ArrowPathIcon className="h-5 w-5"/> RETAKE
                                        </button>
                                        <button onClick={handleAnalyze} className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 transform hover:scale-105 transition-all">
                                            <SparklesIcon className="h-5 w-5 text-yellow-300"/> CONFIRM & SCAN
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default UnifiedScanner;
