
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    MicrophoneIcon, StopCircleIcon, SpeakerWaveIcon, 
    HeartIcon, SparklesIcon, PhoneIcon, ArrowLeftIcon 
} from './icons/AllIcons';
import { useSpeech } from '../hooks/useSpeech';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import Loader from './Loader';

const AIParentVoiceHub: React.FC = () => {
    const { selectedLanguage } = useLanguage();
    const { userName, institutionName } = useAppConfig();
    const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([]);
    const [loading, setLoading] = useState(false);
    
    const { 
        isListening, 
        speechInput, 
        toggleListening, 
        playAudio, 
        stopAudio, 
        isSpeaking,
        setSpeechInput 
    } = useSpeech({ 
        enableSpeechRecognition: true, 
        initialLanguage: 'Hindi' 
    });

    useEffect(() => {
        if (speechInput && !isListening) {
            handleVoiceQuery(speechInput);
            setSpeechInput('');
        }
    }, [speechInput, isListening]);

    const handleVoiceQuery = async (query: string) => {
        setMessages(prev => [...prev, { sender: 'user', text: query }]);
        setLoading(true);
        stopAudio();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                आप 'सार्थी अभिभावक मित्र' हैं। 
                संस्था: ${institutionName}। छात्र: ${userName}।
                भाषा (Dialect): **${selectedLanguage.nativeName}**।
                
                पेरेंट्स का सवाल: "${query}"
                
                निर्देश:
                1. पूरी तरह से **${selectedLanguage.nativeName}** में जवाब दें (यदि हरियाणवी है तो ठेठ हरियाणवी लहजा रखें)।
                2. लहजा बहुत सम्मानजनक और अपनेपन वाला हो (जैसे 'जी' लगाकर बात करें)।
                3. जवाब छोटा और सुनने में आसान रखें (अधिकतम 3 वाक्य)।
                4. उन्हें बताएं कि उनका बच्चा ${userName} अच्छे से पढ़ रहा है।
                
                Return just the spoken text.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            const aiText = response.text || "माफ़ करना जी, मैं समझ नहीं पाया।";
            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
            playAudio(aiText, messages.length + 1);

        } catch (e) {
            setMessages(prev => [...prev, { sender: 'ai', text: "सर्वर में कुछ दिक्कत है जी, थोड़ी देर बाद पूछना।" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-10 rounded-[4rem] shadow-soft h-full min-h-[700px] flex flex-col items-center justify-between border-4 border-orange-50 animate-pop-in">
            <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner text-orange-600">
                    <HeartIcon className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 font-hindi leading-tight">विद्या सेतु: अभिभावक केंद्र</h2>
                <p className="text-slate-500 font-hindi text-xl px-4">
                    बोलकर पूछें कि आपका बच्चा **${userName}** स्कूल में क्या कर रहा है।
                </p>
            </div>

            <div className="flex-1 w-full max-w-2xl overflow-y-auto my-8 p-6 space-y-6 custom-scrollbar bg-slate-50 rounded-[3rem] border-2 border-slate-100 shadow-inner">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                        <SparklesIcon className="h-16 w-16 text-primary" />
                        <p className="font-hindi font-bold text-2xl uppercase tracking-widest">बटन दबाकर पूछना शुरू करें</p>
                    </div>
                ) : (
                    messages.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}>
                            <div className={`p-5 rounded-[2rem] max-w-[85%] shadow-md text-lg font-hindi leading-relaxed ${m.sender === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border-2 border-orange-100 text-slate-800 rounded-tl-none'}`}>
                                {m.text}
                            </div>
                        </div>
                    ))
                )}
                {loading && <div className="flex justify-start"><Loader message="विचार कर रहा हूँ..." /></div>}
            </div>

            <div className="w-full max-w-md flex flex-col items-center gap-8 mb-4">
                <button 
                    onClick={toggleListening}
                    className={`p-12 rounded-full shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)] transition-all transform active:scale-90 border-[12px] ${isListening ? 'bg-red-600 border-red-100 animate-pulse' : 'bg-primary border-orange-50 hover:scale-105'}`}
                >
                    {isListening ? <StopCircleIcon className="h-16 w-16 text-white"/> : <MicrophoneIcon className="h-16 w-16 text-white"/>}
                </button>
                
                <div className="flex flex-col items-center">
                    <p className={`font-black uppercase tracking-[0.3em] mb-2 ${isListening ? 'text-red-500' : 'text-slate-400'}`}>
                        {isListening ? "Listening (मैं सुन रहा हूँ...)" : "Tap to Speak (बोलने के लिए दबाएं)"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIParentVoiceHub;
