
import React, { useState, useRef } from 'react';
// Fix: Added missing import for Loader
import Loader from './Loader';
import { 
    PlayIcon, VideoCameraIcon, XIcon, ArrowDownTrayIcon, 
    DocumentTextIcon, SparklesIcon, HeartIcon, ClipboardIcon,
    CheckCircleIcon, StarIcon, RocketLaunchIcon, SpeakerWaveIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

// Fixed: Global declarations
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    description: string;
    videoUrl: string; 
    category: string;
}

export const tutorials: Video[] = [
    {
        id: '1',
        title: '1. EDU SARTHI परिचय',
        category: 'Introduction',
        thumbnail: 'https://placehold.co/600x340/1e293b/f97316?text=EDU+SARTHI%0AIntroduction+(परिचय)&font=roboto',
        duration: '2:30',
        description: 'EDU SARTHI प्लेटफॉर्म का पूरा परिचय। जानें कि यह कैसे आपकी पढ़ाई और करियर में मदद करता है।',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' 
    },
    {
        id: '2',
        title: '2. लॉगिन और प्रोफाइल गाइड',
        category: 'Basics',
        thumbnail: 'https://placehold.co/600x340/1e293b/38bdf8?text=Login+%26+Profile%0A(लॉगिन+गाइड)&font=roboto',
        duration: '3:15',
        description: 'सुरक्षित रूप से लॉगिन करना, अपना पासवर्ड बदलना और अपनी प्रोफाइल फोटो अपडेट करना सीखें।',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
        id: '4',
        title: '3. लाइव क्लास कैसे लें?',
        category: 'Classroom',
        thumbnail: 'https://placehold.co/600x340/1e293b/facc15?text=Live+Classroom%0A(लाइव+क्लास)&font=roboto',
        duration: '2:55',
        description: 'AI टीचर के साथ रीयल-टाइम क्लास, व्हाइटबोर्ड और ऑडियो सत्र में शामिल होने का तरीका।',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    }
];

