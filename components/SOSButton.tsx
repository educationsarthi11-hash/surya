
import React, { useState, useEffect, useRef } from 'react';
import { ExclamationTriangleIcon, MapPinIcon, PhoneIcon, XIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const SOSButton: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [isAlertSent, setIsAlertSent] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const timerRef = useRef<number | null>(null);
    const toast = useToast();

    const handleTrigger = () => {
        setIsActive(true);
        setCountdown(5);
        setIsAlertSent(false);

        // Start Countdown
        timerRef.current = window.setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    sendAlert();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Get Location immediately
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.error("Location error: ", error),
                { enableHighAccuracy: true }
            );
        }
    };

    const sendAlert = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsAlertSent(true);
        
        // Simulate API Call
        console.log("--- SOS ALERT TRIGGERED ---");
        console.log("Location:", location || "Fetching...");
        console.log("Notifying: Parents, Class Teacher, School Security, Principal");
        
        toast.error("SOS SENT! Authorities have been notified with your Live Location.");
        
        // Simulate Siren Sound (Visual feedback is handled by UI)
    };

    const cancelSOS = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsActive(false);
        setIsAlertSent(false);
        setCountdown(5);
        toast.info("SOS Cancelled.");
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                onClick={handleTrigger}
                className="fixed bottom-24 left-6 z-40 group flex items-center justify-center w-14 h-14 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-110 transition-transform active:scale-95 animate-pulse-slow border-4 border-white"
                title="SOS Emergency"
            >
                <ExclamationTriangleIcon className="h-8 w-8 text-white group-hover:animate-ping" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    SOS (आपातकालीन)
                </span>
            </button>

            {/* Full Screen Alert Overlay */}
            {isActive && (
                <div className="fixed inset-0 z-[100] bg-red-600/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 animate-pop-in">
                    
                    {!isAlertSent ? (
                        <>
                            <div className="w-32 h-32 rounded-full border-8 border-white flex items-center justify-center mb-8 relative">
                                <span className="text-6xl font-black">{countdown}</span>
                                <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping"></div>
                            </div>
                            <h2 className="text-4xl font-black mb-4 text-center uppercase tracking-widest">Emergency Alert</h2>
                            <p className="text-lg mb-12 text-center max-w-md font-semibold">
                                Sending live location and distress signal to Parents & Security in {countdown} seconds...
                            </p>
                            <button 
                                onClick={cancelSOS}
                                className="px-10 py-4 bg-white text-red-600 text-xl font-bold rounded-full shadow-2xl hover:bg-red-50 transition-transform hover:scale-105 flex items-center gap-3"
                            >
                                <XIcon className="h-6 w-6" /> I AM SAFE (CANCEL)
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-8 animate-bounce">
                                <ExclamationTriangleIcon className="h-32 w-32 text-white drop-shadow-lg" />
                            </div>
                            <h2 className="text-5xl font-black mb-6 text-center uppercase tracking-widest drop-shadow-md">HELP IS ON THE WAY!</h2>
                            
                            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 max-w-md w-full backdrop-blur-sm space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500 rounded-full"><CheckCircleIcon className="h-6 w-6"/></div>
                                    <div>
                                        <p className="font-bold text-lg">Alert Sent</p>
                                        <p className="text-sm opacity-80">Principal & Parents notified</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500 rounded-full"><MapPinIcon className="h-6 w-6"/></div>
                                    <div>
                                        <p className="font-bold text-lg">Location Shared</p>
                                        <p className="text-sm opacity-80">{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Acquiring GPS..."}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500 rounded-full animate-pulse"><PhoneIcon className="h-6 w-6"/></div>
                                    <div>
                                        <p className="font-bold text-lg">Calling Security...</p>
                                        <p className="text-sm opacity-80">Connecting priority line</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={cancelSOS}
                                className="mt-12 text-sm font-semibold underline hover:text-red-200 opacity-80"
                            >
                                Close Alert Screen
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

// Simple Icon wrapper for internal use if not exported
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default SOSButton;
