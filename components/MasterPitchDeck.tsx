
import React, { useState } from 'react';
import { generateText, sanitizeHtml } from '../services/geminiService';
import { SparklesIcon, BriefcaseIcon, PhoneIcon, SpeakerWaveIcon, StopCircleIcon, DocumentTextIcon, ClipboardIcon, ArrowRightIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useSpeech } from '../hooks/useSpeech';
import Loader from './Loader';

const MasterPitchDeck: React.FC = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [script, setScript] = useState('');
    const [scenario, setScenario] = useState('MNC (Cold Call)');
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    const scenarios = [
        { id: 'mnc', label: 'MNC (Cold Call)', desc: 'बड़े कॉर्पोरेट हाउस से बात करने के लिए' },
        { id: 'local', label: 'Local Business', desc: 'शहर की किसी स्थानीय दुकान या फर्म के लिए' },
        { id: 'objection', label: 'Handling Objections', desc: 'जब कंपनी फीस या भरोसे पर सवाल करे' }
    ];

    const generatePitch = async () => {
        setLoading(true);
        setScript('');
        stopAudio();
        try {
            const prompt = `
                Act as 'Chief Sales Strategist' for Education Sarthi.
                Create a high-impact, persuasive verbal pitch script for Manoj ji.
                Scenario: ${scenario}
                
                Content MUST include these points in easy Hinglish:
                1. "Zero-Cost Training Model" - We solve their hiring pain for free.
                2. "Stability Score" - Our students are 100% verified and local (won't leave).
                3. "Day-1 Productivity" - No learning curve.
                
                LANGUAGE: Professional Hindi (Hinglish) mix.
                FORMAT: HTML with Headings and Bullet points for easy reading.
            `;
            const result = await generateText(prompt, 'gemini-3-pro-preview');
            setScript(sanitizeHtml(result));
            toast.success("Magic Pitch Generated!");
        } catch (e) {
            toast.error("AI is busy.");
        } finally {
            setLoading(false);
        }
    };

    const copyScript = () => {
        const text = script.replace(/<[^>]*>/g, '');
        navigator.clipboard.writeText(text);
        toast.success("Script copied for WhatsApp!");
    };

    return (
        <div className="h-full flex flex-col space-y-10 animate-pop-in">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Master <span className="text-primary">Pitch Deck</span></h2>
                <p className="text-xl text-slate-500 font-hindi font-medium">कंपनियों से बात करने का "जादुई तरीका" यहाँ से चुनें</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 overflow-hidden">
                {/* Controls */}
                <div className="lg:col-span-4 space-y-4">
                    {scenarios.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setScenario(s.label)}
                            className={`w-full p-8 rounded-[3rem] border-4 transition-all text-left flex flex-col ${scenario === s.label ? 'border-primary bg-primary/5 shadow-xl' : 'border-slate-50 bg-slate-50 opacity-60 hover:opacity-100'}`}
                        >
                            <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight mb-2">{s.label}</h4>
                            <p className="text-sm text-slate-500 font-hindi font-bold leading-relaxed">{s.desc}</p>
                        </button>
                    ))}
                    <button 
                        onClick={generatePitch}
                        disabled={loading}
                        className="w-full py-6 bg-slate-950 text-white font-black rounded-3xl shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 text-xl mt-6 disabled:opacity-50"
                    >
                        {loading ? <Loader message="" /> : <><SparklesIcon className="h-6 w-6 text-yellow-300"/> GET AI SCRIPT</>}
                    </button>
                </div>

                {/* Output */}
                <div className="lg:col-span-8 bg-slate-900 rounded-[4rem] border-[12px] border-slate-800 p-12 shadow-3xl flex flex-col relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-5"><SpeakerWaveIcon className="h-40 w-40 text-primary"/></div>
                     
                     <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Script Preview</span>
                        </div>
                        <div className="flex gap-4">
                             <button onClick={copyScript} className="p-3 bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all"><ClipboardIcon className="h-6 w-6"/></button>
                             <button onClick={() => playAudio(script, 0)} className={`p-3 rounded-xl transition-all ${isSpeaking ? 'bg-red-500' : 'bg-primary text-slate-950'}`}>
                                 {isSpeaking ? <StopCircleIcon className="h-6 w-6"/> : <SpeakerWaveIcon className="h-6 w-6"/>}
                             </button>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                        {script ? (
                            <div className="prose prose-invert prose-lg max-w-none font-hindi leading-relaxed" dangerouslySetInnerHTML={{ __html: script }} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                <DocumentTextIcon className="h-24 w-24 mb-6" />
                                <p className="text-3xl font-black uppercase tracking-widest">Select Scenario <br/> to begin pitch</p>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default MasterPitchDeck;
