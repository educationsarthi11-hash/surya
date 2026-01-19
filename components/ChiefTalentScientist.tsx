
import React, { useState, useRef, useEffect } from 'react';
import { generateText, sanitizeHtml } from '../services/geminiService';
import { SparklesIcon, BriefcaseIcon, PaperAirplaneIcon, DocumentTextIcon, PrinterIcon, ArrowDownTrayIcon, PhoneIcon, ShieldCheckIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const ChiefTalentScientist: React.FC = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [proposal, setProposal] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        location: '',
        jobRole: '',
        requirements: ''
    });

    const handleGenerate = async () => {
        if (!formData.companyName || !formData.jobRole) {
            toast.error("Please fill Company Name and Job Role.");
            return;
        }

        setLoading(true);
        setProposal('');

        try {
            const prompt = `
                Act as the 'Chief Talent Scientist' for Education Sarthi.
                Draft a high-impact corporate hiring proposal for:
                - Company: ${formData.companyName}
                - Location: ${formData.location}
                - Role: ${formData.jobRole}
                - Additional Context: ${formData.requirements}

                Your proposal MUST emphasize these three promises (Manoj ji's Core Mission):
                1. Promise 1 (Immediate Replacement): If a student leaves within 3 months, we replace for free.
                2. Promise 2 (Day-1 Productivity): Our 'Hire-Train-Deploy' model ensures no learning curve.
                3. Promise 3 (Zero Fraud): Absolute guarantee of zero MLM or network marketing involvement. Real jobs, Real salaries.
                
                Also mention: Pin-code based hiring strategy for low attrition.
                
                LANGUAGE: Professional Business English with emotional Hindi touches.
                FORMAT: Clean HTML with <h3>, <ul>, <p>.
            `;

            const result = await generateText(prompt, 'gemini-3-pro-preview');
            setProposal(sanitizeHtml(result));
            toast.success("Corporate Proposal Generated!");
        } catch (e) {
            toast.error("Strategist Node Busy.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-10 animate-pop-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Form Side */}
                <div className="bg-slate-50 p-12 rounded-[4rem] border-4 border-slate-100 space-y-10 shadow-inner">
                    <div>
                        <h3 className="text-4xl font-black text-slate-900 uppercase italic leading-none">Talent <span className="text-primary">Scientist</span></h3>
                        <p className="text-xl font-hindi font-bold text-slate-400 mt-2 italic">हयरिंग और ट्रेनिंग का समाधान</p>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-6">Target Client</label>
                                <input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Google India" className="w-full p-6 rounded-[2rem] border-2 border-transparent focus:border-primary outline-none font-bold shadow-sm text-lg" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-6">Deployment Hub</label>
                                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Rohtak" className="w-full p-6 rounded-[2rem] border-2 border-transparent focus:border-primary outline-none font-bold shadow-sm text-lg" />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-6">Executive Job Role</label>
                             <input value={formData.jobRole} onChange={e => setFormData({...formData, jobRole: e.target.value})} placeholder="e.g. Area Sales Manager" className="w-full p-6 rounded-[2rem] border-2 border-transparent focus:border-primary outline-none font-black text-xl shadow-sm text-slate-900" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-6">HR Parameters</label>
                             <textarea value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} rows={4} placeholder="e.g. Requires local Haryanvi fluency, stability score > 80%..." className="w-full p-8 rounded-[3rem] border-2 border-transparent focus:border-primary outline-none font-hindi font-medium shadow-sm text-lg leading-relaxed" />
                        </div>
                        
                        <button 
                            onClick={handleGenerate} 
                            disabled={loading}
                            className="w-full py-8 bg-slate-950 text-white font-black rounded-3xl shadow-3xl hover:bg-primary hover:text-slate-950 transition-all transform active:scale-95 flex items-center justify-center gap-6 text-2xl uppercase tracking-tighter disabled:opacity-50"
                        >
                            {loading ? <Loader message="" /> : <><SparklesIcon className="h-8 w-8 text-yellow-300"/> DRAFT MAGICAL PROPOSAL</>}
                        </button>
                    </div>
                </div>

                {/* Output Side */}
                <div className="bg-white rounded-[5rem] border-[15px] border-slate-50 flex flex-col shadow-3xl relative overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                             <DocumentTextIcon className="h-6 w-6 text-indigo-600"/>
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Official Document Draft</span>
                        </div>
                        {proposal && (
                             <div className="flex gap-3">
                                 <button onClick={() => window.print()} className="p-3 bg-white shadow-sm rounded-xl text-slate-600 transition-colors"><PrinterIcon className="h-5 w-5"/></button>
                                 <button className="p-3 bg-white shadow-sm rounded-xl text-indigo-600 transition-colors"><ArrowDownTrayIcon className="h-5 w-5"/></button>
                             </div>
                        )}
                    </div>
                    
                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
                         {proposal ? (
                             <div className="prose prose-slate lg:prose-xl max-w-none animate-pop-in" dangerouslySetInnerHTML={{ __html: proposal }} />
                         ) : (
                             <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-20 space-y-8">
                                  <BriefcaseIcon className="h-40 w-40" />
                                  <p className="font-black uppercase tracking-[0.5em] text-2xl">Awaiting Data Node</p>
                             </div>
                         )}
                    </div>
                    
                    {proposal && (
                        <div className="p-8 bg-green-50 border-t-4 border-green-500 flex items-center gap-6">
                            <ShieldCheckIcon className="h-10 w-10 text-green-600 shrink-0" />
                            <p className="text-sm font-hindi font-bold text-green-800">यह प्रपोजल MGM के "नो-फ्रॉड" और "3-महीने रिप्लेसमेंट" वादे के साथ सुरक्षित है।</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChiefTalentScientist;
