
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { LeafIcon, SparklesIcon } from './icons/AllIcons';
import Loader from './Loader';

const AIAyurvedaGuru: React.FC = () => {
    const [tip, setTip] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getDailyTip = async () => {
        setLoading(true);
        try {
            const prompt = "Give me one short, practical Ayurvedic health tip for students (e.g. for focus, eye health, or stress). Output in Hindi and English. Format: JSON { 'hindi': '...', 'english': '...' }";
            const response = await generateText(prompt, 'gemini-2.5-flash');
            const json = JSON.parse(response.replace(/```json|```/g, '').trim());
            setTip(json);
        } catch (e) {
            setTip("Drink warm water in the morning. (सुबह गर्म पानी पियें।)"); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 text-green-800 mb-4">
                <LeafIcon className="h-6 w-6" />
                <h3 className="font-bold text-lg">Ayurveda Daily</h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                {!tip && !loading && (
                    <button 
                        onClick={getDailyTip}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        <SparklesIcon className="h-5 w-5" /> Get Health Tip
                    </button>
                )}
                
                {loading && <Loader message="Finding natural remedy..." />}
                
                {tip && (
                    <div className="animate-pop-in bg-white/60 p-4 rounded-xl border border-green-100">
                        <p className="text-lg font-bold text-slate-800 font-hindi mb-2">{(tip as any).hindi}</p>
                        <p className="text-sm text-slate-600">{(tip as any).english}</p>
                        <button onClick={getDailyTip} className="mt-4 text-xs font-bold text-green-700 hover:underline">Next Tip</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAyurvedaGuru;
