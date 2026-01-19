
import React, { useState, useEffect } from 'react';
import ApiKeySelector from './ApiKeySelector';
import Loader from './Loader';
import { generateMarketingVideo } from '../services/geminiService';
import { FilmIcon, SignalIcon, MicrophoneIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useSpeech } from '../hooks/useSpeech';

const SocialMediaVideoGenerator: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Marketing Video State
  const [markTopic, setMarkTopic] = useState('');
  const [audience, setAudience] = useState('Students');
  const [message, setMessage] = useState('');
  const [format, setFormat] = useState<'portrait' | 'landscape'>('portrait');

  // Speech Recognition State
  const { speechInput, setSpeechInput, isListening, toggleListening } = useSpeech({ enableSpeechRecognition: true });
  const [activeSpeechInput, setActiveSpeechInput] = useState<string | null>(null);

  useEffect(() => {
    if (speechInput && !isListening && activeSpeechInput) {
        switch (activeSpeechInput) {
            case 'markTopic':
                setMarkTopic(speechInput);
                break;
            case 'audience':
                setAudience(speechInput);
                break;
            case 'message':
                setMessage(speechInput);
                break;
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
    setLoading(true);
    setVideoUrl('');
    try {
      if (!markTopic.trim() || !message.trim()) {
        toast.error('Please fill in the Promotion Topic and Key Message for the ad.');
        setLoading(false);
        return;
      }
      const url = await generateMarketingVideo(markTopic, audience, message, format);
      setVideoUrl(url);
      toast.success('Video generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate video. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatOptions = [
      { id: 'portrait', label: 'Portrait (9:16)', description: 'For Reels, Shorts, TikTok' },
      { id: 'landscape', label: 'Landscape (16:9)', description: 'For YouTube, Websites' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-4">
        <SignalIcon aria-hidden="true" className="h-8 w-8 text-primary" />
        <h2 className="ml-3 text-2xl font-bold text-neutral-900">Social Media Ad Generator</h2>
      </div>
      <p className="text-sm text-neutral-600 mb-6 font-hindi">सोशल मीडिया के लिए आकर्षक वीडियो विज्ञापन बनाएं।</p>

      {!hasApiKey ? (
        <ApiKeySelector onApiKeySelected={() => setHasApiKey(true)} />
      ) : (
        <div className="space-y-6">
          <div className="space-y-4 animate-pop-in">
            <div>
              <label htmlFor="promo-topic-social" className="block text-sm font-medium text-neutral-700">Promotion Topic</label>
              <div className="relative mt-1">
                  <input type="text" id="promo-topic-social" value={markTopic} onChange={(e) => setMarkTopic(e.target.value)} placeholder="e.g., New Robotics Club" className="block w-full rounded-md border-neutral-300 shadow-sm p-2 pr-10" />
                  <button type="button" onClick={() => handleMicClick('markTopic')} className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isListening && activeSpeechInput === 'markTopic' ? 'text-red-500 animate-pulse' : 'text-neutral-500'}`}>
                      <MicrophoneIcon className="h-5 w-5"/>
                  </button>
              </div>
            </div>
            <div>
              <label htmlFor="audience-social" className="block text-sm font-medium text-neutral-700">Target Audience</label>
               <div className="relative mt-1">
                  <input type="text" id="audience-social" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Students, Parents" className="block w-full rounded-md border-neutral-300 shadow-sm p-2 pr-10" />
                  <button type="button" onClick={() => handleMicClick('audience')} className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isListening && activeSpeechInput === 'audience' ? 'text-red-500 animate-pulse' : 'text-neutral-500'}`}>
                      <MicrophoneIcon className="h-5 w-5"/>
                  </button>
              </div>
            </div>
            <div>
              <label htmlFor="message-social" className="block text-sm font-medium text-neutral-700">Key Message / Call to Action</label>
              <div className="relative mt-1">
                  <textarea id="message-social" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g., Join now and build the future! Link in bio." rows={2} className="block w-full rounded-md border-neutral-300 shadow-sm p-2 pr-10" />
                  <button type="button" onClick={() => handleMicClick('message')} className={`absolute top-2 right-0 flex items-center pr-3 ${isListening && activeSpeechInput === 'message' ? 'text-red-500 animate-pulse' : 'text-neutral-500'}`}>
                      <MicrophoneIcon className="h-5 w-5"/>
                  </button>
              </div>
            </div>
            <fieldset>
              <legend className="block text-sm font-medium text-neutral-700 mb-2">Video Format</legend>
              <div className="grid grid-cols-2 gap-4">
                {formatOptions.map(option => (
                  <div key={option.id}>
                    <input type="radio" id={`format-social-${option.id}`} name="video-format-social" value={option.id} checked={format === option.id} onChange={() => setFormat(option.id as 'portrait' | 'landscape')} className="sr-only peer" />
                    <label htmlFor={`format-social-${option.id}`} className="p-3 rounded-lg text-sm flex flex-col items-center justify-center border-2 cursor-pointer transition-colors bg-white hover:bg-neutral-50 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                      <FilmIcon aria-hidden="true" className="h-6 w-6 mb-1" /> {option.label}
                      <span className="text-xs text-neutral-500">{option.description}</span>
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
          
          <button onClick={handleGenerate} disabled={loading} className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-neutral-400">
            {loading ? 'Generating...' : 'Generate Marketing Ad'}
          </button>
          
          {loading && (
             <div className="text-center p-4">
                 <Loader message="AI is creating your video. This may take several minutes. Please be patient." />
            </div>
          )}

          {videoUrl && (
            <div className="mt-4">
              <video controls src={videoUrl} className="w-full rounded-lg shadow-md" title="Generated marketing video" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialMediaVideoGenerator;
