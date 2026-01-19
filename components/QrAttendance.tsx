
import React, { useState, useEffect, useRef } from 'react';
import { CameraIcon, QrCodeIcon, CheckCircleIcon, ArrowLeftIcon, ExclamationTriangleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { studentService } from '../services/studentService';
import { syncService } from '../services/syncService';

const QrAttendance: React.FC = () => {
    const toast = useToast();
    const [isScanning, setIsScanning] = useState(false);
    const [lastScanned, setLastScanned] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const handleStatus = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', handleStatus);
        window.addEventListener('offline', handleStatus);
        return () => {
            window.removeEventListener('online', handleStatus);
            window.removeEventListener('offline', handleStatus);
        };
    }, []);

    const startScanner = async () => {
        setIsScanning(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (e) {
            toast.error("Camera error!");
            setIsScanning(false);
        }
    };

    const handleMockScan = () => {
        // असली ऐप में यहाँ QR लाइब्रेरी यूज़ होगी
        const students = studentService.getStudents();
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        
        syncService.addToQueue('qr_attendance', { studentId: randomStudent.id, timestamp: new Date().toISOString() });
        setLastScanned(randomStudent.name);
        toast.success(isOnline ? `${randomStudent.name} - प्रेजेंट!` : `${randomStudent.name} - ऑफलाइन सेव्ड!`);
        
        setTimeout(() => setLastScanned(null), 2000);
    };

    return (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 animate-pop-in min-h-[500px] flex flex-col items-center justify-center">
            <div className="text-center mb-8">
                <QrCodeIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-800 uppercase">Offline QR Attendance</h3>
                <p className="text-sm text-slate-400 font-hindi mt-1">इंटरनेट न होने पर भी छात्र के कार्ड से हाजिरी लगाएं</p>
            </div>

            {!isScanning ? (
                <button onClick={startScanner} className="px-12 py-6 bg-primary text-white font-black rounded-3xl shadow-xl hover:scale-105 transition-all flex items-center gap-4 text-xl">
                    <CameraIcon className="h-8 w-8"/> स्कैनर शुरू करें
                </button>
            ) : (
                <div className="w-full max-w-sm space-y-6">
                    <div className="relative aspect-square bg-slate-900 rounded-3xl overflow-hidden border-8 border-slate-100 shadow-2xl">
                         <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
                         <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-48 h-48 border-4 border-primary rounded-3xl animate-pulse flex items-center justify-center">
                                 {lastScanned && (
                                     <div className="bg-white p-4 rounded-2xl shadow-2xl animate-pop-in text-center">
                                         <CheckCircleIcon className="h-10 w-10 text-green-500 mx-auto"/>
                                         <p className="font-black text-slate-800 mt-2">{lastScanned}</p>
                                     </div>
                                 )}
                             </div>
                         </div>
                    </div>
                    <button onClick={handleMockScan} className="w-full py-4 bg-slate-100 text-slate-800 font-bold rounded-2xl border-2 border-slate-200">सिमुलेट स्कैन (Simulate Scan)</button>
                    <button onClick={() => setIsScanning(false)} className="w-full text-slate-400 font-bold">बंद करें</button>
                </div>
            )}

            {!isOnline && (
                <div className="mt-10 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    <p className="text-xs font-bold font-hindi">आप अभी ऑफलाइन हैं। डाटा सिंक सेंटर में सुरक्षित रहेगा।</p>
                </div>
            )}
        </div>
    );
};

export default QrAttendance;
