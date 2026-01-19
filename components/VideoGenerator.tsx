
import React, { useState, useEffect, useRef } from 'react';
import ApiKeySelector from './ApiKeySelector';
import Loader from './Loader';
import { generateLessonVideo, generateText } from '../services/geminiService';
import { VideoCameraIcon, FilmIcon, SparklesIcon, PlayIcon, ArrowRightIcon, XCircleIcon, PencilSquareIcon, ArrowDownTrayIcon, ArchiveBoxIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useClassroom } from '../contexts/ClassroomContext';

const VideoGenerator: React.FC = () => {
  const toast = useToast();
  const { selectedClass } = useClassroom();
  const [activeTab, setActiveTab] = useState<'script' | 'create'>('script');
  const [loading, setLoading] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCachedResult, setIsCachedResult] = useState(false);
  
  const [eduTopic, setEduTopic] = useState('');
  const [duration, setDuration] = useState('short');
  const [scriptTopic, setScriptTopic] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');

  const loadingInterval = useRef<number | null>(null);

  useEffect(() => {
      const checkKey = async () => {
          if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
              setHasApiKey(true);
          }
      };
      checkKey();
  }, []);

  useEffect(() => {
      if (loading) {
          const messages = [
              "Google Veo इंजन शुरू हो रहा है...",
              "AI वीडियो स्क्रिप्ट को रेंडर कर रहा है...",
              "आवाज और संगीत जोड़ा जा रहा है...",
              "फिनिशिंग टच जारी है..."
          ];
          let i = 0;
          setLoadingMessage(messages[0]);
          loadingInterval.current = window.setInterval(() => {
              i = (i + 1) % messages.length;
              setLoadingMessage(messages[i]);
          }, 5000);
      } else {
          if (loadingInterval.current) clearInterval(loadingInterval.current);
      }
      return () => { if (loadingInterval.current) clearInterval(loadingInterval.current); };
  }, [loading]);

  const handlePolishTopic = async () => {
    if (!scriptTopic.trim()) return;
    setIsPolishing(true);
    try {
        const prompt = `Rewrite this educational video topic to be more engaging and descriptive for a ${selectedClass} video. Topic: "${scriptTopic}". Return ONLY the improved title in Hindi.`;
        const polished = await generateText(prompt, 'gemini-3-flash-preview');
        setScriptTopic(polished);
        toast.success("AI ने विषय को बेहतर बना दिया है!");
    } catch (e) {
        toast.error("Improvement failed.");
    } finally {
        setIsPolishing(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic.trim()) {
        toast.error("कृपया विषय लिखें।");
        return;
    }
    setLoading(true);
    setLoadingMessage("AI स्क्रिप्ट लिख रहा है...");
    try {
        const prompt = `Write a professional 1-minute video script for class ${selectedClass} about: "${scriptTopic}". Language: Hinglish. Format: HTML. Include scene descriptions.`;
        const script = await generateText(prompt, 'gemini-3-pro-preview');
        setGeneratedScript(script);
        toast.success("स्क्रिप्ट तैयार है!");
        setActiveTab('script');
    } catch (e) { 
        toast.error("Failed to write script."); 
    }
    finally { setLoading(false); }
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setVideoUrl('');
    setIsCachedResult(false);

    // 1. SMART CACHE CHECK (Cost: ₹0)
    const cacheKey = `VEO_VIDEO_${scriptTopic.trim().toLowerCase()}`;
    const cachedVideo = localStorage.getItem(cacheKey);

    if (cachedVideo) {
        setTimeout(() => {
            setVideoUrl(cachedVideo);
            setLoading(false);
            setIsCachedResult(true);
            toast.success("स्मार्ट सिस्टम: यह वीडियो पहले से मौजूद था, तुरंत लोड हो गया!");
        }, 1500); 
        return;
    }

    // 2. FRESH GENERATION (Cost: ₹₹)
    try {
      const url = await generateLessonVideo(scriptTopic, duration, selectedClass);
      
      // Save to Cache for future students
      localStorage.setItem(cacheKey, url);
      
      setVideoUrl(url);
      toast.success("AI वीडियो तैयार है!");
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
          setHasApiKey(false);
          toast.error("API Key error.");
      } else {
          toast.error('वीडियो बनाने में समस्या आई।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[3.5rem] shadow-2xl h-full flex flex-col overflow-hidden relative border border-slate-100 p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6 shrink-0">
        <div className="flex items-center gap-5">
            <div className="bg-primary p-4 rounded-3xl text-white shadow-xl rotate-3">
                <VideoCameraIcon className="h-10 w-10" />
            </div>
            <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">AI Cinema</h2>
                <p className="text-sm font-hindi font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-primary animate-pulse"/> बोलें और वीडियो बनाएं
                </p>
            </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
            <button onClick={() => setActiveTab('script')} className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'script' ? 'bg-white shadow-md text-primary' : 'text-slate-500'}`}>1. SCRIPT</button>
            <button onClick={() => setActiveTab('create')} className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'create' ? 'bg-white shadow-md text-primary' : 'text-slate-500'}`}>2. RENDER</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {!hasApiKey ? (
              <div className="max-w-lg mx-auto py-10">
                  <ApiKeySelector onApiKeySelected={() => setHasApiKey(true)} />
              </div>
          ) : (
              <div className="space-y-8 animate-pop-in">
                  {activeTab === 'script' ? (
                      <div className="max-w-2xl mx-auto space-y-6">
                          <div className="space-y-2">
                              <div className="flex justify-between items-center ml-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video Topic (विषय)</label>
                                <button 
                                    onClick={handlePolishTopic} 
                                    disabled={isPolishing || !scriptTopic}
                                    className="text-[10px] font-black text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
                                >
                                    <SparklesIcon className="h-3 w-3"/> {isPolishing ? 'IMPROVING...' : 'AI IMPROVE TOPIC'}
                                </button>
                              </div>
                              <textarea 
                                value={scriptTopic} 
                                onChange={e => setScriptTopic(e.target.value)} 
                                placeholder="जैसे: पानी का चक्र कैसे काम करता है?..." 
                                className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] font-bold font-hindi h-48 focus:border-primary outline-none shadow-inner text-xl"
                              />
                          </div>
                          <button onClick={handleGenerateScript} disabled={loading} className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                              {loading ? <Loader message="" /> : <><PencilSquareIcon className="h-6 w-6 text-yellow-300"/> स्क्रिप्ट और दृश्य तैयार करें</>}
                          </button>
                          {generatedScript && (
                              <div className="p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100 shadow-inner animate-pop-in">
                                  <div className="prose prose-sm max-w-none font-hindi text-lg leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: generatedScript }} />
                                  <div className="mt-8 flex justify-center">
                                      <button onClick={() => setActiveTab('create')} className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-600 flex items-center gap-3">
                                          NEXT: RENDER VIDEO <ArrowRightIcon className="h-5 w-5"/>
                                      </button>
                                  </div>
                              </div>
                          )}
                      </div>
                  ) : (
                      <div className="max-w-2xl mx-auto space-y-8 text-center">
                          <div className="p-12 bg-primary/5 rounded-[4rem] border-4 border-dashed border-primary/20">
                              <h4 className="text-3xl font-black text-primary mb-4 uppercase">Ready to Produce</h4>
                              <p className="text-slate-500 font-hindi text-lg">AI अब आपके लिए उच्च गुणवत्ता वाला वीडियो रेंडर करेगा।</p>
                              <div className="mt-8 flex justify-center gap-4">
                                  <select value={duration} onChange={e => setDuration(e.target.value)} className="p-4 bg-white rounded-2xl border-2 border-slate-100 font-bold outline-none shadow-sm">
                                      <option value="short">Short Reel (15s)</option>
                                      <option value="lesson">Mini Lesson (1m)</option>
                                  </select>
                              </div>
                          </div>

                          <button onClick={handleGenerateVideo} disabled={loading} className="w-full py-6 bg-primary text-white font-black rounded-[2.5rem] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 text-2xl tracking-tight">
                              {loading ? <Loader message={loadingMessage} /> : <><PlayIcon className="h-8 w-8"/> रेंडर शुरू करें (Start Render)</>}
                          </button>

                          {videoUrl && (
                              <div className="mt-12 bg-slate-950 rounded-[4rem] p-6 shadow-2xl border-8 border-slate-900 animate-pop-in relative">
                                  <div className="absolute top-6 left-6 z-10 flex gap-2">
                                      {isCachedResult && (
                                          <div className="bg-green-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                                              <ArchiveBoxIcon className="h-3 w-3"/> Instant Load (Cached)
                                          </div>
                                      )}
                                  </div>
                                  
                                  <button onClick={() => setVideoUrl('')} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-20"><XCircleIcon className="h-7 w-7"/></button>
                                  <video src={videoUrl} controls className="w-full rounded-[2.5rem] aspect-video shadow-inner" autoPlay />
                                  <div className="mt-6 flex justify-between items-center px-4">
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><SparklesIcon className="h-3 w-3 text-primary"/> Generated by Google Veo</span>
                                      <a href={videoUrl} download className="bg-white/10 px-6 py-2 rounded-xl text-white font-black text-xs hover:bg-primary transition-all flex items-center gap-2">DOWNLOAD MP4 <ArrowDownTrayIcon className="h-4 w-4"/></a>
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          )}
      </div>
    </div>
  );
};

export default VideoGenerator;
