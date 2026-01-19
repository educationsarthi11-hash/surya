
import React, { useState } from 'react';
import { SpeakerWaveIcon, StopCircleIcon, HeartIcon, SparklesIcon, PhoneIcon, BoltIcon, GlobeAltIcon } from '../icons/AllIcons';
import { useSpeech } from '../../hooks/useSpeech';
import { generateText } from '../../services/geminiService';
import Loader from '../Loader';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../hooks/useToast';

const ParentBridgeWidget: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState('');
    const [mode, setMode] = useState<'Standard' | 'Dialect'>('Dialect');
    const { selectedLanguage } = useLanguage();
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: 'Hindi' });
    const toast = useToast();

    const fetchVoiceReport = async () => {
        setLoading(true);
        try {
            const prompt = `
                आप 'सार्थी विद्या सेतु' असिस्टेंट हैं। 
                भाषा: **${selectedLanguage.nativeName}**। 
                मोड: **${mode}** (अगर 'Dialect' है तो शुद्ध क्षेत्रीय लहजा उपयोग करें)।
                
                छात्र 'सूर्यांशू' के माता-पिता के लिए आज की प्रगति रिपोर्ट तैयार करें।
                निर्देश:
                1. पूरी तरह से **${selectedLanguage.nativeName}** में बोलें।
                2. अगर मोड 'Dialect' है, तो लहजा ऐसा रखें जैसे गाँव का कोई जानकार व्यक्ति बात कर रहा हो (Haryanvi/Punjabi nuances in Hindi script)।
                3. शामिल करें: 
                   - आज छात्र ने 'ITI ट्रेड' में बहुत अच्छा प्रदर्शन किया।
                   - क्लास टेस्ट में 10 में से 9 अंक मिले।
                   - कल सुबह 9 बजे वर्कशॉप में नया प्रैक्टिकल है।
                4. अंत में माता-पिता को उनके आशीर्वाद के लिए धन्यवाद दें।
            `;
            const text = await generateText(prompt, 'gemini-3-pro-preview');
            setReport(text);
            playAudio(text, 0);
            toast.success("रिपोर्ट तैयार है!");
        } catch (e) {
            toast.error("रिपोर्ट तैयार नहीं हो सकी।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <HeartIcon className="h-32 w-32 text-white" />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-primary/20 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <BoltIcon className="h-4 w-4 text-primary animate-pulse"/>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Parent Voice Bridge</span>
                    </div>
                    <button 
                        onClick={() => setMode(mode === 'Standard' ? 'Dialect' : 'Standard')}
                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        <GlobeAltIcon className="h-3 w-3"/> Mode: {mode}
                    </button>
                </div>

                <h3 className="text-3xl font-black mb-3 font-hindi leading-tight drop-shadow-lg text-white">विद्या सेतु: वॉयस रिपोर्ट</h3>
                <p className="text-blue-100 text-lg font-hindi opacity-80 leading-relaxed mb-10 max-w-sm">अपनी क्षेत्रीय बोली ({selectedLanguage.nativeName}) में अपने बच्चे की प्रोग्रेस सुनें।</p>

                <div className="space-y-4">
                    {report && (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] mb-6 animate-pop-in shadow-inner">
                            <p className="text-base font-hindi font-medium italic opacity-90 leading-relaxed">"{report}"</p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={isSpeaking ? stopAudio : fetchVoiceReport}
                            disabled={loading}
                            className={`py-6 rounded-3xl font-black text-sm tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl transform active:scale-95 ${isSpeaking ? 'bg-red-600' : 'bg-primary hover:bg-orange-600'}`}
                        >
                            {loading ? <Loader message="" /> : isSpeaking ? <><StopCircleIcon className="h-7 w-7"/> STOP REPORT</> : <><SpeakerWaveIcon className="h-7 w-7"/> LISTEN IN {selectedLanguage.nativeName.toUpperCase()}</>}
                        </button>
                        
                        <a href="tel:9053144592" className="py-6 bg-white/10 border border-white/10 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/20 transition-all backdrop-blur-sm">
                            <PhoneIcon className="h-5 w-5 text-green-400"/> Admin Hotline
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentBridgeWidget;
