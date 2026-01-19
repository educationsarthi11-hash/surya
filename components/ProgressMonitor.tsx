
import React, { useState, useMemo } from 'react';
import { generateText, sanitizeHtml } from '../services/geminiService';
import Loader from './Loader';
import { AcademicCapIcon, SparklesIcon, ChartBarIcon, ArrowTrendingUpIcon, SpeakerWaveIcon, StopCircleIcon, PrinterIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useAppConfig } from '../contexts/AppConfigContext';
import { useSpeech } from '../hooks/useSpeech';

const ProgressMonitor: React.FC = () => {
    const { institutionName, userName } = useAppConfig();
    const [report, setReport] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { playAudio, stopAudio, playingMessageIndex } = useSpeech({ 
        initialLanguage: 'Hindi' 
    });

    // Mock Data for Visual Progress
    const progressData = [
        { month: 'Jan', score: 65 },
        { month: 'Feb', score: 72 },
        { month: 'Mar', score: 68 },
        { month: 'Apr', score: 85 },
        { month: 'May', score: 92 },
    ];

    const handleGenerateAnalysis = async () => {
        setLoading(true);
        setReport('');
        stopAudio();

        try {
            const prompt = `
                Act as an AI Education Expert. Analyze this progress data for student ${userName}: ${JSON.stringify(progressData)}.
                Write a 3-paragraph "Growth Story" in Hindi (Devanagari). 
                1. Acknowledge the significant jump in April/May.
                2. Explain how this performance makes them ready for the next level.
                3. Give a personalized blessing from the institution "${institutionName}".
                Format as HTML. Use <h3> for titles and <p> for text.
            `;
            const response = await generateText(prompt, 'gemini-3-pro-preview');
            setReport(sanitizeHtml(response));
            toast.success("AI ने प्रगति का विश्लेषण कर लिया है!");
        } catch (err) {
            toast.error('रिपोर्ट बनाने में विफल।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 sm:p-8 rounded-[3.5rem] shadow-soft h-full flex flex-col animate-pop-in border border-slate-100">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-slate-900 p-4 rounded-3xl text-primary shadow-xl rotate-3">
                        <ChartBarIcon className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Growth Hub</h2>
                        <p className="text-sm font-hindi font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                            <SparklesIcon className="h-4 w-4 text-primary animate-pulse"/> प्रोग्रेस और स्कोर एनालिसिस
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Visual Analytics */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-slate-100 shadow-inner">
                        <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 uppercase tracking-widest text-xs">
                            <ArrowTrendingUpIcon className="h-5 w-5 text-green-500"/> Performance Chart
                        </h3>
                        <div className="flex items-end gap-4 h-48 justify-between px-4 border-b-2 border-slate-200 pb-2">
                            {progressData.map((d, i) => (
                                <div key={i} className="flex flex-col items-center flex-1 group">
                                    <div 
                                        className="w-full bg-primary rounded-t-xl transition-all duration-1000 group-hover:brightness-110 shadow-lg relative"
                                        style={{ height: `${d.score}%` }}
                                    >
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">{d.score}%</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 mt-2 uppercase">{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Average Score</p>
                            <p className="text-3xl font-black text-slate-800">76.4%</p>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Attendance</p>
                            <p className="text-3xl font-black text-slate-800">98%</p>
                        </div>
                    </div>
                </div>

                {/* AI Narrative Report */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="flex-1 bg-white border-4 border-slate-50 rounded-[3.5rem] p-8 shadow-xl relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 p-10 bg-primary/5 rounded-full blur-3xl"></div>
                        
                        {!report && !loading && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                <AcademicCapIcon className="h-20 w-20 text-slate-200" />
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">AI Report Generator</h3>
                                <p className="text-slate-400 font-hindi max-w-sm">डेटा का विश्लेषण करने और एक विस्तृत कहानी के रूप में रिपोर्ट प्राप्त करने के लिए बटन दबाएं।</p>
                                <button onClick={handleGenerateAnalysis} className="px-10 py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-primary transition-all flex items-center gap-3 active:scale-95 transform hover:-translate-y-1">
                                    <SparklesIcon className="h-6 w-6 text-yellow-300"/> GENERATE AI STORY
                                </button>
                            </div>
                        )}

                        {loading && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <Loader message="AI सार्थी डेटा पढ़ रहा है..." />
                            </div>
                        )}

                        {report && (
                            <div className="animate-pop-in flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h3 className="text-xl font-black text-primary uppercase flex items-center gap-2"><CheckCircleIcon className="h-6 w-6"/> AI Analysis Ready</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => playAudio(report, 1)} className={`p-3 rounded-xl shadow-sm transition-all ${playingMessageIndex === 1 ? 'bg-red-500 text-white' : 'bg-slate-100 text-primary'}`}>
                                            {playingMessageIndex === 1 ? <StopCircleIcon className="h-5 w-5"/> : <SpeakerWaveIcon className="h-5 w-5"/>}
                                        </button>
                                        <button onClick={() => window.print()} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><PrinterIcon className="h-5 w-5"/></button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="prose prose-sm max-w-none font-hindi text-lg leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: report }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressMonitor;
