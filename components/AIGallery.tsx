
import React, { useState, useRef } from 'react';
import { PhotoIcon, SparklesIcon, PlusIcon, XCircleIcon, DocumentTextIcon, GlobeAltIcon, ArrowDownTrayIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { analyzeImageAndGetJson, fileToBase64, generateText } from '../services/geminiService';
import { Type } from '@google/genai';
import Loader from './Loader';

interface SchoolEvent {
    id: string;
    title: string;
    date: string;
    report: string;
    images: string[];
    category: string;
}

const AIGallery: React.FC = () => {
    const toast = useToast();
    const [events, setEvents] = useState<SchoolEvent[]>([
        { 
            id: '1', 
            title: 'Annual Science Exhibition', 
            date: '2024-05-15', 
            report: 'Our students showcased brilliant innovations including a working solar tracker and a smart irrigation system.',
            images: ['https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=800&auto=format&fit=crop'],
            category: 'Academic'
        }
    ]);

    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Fix: Explicitly cast Array.from(e.target.files) to File[]
            const files = Array.from(e.target.files) as File[];
            setSelectedFiles(files);
            setPreviews(files.map(f => URL.createObjectURL(f)));
        }
    };

    const handleCreateEvent = async () => {
        if (selectedFiles.length === 0) return;
        setLoading(true);
        try {
            const prompt = "Analyze these school event photos. Identify the event type and write a 3-sentence professional news report in Hindi (Hinglish). Return ONLY JSON: {title: string, report: string, category: string}";
            const schema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    report: { type: Type.STRING },
                    category: { type: Type.STRING }
                },
                required: ["title", "report", "category"]
            };

            const result = await analyzeImageAndGetJson(prompt, selectedFiles[0], schema);
            
            const newEvent: SchoolEvent = {
                id: Date.now().toString(),
                title: result.title,
                date: new Date().toISOString().split('T')[0],
                report: result.report,
                images: previews,
                category: result.category
            };

            setEvents([newEvent, ...events]);
            toast.success("नया इवेंट गैलरी में जुड़ गया है!");
            setIsUploading(false);
            setSelectedFiles([]);
            setPreviews([]);
        } catch (e) {
            toast.error("AI विश्लेषण विफल रहा।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-[3rem] shadow-soft min-h-[700px] animate-pop-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                        <PhotoIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Smart Gallery</h2>
                        <p className="text-sm text-neutral-500 font-hindi">फोटो डालें, AI खुद खबर लिखेगा।</p>
                    </div>
                </div>
                <button onClick={() => setIsUploading(true)} className="px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                    <PlusIcon className="h-5 w-5"/> ADD EVENT
                </button>
            </div>

            {isUploading && (
                <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full animate-pop-in shadow-2xl border-4 border-primary/20">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900">Upload Event Photos</h3>
                            <button onClick={() => setIsUploading(false)}><XCircleIcon className="h-8 w-8 text-slate-400"/></button>
                        </div>

                        {!loading ? (
                            <div className="space-y-6">
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-4 border-dashed border-slate-100 rounded-[2.5rem] h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group"
                                >
                                    {previews.length > 0 ? (
                                        <div className="flex gap-2 overflow-hidden px-10">
                                            {previews.slice(0,3).map((p, i) => <img key={i} src={p} className="h-32 w-32 object-cover rounded-2xl shadow-lg rotate-3" />)}
                                        </div>
                                    ) : (
                                        <>
                                            <UploadIcon className="h-16 w-16 text-slate-300 group-hover:scale-110 transition-transform"/>
                                            <p className="font-bold text-slate-400 mt-4 uppercase tracking-widest text-xs">Drop Photos Here</p>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} multiple className="hidden" onChange={handleFileChange} />
                                </div>
                                <button 
                                    onClick={handleCreateEvent}
                                    disabled={selectedFiles.length === 0}
                                    className="w-full py-5 bg-slate-950 text-white font-black rounded-3xl shadow-2xl hover:bg-primary transition-all disabled:opacity-50"
                                >
                                    GENERATE AI REPORT & PUBLISH
                                </button>
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <Loader message="AI फोटो पढ़कर खबर लिख रहा है..." />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                    <div key={event.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden group flex flex-col">
                        <div className="h-64 overflow-hidden relative">
                            <img src={event.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase border border-primary/20">
                                {event.category}
                            </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{new Date(event.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                            <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight">{event.title}</h3>
                            <p className="text-sm text-slate-500 font-hindi leading-relaxed line-clamp-3 mb-6">"{event.report}"</p>
                            <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                                <button className="text-[10px] font-black text-primary uppercase hover:underline">Full Story</button>
                                <div className="flex -space-x-2">
                                    {[1,2].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>)}
                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[8px] font-bold text-white">+{event.images.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Internal upload icon
const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export default AIGallery;
