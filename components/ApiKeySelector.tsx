
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../hooks/useToast';
import { KeyIcon, SparklesIcon, GlobeAltIcon } from './icons/AllIcons';

interface ApiKeySelectorProps {
  onApiKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onApiKeySelected }) => {
  const [checking, setChecking] = useState(true);
  const toast = useToast();

  const checkApiKey = useCallback(async () => {
    try {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        onApiKeySelected();
      }
    } catch (e) {
      console.error("Error checking for API key:", e);
    } finally {
      setChecking(false);
    }
  }, [onApiKeySelected]);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Rule: Assume success to mitigate race conditions
      toast.success("AI Key linked! Preparing Video Engine...");
      onApiKeySelected();
    } catch (e) {
      console.error("Could not open API key selection:", e);
      toast.error("Could not open selection dialog.");
    }
  };

  if (checking) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Checking AI Credentials...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-10 rounded-[3rem] text-white border-4 border-slate-800 shadow-2xl animate-pop-in">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-inner">
          <KeyIcon className="h-10 w-10" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">AI Video Key Required</h3>
          <p className="text-slate-400 font-hindi mt-2 text-lg">वीडियो जनरेशन एक प्रीमियम सर्विस है। <br/> कृपया अपनी 'Paid API Key' सिलेक्ट करें।</p>
        </div>
        
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left w-full max-w-sm">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                <SparklesIcon className="h-3 w-3"/> Why this is needed?
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
                Google Veo (Video generation) is a billable service. For pricing details, please visit 
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">billing docs</a>.
            </p>
        </div>

        <button
          onClick={handleSelectKey}
          className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest text-sm"
        >
          Select My API Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeySelector;
