
import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSpeech, getOutputAudioContext } from '../services/geminiService';
import { useToast } from './useToast';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface UseSpeechOptions {
    initialVoice?: 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir';
    initialLanguage?: string;
    enableSpeechRecognition?: boolean;
    languageCodes?: { [key: string]: string };
}

const defaultLanguageCodes: { [key: string]: string } = {
    'English': 'en-US', 
    'Hindi': 'hi-IN', 
    'Haryanvi': 'hi-IN', // Maps to Hindi for STT
    'Bengali': 'bn-IN', 
    'Marathi': 'mr-IN',
    'Telugu': 'te-IN', 
    'Tamil': 'ta-IN', 
    'Gujarati': 'gu-IN', 
    'Urdu': 'ur-IN',
    'Kannada': 'kn-IN', 
    'Odia': 'or-IN', 
    'Malayalam': 'ml-IN', 
    'Punjabi': 'pa-IN',
    'Assamese': 'as-IN',
    'Sanskrit': 'hi-IN', // Maps to Hindi
    'Maithili': 'hi-IN', // Maps to Hindi
    'Bhojpuri': 'hi-IN', // Maps to Hindi
    'Kashmiri': 'ks-IN',
    'Nepali': 'ne-NP',
    'Konkani': 'kok-IN',
    'Sindhi': 'sd-IN',
    'Manipuri': 'mni-IN'
};

export const useSpeech = (options?: UseSpeechOptions) => {
    const {
        initialVoice = 'Puck',
        initialLanguage = 'English',
        enableSpeechRecognition = false,
        languageCodes = defaultLanguageCodes,
    } = options || {};

    const toast = useToast();
    const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir'>(initialVoice);
    const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);

    const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Speech Recognition
    const recognitionRef = useRef<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [speechInput, setSpeechInput] = useState('');

    const stopAudio = useCallback(() => {
        if (currentAudioSourceRef.current) {
            try {
                currentAudioSourceRef.current.stop();
            } catch (e) {
                // Ignore if already stopped
            }
            currentAudioSourceRef.current = null;
        }
        setPlayingMessageIndex(null);
        setIsSpeaking(false);
    }, []);

    const playAudio = useCallback(async (text: string, index: number, voice?: 'Kore' | 'Puck' | 'Zephyr' | 'Charon' | 'Fenrir', promptWrapper?: (text: string) => string) => {
        const plainText = text.replace(/<[^>]*>/g, '').trim();
        if (!plainText) return;

        if (playingMessageIndex === index) {
            stopAudio();
            return;
        }
        stopAudio();

        // 1. Check AudioContext State
        const ctx = getOutputAudioContext();
        if (ctx.state === 'suspended') {
            try { 
                await ctx.resume(); 
            } catch (e) { 
                console.error("Audio Context Resume Failed", e); 
                toast.error("ब्राउज़र ने ऑडियो रोक दिया है। कृपया पेज पर क्लिक करें। (Click page to enable audio)");
                return;
            }
        }

        setPlayingMessageIndex(index);
        setIsSpeaking(true);
        
        try {
            const newSource = await generateSpeech(plainText, voice || selectedVoice, promptWrapper);
            currentAudioSourceRef.current = newSource;
            newSource.onended = () => {
                setPlayingMessageIndex(null);
                currentAudioSourceRef.current = null;
                setIsSpeaking(false);
            };
        } catch (error: any) {
            console.error("TTS Playback Error:", error);
            
            // 2. Specific Error Feedback
            if (error.message?.includes('500') || error.status === 500) {
                toast.error("सर्वर व्यस्त है। (Server Busy - 500)");
            } else if (error.message?.includes('403') || error.message?.includes('400')) {
                toast.error("Audio API की अनुमति नहीं है। (API Key check required)");
            } else {
                toast.error("ऑडियो प्ले नहीं हो सका।");
            }
            
            setPlayingMessageIndex(null);
            setIsSpeaking(false);
        }
    }, [playingMessageIndex, selectedVoice, stopAudio, toast]);

    useEffect(() => {
        return () => stopAudio();
    }, [stopAudio]);

    useEffect(() => {
        if (!enableSpeechRecognition) return;
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = languageCodes[currentLanguage] || 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            if (event.error !== 'no-speech') console.error(`STT error: ${event.error}`);
            setIsListening(false);
        };
        
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            if (finalTranscript) setSpeechInput(finalTranscript);
        };
        
        recognitionRef.current = recognition;

    }, [enableSpeechRecognition, currentLanguage, languageCodes]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setSpeechInput('');
            try { recognitionRef.current.start(); } catch (e) { console.error(e); }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            try { recognitionRef.current.stop(); } catch (e) { console.error(e); }
        }
    }, [isListening]);

    const toggleListening = useCallback(() => {
        if (isListening) stopListening();
        else startListening();
    }, [isListening, startListening, stopListening]);

    return {
        selectedVoice,
        setSelectedVoice,
        currentLanguage,
        setCurrentLanguage,
        playAudio,
        stopAudio,
        playingMessageIndex,
        isSpeaking,
        setIsSpeaking,
        isListening,
        speechInput,
        setSpeechInput,
        startListening,
        stopListening,
        toggleListening,
    };
};
