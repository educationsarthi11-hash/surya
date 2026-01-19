
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { fileToBase64, sanitizeHtml } from '../services/geminiService';
import Loader from './Loader';
import { DocumentTextIcon, SparklesIcon, UploadIcon, CameraIcon, XCircleIcon, ClipboardIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const AIDocumentScanner: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const toast = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setExtractedText('');
        }
    };

    const handleOpenCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOpen(true);
            }
        } catch (err) {
            toast.error("Camera access denied.");
        }
    };

    const handleTakePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context?.drawImage(videoRef.current, 0, 0);
            
            canvasRef.current.toBlob(blob => {
                if (blob) {
                    const capturedFile = new File([blob], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    setFile(capturedFile);
                    stopCamera();
                }
            }, 'image/jpeg');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const handleScan = async () => {
        if (!file) {
            toast.error("Please select or take a photo of a document.");
            return;
        }

        setLoading(true);
        setExtractedText('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = await fileToBase64(file);
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: {
                    parts: [
                        { text: "Extract all text from this document accurately. Organize it clearly with headings if applicable. If it's a form, list the fields and their values. Format as clean HTML without <html> or <body> tags." },
                        { inlineData: { mimeType: file.type, data: base64Data } }
                    ]
                }
            });

            setExtractedText(sanitizeHtml(response.text || "No text could be extracted."));
            toast.success("Text extracted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to scan document. Ensure the image is clear.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const text = document.getElementById('extracted-content')?.innerText;
        if (text) {
            navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-soft h-full flex flex-col">
            <div className="flex items-center mb-6 border-b pb-4">
                <DocumentTextIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">AI Document Scanner</h2>
                    <p className="text-sm text-neutral-500 font-hindi">दस्तावेज स्कैनर (OCR)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
                {/* Upload/Camera Section */}
                <div className="space-y-6 flex flex-col">
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsCameraOpen(false)} 
                            className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${!isCameraOpen ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'}`}
                        >
                            <UploadIcon className="inline h-5 w-5 mr-2"/> Upload File
                        </button>
                        <button 
                            onClick={handleOpenCamera} 
                            className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${isCameraOpen ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-500'}`}
                        >
                            <CameraIcon className="inline h-5 w-5 mr-2"/> Use Camera
                        </button>
                    </div>

                    <div className="flex-1 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                        {isCameraOpen ? (
                            <div className="w-full h-full flex flex-col items-center gap-4">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-xl shadow-lg transform -scale-x-100"></video>
                                <button onClick={handleTakePhoto} className="absolute bottom-10 p-4 bg-primary text-white rounded-full shadow-2xl hover:scale-110 transition-transform">
                                    <CameraIcon className="h-8 w-8" />
                                </button>
                                <canvas ref={canvasRef} className="hidden"></canvas>
                            </div>
                        ) : (
                            <>
                                {file ? (
                                    <div className="text-center animate-pop-in">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircleIcon className="h-10 w-10 text-primary"/>
                                        </div>
                                        <p className="font-bold text-slate-700">{file.name}</p>
                                        <button onClick={() => setFile(null)} className="text-xs text-red-500 font-bold mt-2 hover:underline flex items-center gap-1 mx-auto">
                                            <XCircleIcon className="h-4 w-4"/> Remove
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer text-center group">
                                        <UploadIcon className="h-16 w-16 text-slate-300 mx-auto mb-4 group-hover:text-primary transition-colors" />
                                        <p className="text-slate-500 font-bold">Select a document photo or PDF</p>
                                        <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                                    </label>
                                )}
                            </>
                        )}
                    </div>

                    <button 
                        onClick={handleScan} 
                        disabled={loading || !file}
                        className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader message="AI Scanning..." /> : <><SparklesIcon className="h-5 w-5 text-yellow-400"/> Scan & Extract Text</>}
                    </button>
                </div>

                {/* Extracted Content Section */}
                <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                    <div className="p-4 border-b bg-white flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Extracted Content</h3>
                        {extractedText && (
                            <button onClick={copyToClipboard} className="text-primary hover:text-primary-dark transition-colors" title="Copy Text">
                                <ClipboardIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                        {loading && !extractedText ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader message="Gemini is analyzing the document..." />
                            </div>
                        ) : extractedText ? (
                            <div id="extracted-content" className="prose prose-sm max-w-none text-slate-700 font-hindi leading-relaxed animate-fade-in" dangerouslySetInnerHTML={{ __html: extractedText }} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-40">
                                <DocumentTextIcon className="h-20 w-20 mb-4" />
                                <p className="font-bold">Text results will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal icon for CheckCircle since it's not exported globally from AllIcons in some contexts
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default AIDocumentScanner;
