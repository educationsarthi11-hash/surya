
import React, { useState, useRef, useEffect } from 'react';
import { 
    CameraIcon, SparklesIcon, XIcon, FaceSmileIcon, 
    ArrowPathIcon, CheckCircleIcon, UserPlusIcon, 
    QrCodeIcon, MagnifyingGlassIcon, ExclamationTriangleIcon 
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { studentService } from '../services/studentService';
import { StudentData, AttendanceRecord, ServiceName } from '../types';
import { attendanceService } from '../services/attendanceService';

const FaceAttendance: React.FC<{ setActiveService: (s: ServiceName) => void }> = ({ setActiveService }) => {
    const toast = useToast();
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null);
    const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(attendanceService.getAttendanceList());
    const [allStudents, setAllStudents] = useState<StudentData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [recognitionFailed, setRecognitionFailed] = useState(false);
    const [identifiedStudent, setIdentifiedStudent] = useState<StudentData | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setAllStudents(studentService.getStudents());
        const unsubscribe = attendanceService.subscribe(() => {
            setAttendanceList(attendanceService.getAttendanceList());
        });
        return () => unsubscribe();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOpen(true);
            setRecognitionFailed(false);
            setIdentifiedStudent(null);
        } catch (err) {
            toast.error("कैमरा एक्सेस नहीं मिला।");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const captureFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (!context) return;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                if (blob) {
                    const imgUrl = URL.createObjectURL(blob);
                    setCapturedImageSrc(imgUrl);
                    stopCamera();
                    simulateRecognition();
                }
            }, 'image/jpeg');
        }
    };

    const simulateRecognition = () => {
        setLoading(true);
        // AI Simulation: 70% success, 30% failure to test fallback
        setTimeout(() => {
            setLoading(false);
            const success = Math.random() > 0.3; 
            if (success && allStudents.length > 0) {
                const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];
                setIdentifiedStudent(randomStudent);
                setRecognitionFailed(false);
            } else {
                setIdentifiedStudent(null);
                setRecognitionFailed(true);
                toast.warning("AI चेहरे को नहीं पहचान पाया। बैकअप विकल्प का उपयोग करें।");
            }
        }, 2000);
    };

    const handleMarkPresent = (student: StudentData) => {
        const img = capturedImageSrc || 'https://api.dicebear.com/7.x/notionists/svg?seed=' + student.name;
        attendanceService.markPresent(student, img);
        toast.success(`${student.name} की हाजिरी लग गई!`);
        resetScan();
    };

    const resetScan = () => {
        setCapturedImageSrc(null);
        setIsCameraOpen(false);
        setIdentifiedStudent(null);
        setRecognitionFailed(false);
    };

    return (
        <div className="bg-white p-2 sm:p-8 rounded-[3.5rem] shadow-soft h-full flex flex-col min-h-[800px] border border-slate-100 animate-pop-in">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-slate-900 p-4 rounded-3xl text-primary shadow-xl rotate-3">
                        <CameraIcon className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">AI Attendance</h2>
                        <p className="text-sm font-hindi font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                            <SparklesIcon className="h-4 w-4 text-primary animate-pulse"/> स्मार्ट हाजिरी सिस्टम
                        </p>
                    </div>
                </div>
                
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button onClick={() => setActiveService('QR Attendance')} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white hover:shadow-md transition-all flex items-center gap-2">
                        <QrCodeIcon className="h-4 w-4"/> Switch to QR
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1 overflow-hidden">
                {/* Visual Scanner Area */}
                <div className="flex flex-col h-full">
                    <div className="relative flex-1 min-h-[450px] bg-slate-900 rounded-[4rem] overflow-hidden border-8 border-slate-50 shadow-inner flex items-center justify-center">
                        {isCameraOpen && (
                            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-80" />
                        )}

                        {capturedImageSrc && (
                            <img src={capturedImageSrc} className="absolute inset-0 w-full h-full object-cover animate-pop-in" alt="Captured" />
                        )}

                        {!isCameraOpen && !capturedImageSrc && (
                            <div className="text-center space-y-6 animate-fade-in relative z-10">
                                <div className="p-8 bg-white/10 rounded-full backdrop-blur-xl border border-white/10">
                                    <CameraIcon className="h-16 w-16 text-white/40" />
                                </div>
                                <button onClick={startCamera} className="px-10 py-4 bg-primary text-slate-900 font-black rounded-2xl shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-sm">Open Camera</button>
                            </div>
                        )}

                        {isCameraOpen && (
                             <button onClick={captureFrame} className="absolute bottom-10 p-8 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all border-8 border-slate-900/50 z-30">
                                <div className="w-10 h-10 bg-primary rounded-full"></div>
                             </button>
                        )}

                        {loading && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-40">
                                <Loader message="AI पहचान कर रहा है..." />
                            </div>
                        )}

                        {/* Recognition Success Overlay */}
                        {identifiedStudent && (
                            <div className="absolute inset-0 bg-green-600/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center animate-pop-in z-50">
                                <div className="w-32 h-32 bg-white rounded-[2.5rem] p-1 shadow-2xl mb-6 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${identifiedStudent.name}`} className="w-full h-full" alt="Student"/>
                                </div>
                                <h3 className="text-white text-4xl font-black uppercase tracking-tighter">{identifiedStudent.name}</h3>
                                <p className="text-green-100 font-hindi text-xl mt-2 font-bold">{identifiedStudent.className}</p>
                                <button onClick={() => handleMarkPresent(identifiedStudent)} className="mt-10 px-12 py-5 bg-white text-green-700 font-black rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm">Confirm Attendance</button>
                                <button onClick={resetScan} className="mt-4 text-white/60 font-bold uppercase text-xs hover:text-white">Not correct? Try Again</button>
                            </div>
                        )}

                        {/* Recognition Failure Overlay (FALLBACK) */}
                        {recognitionFailed && (
                            <div className="absolute inset-0 bg-red-600/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center animate-pop-in z-50">
                                <ExclamationTriangleIcon className="h-24 w-24 text-white mb-6 animate-pulse" />
                                <h3 className="text-white text-4xl font-black uppercase tracking-tighter">पहचान नहीं पाए</h3>
                                <p className="text-red-100 font-hindi text-xl mt-2 font-bold max-w-sm">घबराएं नहीं! आप लिस्ट में से नाम चुन सकते हैं या QR स्कैन कर सकते हैं।</p>
                                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                    <button onClick={resetScan} className="px-8 py-4 bg-white text-red-700 font-black rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-xs">Retry Camera</button>
                                    <button onClick={() => setActiveService('QR Attendance')} className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest text-xs">Use QR Code</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Manual List & Search (Always available fallback) */}
                <div className="flex flex-col h-full bg-slate-50/50 rounded-[4rem] border-2 border-slate-100 p-8 shadow-inner overflow-hidden">
                    <div className="relative mb-8 shrink-0">
                         <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                         <input 
                            type="text" 
                            placeholder="सर्च करें (नाम या रोल नंबर)..." 
                            className="w-full pl-12 pr-6 py-5 bg-white border-2 border-transparent focus:border-primary rounded-[2rem] font-bold font-hindi shadow-xl transition-all outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                         />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4 mb-2">छात्रों की सूची (Manual Fallback)</p>
                        {allStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(student => {
                            const isPresent = attendanceList.some(r => r.studentId === student.id);
                            return (
                                <div key={student.id} className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-between ${isPresent ? 'bg-green-50 border-green-200 opacity-60' : 'bg-white border-white hover:border-primary/30 shadow-sm hover:shadow-xl'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`} alt="Student Avatar" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 uppercase tracking-tight text-sm">{student.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.className}</p>
                                        </div>
                                    </div>
                                    {isPresent ? (
                                        <div className="bg-green-100 text-green-700 p-2 rounded-xl"><CheckCircleIcon className="h-6 w-6"/></div>
                                    ) : (
                                        <button onClick={() => handleMarkPresent(student)} className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-primary transition-all shadow-md">PRESENT</button>
                                    )}
                                </div>
                            );
                        })}
                        {allStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                            <div className="text-center py-10 opacity-30 font-hindi font-bold">कोई छात्र नहीं मिला।</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaceAttendance;
