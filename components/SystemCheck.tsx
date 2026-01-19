
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircleIcon, XCircleIcon, ShieldCheckIcon, CameraIcon, MicrophoneIcon, SignalIcon, WrenchScrewdriverIcon, SpeakerWaveIcon, ExclamationTriangleIcon, XIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const SystemCheck: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [checks, setChecks] = useState({
        internet: false,
        hasCameraDevice: false,
        hasMicDevice: false,
        hasSpeakerDevice: false,
        permissionGranted: false
    });
    const [loading, setLoading] = useState(true);
    const [showSkip, setShowSkip] = useState(false);
    const toast = useToast();
    const hasSpokenRef = useRef(false);

    // Force show skip button after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowSkip(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    // Text-to-Speech Function (Voice Alert)
    const speakWarning = (message: string) => {
        if (hasSpokenRef.current) return; 
        
        try {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'hi-IN'; 
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
            hasSpokenRef.current = true;
        } catch (e) {
            console.warn("TTS not supported");
        }
    };

    const runDiagnostics = async () => {
        setLoading(true);
        const newChecks = { ...checks };

        newChecks.internet = navigator.onLine;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(device => device.kind === 'videoinput');
            const mics = devices.filter(device => device.kind === 'audioinput');
            
            newChecks.hasCameraDevice = cameras.length > 0;
            newChecks.hasMicDevice = mics.length > 0;
            newChecks.hasSpeakerDevice = true; // Assumed true

            let warningMsg = "";
            if (!newChecks.hasMicDevice) warningMsg += "माइक नहीं मिला। ";
            if (!newChecks.hasCameraDevice) warningMsg += "कैमरा नहीं मिला। ";
            
            if (warningMsg) speakWarning(warningMsg);

        } catch (e) {
            console.error("Hardware enumeration failed", e);
        }

        if (newChecks.hasCameraDevice && newChecks.hasMicDevice) {
            try {
                // Short timeout for permissions check
                const streamPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
                
                await Promise.race([streamPromise, timeoutPromise])
                    .then((stream: any) => {
                        newChecks.permissionGranted = true;
                        stream.getTracks().forEach((track: any) => track.stop());
                    })
                    .catch(() => {
                        newChecks.permissionGranted = false;
                    });
            } catch (err) {
                newChecks.permissionGranted = false;
            }
        } else {
            newChecks.permissionGranted = false; 
        }

        setChecks(newChecks);
        setLoading(false);

        if (newChecks.internet && newChecks.hasCameraDevice && newChecks.hasMicDevice && newChecks.permissionGranted) {
            setTimeout(() => setIsOpen(false), 1000);
        }
    };

    useEffect(() => {
        runDiagnostics();
        const handleOnline = () => setChecks(prev => ({ ...prev, internet: true }));
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);

    const requestPermissions = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            runDiagnostics();
            toast.success("System Optimized!");
        } catch (e) {
            toast.error("Permission denied. You can still use the app.");
            setIsOpen(false);
        }
    };

    if (!isOpen) return null;

    if (!loading && checks.internet && checks.hasCameraDevice && checks.hasMicDevice && checks.permissionGranted) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white/20 relative">
                {showSkip && (
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-50 transition-colors"
                        title="Skip Check"
                    >
                        <XIcon className="h-6 w-6 text-slate-400 hover:text-red-500" />
                    </button>
                )}

                <div className="p-6 bg-slate-950 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 bg-primary/20 rounded-full blur-xl"></div>
                    <WrenchScrewdriverIcon className="h-10 w-10 mx-auto text-primary mb-3 animate-bounce-slow"/>
                    <h3 className="text-xl font-black uppercase tracking-tight">System Health Check</h3>
                    <p className="text-xs text-slate-400 font-hindi mt-1">हार्डवेयर की जांच हो रही है...</p>
                </div>

                <div className="p-6 space-y-4">
                    
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <SignalIcon className={`h-5 w-5 ${checks.internet ? 'text-green-500' : 'text-red-500'}`}/>
                            <span className="font-bold text-slate-700 text-sm">Internet</span>
                        </div>
                        {checks.internet ? <CheckCircleIcon className="h-5 w-5 text-green-500"/> : <span className="text-xs font-black text-red-500">OFFLINE</span>}
                    </div>

                    <div className={`flex items-center justify-between p-3 rounded-2xl border ${!checks.hasCameraDevice ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                            <CameraIcon className={`h-5 w-5 ${checks.hasCameraDevice ? 'text-green-500' : 'text-red-500'}`}/>
                            <div>
                                <span className="font-bold text-slate-700 text-sm block">Camera</span>
                            </div>
                        </div>
                        {checks.hasCameraDevice ? <CheckCircleIcon className="h-5 w-5 text-green-500"/> : <ExclamationTriangleIcon className="h-5 w-5 text-red-500"/>}
                    </div>

                    <div className={`flex items-center justify-between p-3 rounded-2xl border ${!checks.hasMicDevice ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                            <MicrophoneIcon className={`h-5 w-5 ${checks.hasMicDevice ? 'text-green-500' : 'text-red-500'}`}/>
                            <div>
                                <span className="font-bold text-slate-700 text-sm block">Microphone</span>
                            </div>
                        </div>
                        {checks.hasMicDevice ? <CheckCircleIcon className="h-5 w-5 text-green-500"/> : <ExclamationTriangleIcon className="h-5 w-5 text-red-500"/>}
                    </div>

                    {checks.hasCameraDevice && checks.hasMicDevice && (
                         <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <ShieldCheckIcon className={`h-5 w-5 ${checks.permissionGranted ? 'text-green-500' : 'text-orange-500'}`}/>
                                <span className="font-bold text-slate-700 text-sm">Permission</span>
                            </div>
                            {checks.permissionGranted ? <span className="text-xs font-bold text-green-600">ALLOWED</span> : <span className="text-xs font-bold text-orange-600">REQUIRED</span>}
                        </div>
                    )}

                    <div className="text-center pt-2">
                        {(!checks.hasCameraDevice || !checks.hasMicDevice) && (
                            <div className="space-y-3">
                                <p className="text-xs text-red-500 font-bold font-hindi animate-pulse">
                                    कुछ हार्डवेयर नहीं मिले।
                                </p>
                                <button onClick={() => setIsOpen(false)} className="w-full py-3 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 transition-all text-xs uppercase tracking-widest">
                                    Continue Anyway
                                </button>
                            </div>
                        )}

                        {(checks.hasCameraDevice && checks.hasMicDevice && !checks.permissionGranted) && (
                             <div className="space-y-3">
                                <button 
                                    onClick={requestPermissions}
                                    className="w-full py-4 bg-primary text-slate-950 font-black rounded-2xl shadow-xl hover:bg-white transition-all flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <ShieldCheckIcon className="h-5 w-5"/>
                                    ALLOW ACCESS (अनुमति दें)
                                </button>
                                {showSkip && (
                                    <button onClick={() => setIsOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 underline">
                                        Skip Check
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemCheck;
