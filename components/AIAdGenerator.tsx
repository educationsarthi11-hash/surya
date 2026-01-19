
import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import { generateAdCreative } from '../services/geminiService';
import { MegaphoneIcon, SparklesIcon, AcademicCapIcon, MicrophoneIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useSpeech } from '../hooks/useSpeech';

interface AdCreative {
    adCopy: {
        headline: string;
        body: string;
    };
    imageUrl: string | null;
}

const AIAdGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [audience, setAudience] = useState('Parents of school-aged children');
    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('Modern & Clean');

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [adCreative, setAdCreative] = useState<AdCreative | null>(null);

    const { speechInput, setSpeechInput, isListening, toggleListening } = useSpeech({ enableSpeechRecognition: true });
    const [activeSpeechInput, setActiveSpeechInput] = useState<string | null>(null);

    useEffect(() => {
        if (speechInput && !isListening && activeSpeechInput) {
            switch(activeSpeechInput) {
                case 'topic': setTopic(speechInput); break;
                case 'audience': setAudience(speechInput); break;
                case 'message': setMessage(speechInput); break;
            }
            setSpeechInput('');
            setActiveSpeechInput(null);
        }
    }, [speechInput, isListening, activeSpeechInput, setSpeechInput]);

    const handleMicClick = (fieldName: string) => {
        if (isListening && activeSpeechInput === fieldName) {
            toggleListening();
        } else {
            setSpeechInput('');
            setActiveSpeechInput(fieldName);
            toggleListening();
        }
    };

    const handleGenerate = async () => {
        if (!topic.trim() || !message.trim()) {
            toast.error('Please provide an Ad Topic and a Key Message.');
            return;
        }
        setLoading(true);
        setAdCreative(null);

        try {
            const result = await generateAdCreative(topic, audience, message, style);
            setAdCreative(result);
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate ad creative. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col overflow-hidden">
            <div className="flex items-center mb-4 shrink-0">
                <MegaphoneIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">AI Ad Generator</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-6 font-hindi shrink-0">
                अपने स्कूल के अभियानों के लिए सुंदर, प्रभावी विज्ञापन बनाएं। अपने लक्ष्य का वर्णन करें, और AI को रचनात्मक कार्य करने दें।
            </p>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
                {/* --- Input Column --- */}
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-neutral-700">Ad Topic</label>
                        <div className="relative mt-1">
                            <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Annual Science Fair" className="block w-full rounded-md border-neutral-300 shadow-sm p-2 pr-10" />
                             <button type="button" onClick={() => handleMicClick('topic')} className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isListening && activeSpeechInput === 'topic' ? 'text-red-500 animate-pulse' : 'text-neutral-500'}`}>
                                <MicrophoneIcon className="h-5 w-5"/>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="audience" className="block text-sm font-medium text-neutral-700">Target Audience</label>
                         <div className="relative mt-1">
                            <input type="text" id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Parents of school-aged children" className="block w-full rounded-md border-neutral-300 shadow-sm p-2 pr-10" />
                             <button type="button" onClick={() => handleMicClick('audience')} className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isListening && activeSpeechInput === 'audience' ? 'text-red-500 animate-pulse' : 'text-neutral-500'}`}>
                                <MicrophoneIcon className="h-5 w-5"/>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-neutral-700">Key Message / Call to Action</label>
                         <div className="relative mt-1">
                            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="e.g., Discover the wonders of science! Free entry for all." className="block w-full rounded-md border-neutral-300 shadow-sm p-2 pr-10"></textarea>
                             <button type="button" onClick={() => handleMicClick('message')} className={`absolute top-2 right-0 flex items-center pr-3 ${isListening && activeSpeechInput === 'message' ? 'text-red-500 animate-pulse' : 'text-neutral-500'}`}>
                                <MicrophoneIcon className="h-5 w-5"/>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-neutral-700">Visual Style</label>
                        <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2">
                            <option>Modern & Clean</option>
                            <option>Fun & Energetic</option>
                            <option>Professional & Elegant</option>
                            <option>Futuristic & Techy</option>
                            <option>Playful & Illustrated</option>
                        </select>
                    </div>

                    <button onClick={handleGenerate} disabled={loading} className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-neutral-400">
                        <SparklesIcon aria-hidden="true" className="h-5 w-5 mr-2" />
                        {loading ? 'Generating Creative...' : 'Generate Ad Creative'}
                    </button>
                </div>

                {/* --- Output Column --- */}
                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 flex items-center justify-center overflow-y-auto custom-scrollbar">
                    {loading && <Loader message="AI is building your ad..." />}
                    
                    {!loading && !adCreative && (
                         <div className="text-center text-neutral-400">
                            <MegaphoneIcon aria-hidden="true" className="mx-auto h-16 w-16" />
                            <p className="mt-2 text-sm">Your generated ad will appear here.</p>
                        </div>
                    )}
                    
                    {adCreative && (
                        <div className="w-full max-w-sm mx-auto animate-pop-in">
                           <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                {adCreative.imageUrl ? (
                                    <img src={adCreative.imageUrl} alt="AI-generated ad visual" className="w-full h-auto aspect-square object-cover" />
                                ) : (
                                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                                        <span className="text-sm">Image unavailable</span>
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex items-center mb-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <AcademicCapIcon aria-hidden="true" className="h-5 w-5 text-primary" />
                                        </div>
                                        <span className="ml-2 text-sm font-semibold text-neutral-700">Education Sarthi School</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-neutral-900">{adCreative.adCopy.headline}</h3>
                                    <p className="text-sm text-neutral-600 mt-1">{adCreative.adCopy.body}</p>
                                </div>
                           </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIAdGenerator;
