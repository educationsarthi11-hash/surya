
import React, { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { generateText } from '../services/geminiService';
import { SpeakerWaveIcon, StopCircleIcon, UserCircleIcon, SparklesIcon } from './icons/AllIcons';
import Loader from './Loader';
import { useLanguage } from '../contexts/LanguageContext';

const ParentCoach: React.FC = () => {
    const { selectedLanguage } = useLanguage();
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const prompt = `
                आप 'अभिभावक मित्र' हैं। 
                भाषा (Dialect): **${selectedLanguage.nativeName}**। 
                
                लक्ष्य: माता-पिता को उनके बच्चे की आज की पढ़ाई का विवरण देना।
                निर्देश:
                1. पूरी तरह से **${selectedLanguage.nativeName}** में बोलें।
                2. लहजा ऐसा रखें जैसे कोई बड़ा-बुजुर्ग या शिक्षक घर आकर समझा रहा हो।
                3. शामिल करें: आज बच्चे ने क्या नया सीखा, कल का होमवर्क क्या है, और एक उत्साहवर्धक विचार।
                4. कठिन शब्द बिल्कुल न बोलें।
            `;
            const text = await generateText(prompt);
            setSummary(text);
            playAudio(text, 0);
        } catch (e) {
            setSummary("अभी जानकारी उपलब्ध नहीं है।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-soft h-full flex flex-col items-center justify-center text-center border-2 border-orange-100">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600 shadow-inner">
                <UserCircleIcon className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 font-hindi">अभिभावक मित्र</h2>
            <p className="text-slate-500 mb-8 font-hindi">आज की वॉयस रिपोर्ट ({selectedLanguage.nativeName})</p>

            {loading ? <Loader message="AI रिपोर्ट तैयार कर रहा है..." /> : (
                <div className="space-y-4 w-full max-w-md">
                    {summary && (
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-slate-700 font-hindi mb-4 text-left shadow-sm">
                            {summary}
                        </div>
                    )}
                    <button 
                        onClick={isSpeaking ? stopAudio : fetchSummary}
                        className={`w-full py-5 rounded-3xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${isSpeaking ? 'bg-red-500' : 'bg-orange-600 hover:bg-orange-700'}`}
                    >
                        {isSpeaking ? <><StopCircleIcon className="h-6 w-6"/> बंद करें</> : <><SpeakerWaveIcon className="h-6 w-6"/> रिपोर्ट सुनें</>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ParentCoach;
