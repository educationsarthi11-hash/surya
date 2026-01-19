
import React, { useState } from 'react';
import { ShieldCheckIcon, ScaleIcon, ExclamationTriangleIcon, SparklesIcon, HeartIcon, PhoneIcon, ChatBubbleIcon, PaperAirplaneIcon, ArrowPathIcon, CheckCircleIcon } from './icons/AllIcons';
import { generateText } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const LegalGuidelines: React.FC = () => {
    const toast = useToast();
    const [query, setQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const guidelines = [
        {
            title: "हमारा शुभ-संकल्प (Vision)",
            icon: <HeartIcon className="h-8 w-8 text-red-500" />,
            desc: "एजुकेशन सार्थी का जन्म व्यापार के लिए नहीं, बल्कि मंगमत के हर बच्चे को आधुनिक तकनीक से जोड़ने के लिए हुआ है। आप हमारे उपभोक्ता नहीं, परिवार हैं।",
            color: "border-red-100 bg-red-50/50"
        },
        {
            title: "AI एक सहायक है (AI Terms)",
            icon: <SparklesIcon className="h-8 w-8 text-amber-500" />,
            desc: "AI तकनीक बहुत शक्तिशाली है पर यह किसी शिक्षक या किताबों का विकल्प नहीं है। AI द्वारा दी गई किसी भी जानकारी को अंतिम सत्य न मानें और शिक्षक की सलाह लें।",
            color: "border-amber-100 bg-amber-50/50"
        },
        {
            title: "डेटा सुरक्षा का वचन (Data Privacy)",
            icon: <ShieldCheckIcon className="h-8 w-8 text-blue-600" />,
            desc: "आपका नाम और पढ़ाई का डेटा सुरक्षित है। एजुकेशन सार्थी किसी भी तीसरे पक्ष को आपका डेटा नहीं बेचता। सुरक्षा हमारी सर्वोच्च प्राथमिकता है।",
            color: "border-blue-100 bg-blue-50/50"
        },
        {
            title: "स्वतंत्रता का अधिकार (Freedom)",
            icon: <CheckCircleIcon className="h-8 w-8 text-green-600" />,
            desc: "हम आपकी प्रगति में सार्थी हैं। यदि आपको कभी भी लगे कि यह सिस्टम आपकी जरूरतों के अनुकूल नहीं है, तो आप बिना किसी कानूनी अड़चन के सेवाएं रद्द कर सकते हैं।",
            color: "border-green-100 bg-green-50/50"
        }
    ];

    const handleAskLaw = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const prompt = `You are a warm, helpful legal guide for 'Education Sarthi'. Answer this user query in very polite Hindi: "${query}". 
            IMPORTANT: Clearly state that the company provides these AI tools as a 'best effort' service and is not legally liable for any indirect damages or AI errors. Use reassuring but firm legal disclaimers wrapped in friendly language.`;
            const result = await generateText(prompt, 'gemini-3-flash-preview');
            setAiResponse(result);
        } catch (e) {
            toast.error("AI सलाहकार अभी व्यस्त है।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-10 space-y-12 animate-sunrise max-w-6xl mx-auto">
            {/* Header section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 text-white rounded-full shadow-xl">
                    <CheckCircleIcon className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">भरोसे का सार्थी - संकल्प पत्र</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                    सफलता और <span className="text-primary">शुभ-सहमति</span>
                </h2>
                <p className="text-xl text-slate-500 font-hindi font-medium max-w-2xl mx-auto leading-relaxed">
                    "यह नियम आपको बांधने के लिए नहीं, बल्कि आपकी और हमारी सुरक्षा सुनिश्चित करने के लिए हैं।"
                </p>
            </div>

            {/* Reassuring Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {guidelines.map((g, i) => (
                    <div key={i} className={`p-10 rounded-[3.5rem] border-4 transition-all hover:shadow-2xl hover:-translate-y-1 ${g.color}`}>
                        <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg mb-8 border border-white/50">{g.icon}</div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4 font-hindi">{g.title}</h3>
                        <p className="text-slate-600 font-hindi text-lg leading-relaxed font-medium">{g.desc}</p>
                    </div>
                ))}
            </div>

            {/* Interactive Shanka Nivaran */}
            <div className="bg-slate-900 p-8 sm:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl border-b-[12px] border-primary">
                <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-4xl font-black uppercase tracking-tight flex items-center gap-4">
                                <ChatBubbleIcon className="h-10 w-10 text-primary" /> 
                                मन की शंका दूर करें
                            </h4>
                            <p className="text-slate-400 font-hindi text-xl leading-relaxed">
                                क्या आप हमारे नियमों या प्लान को लेकर चिंतित हैं? बेझिझक यहाँ पूछें, हमारा AI सार्थी आपको एक जिम्मेदार परिवार की तरह जवाब देगा।
                            </p>
                        </div>
                        
                        <div className="flex gap-4 bg-white/5 p-4 rounded-[2.5rem] border-2 border-white/10 focus-within:border-primary transition-all shadow-inner">
                            <input 
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="जैसे: क्या मेरा प्लान सुरक्षित है?"
                                className="flex-1 bg-transparent border-none focus:ring-0 px-6 font-hindi font-bold text-xl outline-none placeholder:text-slate-600"
                            />
                            <button 
                                onClick={handleAskLaw}
                                disabled={loading}
                                className="bg-primary text-slate-950 p-5 rounded-[2rem] hover:bg-white transition-all shadow-2xl active:scale-95"
                            >
                                <PaperAirplaneIcon className="h-8 w-8" />
                            </button>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full h-full min-h-[300px] bg-white/5 backdrop-blur-xl rounded-[3.5rem] border-2 border-white/10 p-10 flex flex-col justify-center shadow-2xl relative">
                        <div className="absolute -top-4 -left-4 bg-primary text-slate-950 px-4 py-1 rounded-full text-[10px] font-black uppercase">Sarthi Advice</div>
                        {loading ? (
                            <div className="py-10"><Loader message="AI सार्थी जानकारी जुटा रहा है..." /></div>
                        ) : aiResponse ? (
                            <div className="animate-pop-in">
                                <p className="text-2xl font-hindi leading-relaxed font-medium italic text-slate-100">"{aiResponse}"</p>
                                <button onClick={() => setAiResponse('')} className="mt-8 text-xs font-black text-slate-400 hover:text-primary flex items-center gap-2 uppercase tracking-widest">
                                    <ArrowPathIcon className="h-4 w-4" /> दूसरा सवाल पूछें
                                </button>
                            </div>
                        ) : (
                            <div className="text-center space-y-6 opacity-20 py-10">
                                <ScaleIcon className="h-24 w-24 mx-auto text-slate-400" />
                                <p className="font-hindi font-black text-2xl uppercase tracking-[0.2em]">जवाब यहाँ दिखेगा</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Disclaimer Footer */}
            <div className="p-12 bg-indigo-600 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <ExclamationTriangleIcon className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                    <h4 className="text-3xl font-black uppercase tracking-tighter">जरूरी सूचना</h4>
                    <p className="text-lg font-hindi font-bold mt-2 opacity-90 leading-relaxed">
                        सिस्टम का दुरुपयोग या अभद्र व्यवहार करने पर अकाउंट तुरंत बंद कर दिया जाएगा। हम आपकी उन्नति के लिए वचनबद्ध हैं, पर अनुशासन और आपसी सम्मान हमारा पहला नियम है।
                    </p>
                </div>
                <button className="px-10 py-5 bg-white text-indigo-600 font-black rounded-3xl shadow-xl hover:bg-slate-100 transition-all uppercase tracking-widest text-sm relative z-10">
                    मदद (Support)
                </button>
            </div>
        </div>
    );
};

export default LegalGuidelines;
