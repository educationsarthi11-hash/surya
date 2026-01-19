import React, { useState, useEffect } from 'react';
import { getYogaPose } from '../services/geminiService';
import { YogaPose } from '../types';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { ArrowPathIcon, FaceSmileIcon } from './icons/AllIcons';

const AIGuruYoga: React.FC = () => {
    const [pose, setPose] = useState<YogaPose | null>(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const fetchPose = async (forceRefresh = false) => {
        setLoading(true);
        const today = new Date().toDateString();
        const cacheKey = `aiYoga_${today}`;

        if (!forceRefresh) {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    setPose(JSON.parse(cachedData));
                    setLoading(false);
                    return;
                } catch (e) {
                    console.error("Error parsing cached yoga pose", e);
                }
            }
        }

        try {
            const newPose = await getYogaPose();
            setPose(newPose);
            localStorage.setItem(cacheKey, JSON.stringify(newPose));
        } catch (error: any) {
            console.error("Could not fetch yoga pose", error);
            if (error.message?.includes('429') || error.status === 429) {
                toast.error("High traffic. Showing a standard pose.");
                // Fallback static pose to prevent empty state
                setPose({
                    sanskrit_name: "Tadasana",
                    english_name: "Mountain Pose",
                    instructions_hindi: "सीधे खड़े हो जाएं, पैर साथ में। गहरे सांस लें।",
                    instructions_english: "Stand straight with feet together. Breathe deeply.",
                    benefits_hindi: "एकाग्रता और संतुलन सुधारता है।",
                    benefits_english: "Improves focus and balance."
                });
            } else {
                toast.error("Could not fetch a new yoga pose.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPose();
    }, []);

    return (
        <div className="p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <FaceSmileIcon className="h-8 w-8 text-teal-600" />
                    <div>
                        <h3 className="text-lg font-bold text-teal-900">AI Yoga Guru</h3>
                        <p className="text-sm text-teal-700 font-hindi">आज का आसन</p>
                    </div>
                </div>
                <button 
                    onClick={() => fetchPose(true)} 
                    disabled={loading}
                    className="p-2 rounded-full hover:bg-black/10 transition-colors disabled:opacity-50"
                    aria-label="Get new yoga pose"
                >
                    <ArrowPathIcon className={`h-5 w-5 text-teal-800 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader message="Finding a new pose for you..." />
                </div>
            ) : pose ? (
                <div className="space-y-4 animate-pop-in">
                    <div className="text-center bg-white/50 p-4 rounded-lg shadow-sm border border-black/10">
                        <p className="text-3xl font-hindi font-semibold text-teal-800">{pose.sanskrit_name}</p>
                        <p className="text-xl font-semibold text-teal-700">({pose.english_name})</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/50 p-4 rounded-lg shadow-sm border border-black/10">
                            <h4 className="font-bold font-hindi text-teal-800 mb-2">निर्देश (Instructions)</h4>
                            <p className="text-sm font-hindi whitespace-pre-line mb-3">{pose.instructions_hindi}</p>
                            <p className="text-sm whitespace-pre-line">{pose.instructions_english}</p>
                        </div>
                         <div className="bg-white/50 p-4 rounded-lg shadow-sm border border-black/10">
                            <h4 className="font-bold font-hindi text-teal-800 mb-2">लाभ (Benefits)</h4>
                            <p className="text-sm font-hindi whitespace-pre-line mb-3">{pose.benefits_hindi}</p>
                            <p className="text-sm whitespace-pre-line">{pose.benefits_english}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-teal-700">Could not load a yoga pose. Please try again.</p>
            )}
        </div>
    );
};

export default AIGuruYoga;