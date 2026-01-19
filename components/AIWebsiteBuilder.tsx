
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { GlobeAltIcon, SparklesIcon, PaintBrushIcon, DevicePhoneMobileIcon, ArrowDownTrayIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const AIWebsiteBuilder: React.FC = () => {
    const toast = useToast();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [websitePreview, setWebsitePreview] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please describe your school/coaching center.");
            return;
        }

        setLoading(true);
        try {
            const systemPrompt = `
                Act as a Senior Web Designer. Generate a single-page HTML/CSS website code for the following institution: "${prompt}".
                Include a hero section, services, about us, and a contact form.
                Use modern styling with standard CSS (no external frameworks for preview).
                Format the response as raw HTML without markdown code blocks.
            `;
            const result = await generateText(systemPrompt, 'gemini-3-pro-preview');
            setWebsitePreview(result);
            toast.success("Website Generated! Previewing now.");
        } catch (e) {
            toast.error("Failed to build website.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col animate-pop-in">
            <div className="flex items-center mb-6 shrink-0 border-b pb-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary mr-3">
                    <GlobeAltIcon className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">AI Website Builder</h2>
                    <p className="text-sm text-neutral-500 font-hindi">1 मिनट में अपने संस्थान की ब्रांडेड वेबसाइट लॉन्च करें</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
                <div className="space-y-6 flex flex-col">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
                        <SparklesIcon className="h-5 w-5 mb-2 text-primary animate-pulse"/>
                        Describe your institution (Name, Location, Specialty). Our AI will build a professional, mobile-ready landing page for your brand.
                    </div>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. 'Mangmat Excellence Coaching', focusing on IIT-JEE and NEET prep with modern facilities and expert faculty..."
                        className="w-full flex-1 p-4 border rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm bg-slate-50"
                    />
                    <button 
                        onClick={handleGenerate} 
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                        {loading ? <Loader message="Designing..." /> : <><PaintBrushIcon className="h-5 w-5"/> Generate Website</>}
                    </button>
                </div>

                <div className="bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-slate-800 flex flex-col shadow-2xl">
                    <div className="bg-slate-800 p-2 flex items-center gap-2 px-4 shrink-0">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                        <div className="mx-auto bg-slate-700 px-4 py-0.5 rounded text-[10px] text-slate-400 font-mono">www.yourschool.com</div>
                    </div>
                    <div className="flex-1 bg-white overflow-y-auto relative">
                        {websitePreview ? (
                            <iframe 
                                srcDoc={websitePreview} 
                                title="Website Preview" 
                                className="w-full h-full border-none"
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center p-12">
                                <GlobeAltIcon className="h-20 w-20 mb-4 opacity-20 animate-spin-slow"/>
                                <p className="font-bold">Your website preview will appear here.</p>
                                <p className="text-xs mt-2">Enter your school details to the left.</p>
                            </div>
                        )}
                    </div>
                    {websitePreview && (
                        <div className="p-4 bg-slate-800 border-t border-white/5 flex justify-between items-center shrink-0">
                            <div className="flex gap-2 items-center">
                                <DevicePhoneMobileIcon className="h-4 w-4 text-slate-400"/>
                                <span className="text-[10px] text-slate-400 uppercase font-black">Mobile Responsive</span>
                            </div>
                            <button onClick={() => toast.success("Code Ready for Deployment!")} className="text-xs font-black text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-all flex items-center gap-2">
                                <ArrowDownTrayIcon className="h-4 w-4"/> Launch Branded Site
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIWebsiteBuilder;