const VideoGuide: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [activeSection, setActiveSection] = useState<'videos' | 'script' | 'plan'>('videos');
    const manualRef = useRef<HTMLDivElement>(null);
    const toast = useToast();

    const promoScript = [
      { 
        scene: "हुक (Hook)", 
        visual: "मंगमत स्कूल की भव्य बिल्डिंग और बच्चे हँसते हुए", 
        audio: "क्या आप चाहते हैं कि आपका बच्चा आने वाले कल की तकनीक आज ही सीखे? मंगमत के इतिहास में पहली बार!" 
      },
      { 
        scene: "दाखिला (Admission)", 
        visual: "स्मार्टफोन से आधार कार्ड स्कैन होते हुए", 
        audio: "पेश है AI स्मार्ट एडमिशन! अब घंटों की लाइन नहीं, सिर्फ 10 सेकंड में आधार स्कैन करें और पाएं डिजिटल आईडी कार्ड।" 
      },
      { 
        scene: "पढ़ाई (Learning)", 
        visual: "AI सार्थी गुरुजी बच्चे को हरियाणवी/हिंदी में समझा रहे हैं", 
        audio: "हमारा AI सार्थी ट्यूटर बच्चों को उनकी अपनी भाषा में पढ़ाता है। कठिन से कठिन सवाल अब होंगे आसान!" 
      },
      { 
        scene: "ग्लोबल बाज़ार", 
        visual: "छात्र का बनाया पेंटिंग या मॉडल ऑनलाइन बिकते हुए", 
        audio: "सिर्फ किताबी ज्ञान नहीं, अब हुनर से कमाई भी! छात्र अपने प्रोजेक्ट्स को 'ग्लोबल बाज़ार' में पूरी दुनिया को बेच सकते हैं।" 
      },
      { 
        scene: "सुरक्षा (Safety)", 
        visual: "बस ट्रैकिंग और पेरेंट्स का खुश चेहरा", 
        audio: "सुरक्षा का पक्का वादा! लाइव बस ट्रैकिंग और विद्या सेतु वॉयस रिपोर्ट के साथ पेरेंट्स हमेशा बेफिक्र रहेंगे।" 
      },
      { 
        scene: "कॉल टू एक्शन", 
        visual: "स्कूल का फोन नंबर और वेबसाइट", 
        audio: "एजुकेशन सार्थी - मंगमत की शान, तकनीक का वरदान। आज ही अपने बच्चे का भविष्य सुरक्षित करें!" 
      }
    ];

    const fullPlan = [
        { title: "AI स्मार्ट एडमिशन", desc: "आधार कार्ड स्कैनिंग के साथ 100% पेपरलेस प्रोसेस।" },
        { title: "AI सार्थी गुरु (Tutor)", desc: "12+ भारतीय भाषाओं और क्षेत्रीय बोलियों (Haryanvi/Punjabi) में शिक्षण।" },
        { title: "गूगल Veo वीडियो", desc: "शिक्षकों के लिए एक क्लिक में HD शैक्षिक वीडियो बनाने की सुविधा।" },
        { title: "विद्या सेतु (Parent Bridge)", desc: "पेरेंट्स के लिए बोलकर रिपोर्ट सुनने की अनोखी सुविधा।" },
        { title: "ग्लोबल बाज़ार (Incubator)", desc: "छात्रों के हुनर को व्यापार में बदलने का विश्वस्तरीय प्लेटफॉर्म।" },
        { title: "AI सुरक्षा गार्ड", desc: "छात्रों को ऑनलाइन फ्रॉड और MLM विज्ञापनों से बचाने वाला स्मार्ट फिल्टर।" },
        { title: "3D इंटरएक्टिव लैब", desc: "विज्ञान और तकनीकी विषयों को 3D मॉडल के जरिए करीब से समझना।" },
        { title: "स्मार्ट प्रिंटर (Test Guru)", desc: "1 मिनट में बोर्ड पैटर्न पर आधारित टेस्ट पेपर तैयार करना।" }
    ];

    const copyScriptToClipboard = () => {
        const text = promoScript.map(s => `${s.scene}: ${s.audio}`).join('\n');
        navigator.clipboard.writeText(text);
        toast.success("स्क्रिप्ट कॉपी हो गई! (Script Copied)");
    };

    const handleDownloadManual = async () => {
        if (!manualRef.current) return;
        setIsGeneratingPdf(true);
        toast.info("Generating Plan PDF...");

        try {
            const { jsPDF } = window.jspdf;
            const canvas = await window.html2canvas(manualRef.current, { scale: 1.5, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, imgHeight);
            pdf.save('Education_Sarthi_Mangmat_Full_Plan.pdf');
            toast.success("प्लान और स्क्रिप्ट डाउनलोड हो गई!");
        } catch (error) {
            toast.error("PDF बनाने में विफल।");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="bg-slate-50 p-4 sm:p-10 rounded-[4rem] shadow-soft animate-pop-in h-full flex flex-col border border-slate-200">
            {/* Tool Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                <div className="flex items-center gap-5">
                    <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-2xl rotate-3">
                        <VideoCameraIcon className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Marketing Toolkit</h2>
                        <p className="text-sm text-slate-400 font-hindi font-bold tracking-widest mt-1">वीडियो स्क्रिप्ट और पूर्ण सिस्टम प्लान</p>
                    </div>
                </div>
                
                <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
                    {/* Fix: Changed setActiveTab to setActiveSection to match hook variable name */}
                    <button onClick={() => setActiveSection('videos')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSection === 'videos' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>TUTORIALS</button>
                    <button onClick={() => setActiveSection('script')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSection === 'script' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>VIDEO SCRIPT</button>
                    <button onClick={() => setActiveSection('plan')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeSection === 'plan' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>FULL PLAN</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-10">
                {activeSection === 'videos' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tutorials.map((video, index) => (
                            <div 
                                key={video.id} 
                                className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col p-3"
                                onClick={() => setSelectedVideo(video)}
                            >
                                <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-900 mb-4">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayIcon className="h-14 w-14 text-white" />
                                    </div>
                                </div>
                                <div className="px-4 pb-4">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded mb-2 inline-block">{video.category}</span>
                                    <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors leading-tight mb-2">{video.title}</h3>
                                    <p className="text-xs text-slate-400 font-hindi leading-relaxed line-clamp-2">{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'script' && (
                    <div className="animate-pop-in space-y-8">
                        <div className="flex justify-between items-center px-4">
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic border-l-4 border-indigo-600 pl-4">एडवरटाइजिंग स्क्रिप्ट (Hindi Script)</h3>
                            <button onClick={copyScriptToClipboard} className="flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs hover:bg-indigo-100 transition-all">
                                <ClipboardIcon className="h-4 w-4" /> COPY SCRIPT
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {promoScript.map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all">
                                    <span className="absolute top-4 right-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Scene {i+1}</span>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 font-black text-xs">{item.scene}</div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">🎬 Visual: {item.visual}</p>
                                    <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-indigo-600 italic font-hindi font-medium text-slate-700 leading-relaxed">
                                        "{item.audio}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'plan' && (
                    <div className="animate-pop-in max-w-4xl mx-auto space-y-10">
                        <div className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-4 border-indigo-500/20">
                             <div className="absolute top-0 right-0 p-24 bg-indigo-600/10 rounded-full blur-[100px] -mr-10 -mt-10"></div>
                             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                 <div>
                                     <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1 rounded-full border border-white/10 mb-6">
                                         <SparklesIcon className="h-4 w-4 text-primary" />
                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Official System Blueprint</span>
                                     </div>
                                     <h3 className="text-4xl font-black mb-4 tracking-tighter">मंगमत स्कूल - स्मार्ट AI प्लान</h3>
                                     <p className="text-slate-400 font-hindi text-lg font-medium leading-relaxed max-w-xl">
                                         यह प्लान 'नो-कॉस्ट' वर्जन के लिए तैयार किया गया है, जो किसी भी ग्रामीण या शहरी स्कूल को विश्वस्तरीय तकनीक से जोड़ देगा।
                                     </p>
                                 </div>
                                 <button 
                                    onClick={handleDownloadManual} 
                                    disabled={isGeneratingPdf}
                                    className="px-10 py-5 bg-primary text-white font-black rounded-3xl shadow-xl hover:bg-white hover:text-slate-950 transition-all flex items-center gap-4 group"
                                 >
                                    {isGeneratingPdf ? <Loader message="" /> : <><ArrowDownTrayIcon className="h-6 w-6 group-hover:animate-bounce"/> DOWNLOAD PDF</>}
                                 </button>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fullPlan.map((p, i) => (
                                <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-start gap-6 hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 border border-slate-100 shadow-inner">
                                        <CheckCircleIcon className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 mb-1 font-hindi">{p.title}</h4>
                                        <p className="text-sm text-slate-500 font-hindi leading-relaxed">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-indigo-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                 <RocketLaunchIcon className="h-10 w-10 text-white" />
                             </div>
                             <div className="flex-1 text-center md:text-left">
                                 <h4 className="text-2xl font-black uppercase tracking-tight">Mission Statement</h4>
                                 <p className="font-hindi text-lg opacity-90 mt-2 font-medium">"शिक्षा का स्तर बढ़ाना और बच्चों को भविष्य के लिए तैयार करना ही हमारा लक्ष्य है।"</p>
                             </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden Printable PDF Container */}
            <div className="absolute left-[-9999px] top-0 w-[210mm] bg-white text-slate-800" ref={manualRef}>
                <div className="p-20 space-y-12">
                    <div className="text-center border-b-8 border-indigo-600 pb-10">
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase">EDUCATION SARTHI</h1>
                        <h2 className="text-3xl text-indigo-600 font-hindi font-black mt-4 uppercase">मंगमत स्कूल - पूर्ण AI सिस्टम प्लान (2024)</h2>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic">मुख्य विशेषताएं (Key Features):</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {fullPlan.map((p, i) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
                                    <h4 className="text-xl font-black text-indigo-600 font-hindi mb-1">{p.title}</h4>
                                    <p className="text-sm font-hindi text-slate-600">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 pt-10">
                         <h3 className="text-2xl font-black text-slate-900 uppercase italic">वीडियो मार्केटिंग स्क्रिप्ट (Hindi):</h3>
                         <div className="space-y-4">
                            {promoScript.map((s, i) => (
                                <div key={i} className="p-6 border-l-8 border-indigo-600 bg-slate-50 rounded-r-[2rem]">
                                    <p className="text-xs font-black text-slate-400 uppercase mb-2">SCENE {i+1} - {s.scene}</p>
                                    <p className="font-hindi text-lg font-bold">"{s.audio}"</p>
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className="text-center text-slate-400 text-xs pt-20 border-t-2 border-slate-100">
                        <p className="font-black">Created by Education Sarthi Marketing Engine • Mangmat, Haryana</p>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-fade-in" onClick={() => setSelectedVideo(null)}>
                    <div className="bg-slate-900 rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden relative border-4 border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 bg-slate-950">
                            <div className="flex items-center gap-3">
                                <SparklesIcon className="h-5 w-5 text-primary" />
                                <h3 className="font-black text-white uppercase tracking-widest">{selectedVideo.title}</h3>
                            </div>
                            <button onClick={() => setSelectedVideo(null)} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                <XIcon className="h-8 w-8" />
                            </button>
                        </div>
                        <div className="aspect-video bg-black">
                            <video src={selectedVideo.videoUrl} controls autoPlay className="w-full h-full" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoGuide;
