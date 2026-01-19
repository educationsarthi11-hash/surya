
import React, { useState } from 'react';
import { 
    CalendarDaysIcon, ClockIcon, UserGroupIcon, 
    VideoCameraIcon, UserCircleIcon, CheckCircleIcon, 
    SparklesIcon, XIcon, ArrowLeftIcon 
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { generateText } from '../services/geminiService';
import Loader from './Loader';
import { User, UserRole, ServiceName } from '../types';

interface Slot {
    id: string;
    time: string;
    status: 'Available' | 'Booked';
    parentName?: string;
    studentName?: string;
    mode: 'Online' | 'Offline';
    meetingLink?: string;
}

const initialSlots: Slot[] = [
    { id: '1', time: '09:00 AM - 09:15 AM', status: 'Available', mode: 'Offline' },
    { id: '2', time: '09:30 AM - 09:45 AM', status: 'Booked', parentName: 'Mr. Sharma', studentName: 'Aarav', mode: 'Online', meetingLink: 'meet.google.com/abc-def-ghi' },
    { id: '3', time: '10:00 AM - 10:15 AM', status: 'Available', mode: 'Online' },
    { id: '4', time: '02:00 PM - 02:15 PM', status: 'Available', mode: 'Offline' },
    { id: '5', time: '03:00 PM - 03:15 PM', status: 'Available', mode: 'Online' },
];

const SmartPTM: React.FC<{ user: User; setActiveService?: (s: ServiceName | 'overview') => void }> = ({ user, setActiveService }) => {
    const toast = useToast();
    const [slots, setSlots] = useState<Slot[]>(initialSlots);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loading, setLoading] = useState(false);
    const [aiPrep, setAiPrep] = useState('');

    const isTeacher = user.role === UserRole.Teacher || user.role === UserRole.Admin;

    const handleBookSlot = (slot: Slot) => {
        if (slot.status === 'Booked') {
            toast.info("यह स्लॉट पहले से बुक है (Slot Already Booked)");
            return;
        }
        
        // Update slot status
        setSlots(slots.map(s => s.id === slot.id ? { 
            ...s, 
            status: 'Booked', 
            parentName: user.name, 
            studentName: 'Student', 
            mode: s.mode,
            meetingLink: s.mode === 'Online' ? `meet.google.com/ptm-${Math.floor(Math.random()*1000)}` : undefined
        } : s));
        
        toast.success(`मीटिंग कन्फर्म! समय: ${slot.time} (${slot.mode})`);
    };

    const generateMeetingNotes = async (slot: Slot) => {
        if (!slot.studentName) return;
        setLoading(true);
        try {
            const prompt = `
                Act as a Senior Teacher Assistant. Prepare a short, polite PTM agenda for student "${slot.studentName}".
                
                Mock Data:
                - Attendance: 92%
                - Recent Marks: Maths (Improved), English (Needs focus).
                - Behavior: Very creative but talks in class.
                
                Task: Write 3 key talking points for the teacher in Hindi.
                Format as HTML list <ul>.
            `;
            const result = await generateText(prompt, 'gemini-3-flash-preview');
            setAiPrep(result);
            setSelectedSlot(slot);
        } catch (e) {
            toast.error("AI नोट्स नहीं बना सका।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-[3rem] shadow-soft h-full min-h-[600px] flex flex-col border border-slate-100 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="bg-pink-100 p-3 rounded-2xl text-pink-600 shadow-sm">
                        <UserGroupIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Smart PTM</h2>
                        <p className="text-sm text-slate-500 font-hindi font-bold">अभिभावक-शिक्षक बैठक (Meeting Scheduler)</p>
                    </div>
                </div>
                
                {setActiveService && (
                    <button onClick={() => setActiveService('overview')} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                        <ArrowLeftIcon className="h-6 w-6 text-slate-400"/>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
                {/* Left: Slot Booking */}
                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <CalendarDaysIcon className="h-5 w-5 text-slate-500"/> 
                            {isTeacher ? "Today's Schedule" : "Select a Time Slot"}
                        </h3>
                        <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full">LIVE</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {slots.map(slot => (
                            <div 
                                key={slot.id} 
                                className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center group ${slot.status === 'Booked' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 hover:border-pink-200 cursor-pointer hover:shadow-md'}`}
                                onClick={() => !isTeacher && handleBookSlot(slot)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${slot.status === 'Booked' ? 'bg-slate-200 text-slate-500' : 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors'}`}>
                                        <ClockIcon className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-lg">{slot.time}</p>
                                        <p className="text-xs text-slate-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                                            {slot.mode === 'Online' ? <VideoCameraIcon className="h-3 w-3"/> : <UserCircleIcon className="h-3 w-3"/>}
                                            {slot.mode}
                                        </p>
                                        {slot.meetingLink && (
                                            <p className="text-[10px] text-blue-500 font-mono mt-1 bg-blue-50 px-2 py-0.5 rounded w-fit">{slot.meetingLink}</p>
                                        )}
                                    </div>
                                </div>

                                {slot.status === 'Booked' ? (
                                    <div className="text-right">
                                        <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-3 py-1 rounded-full uppercase tracking-widest">Booked</span>
                                        {isTeacher && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); generateMeetingNotes(slot); }}
                                                className="block mt-2 text-[10px] text-pink-600 font-black hover:underline uppercase tracking-wide"
                                            >
                                                AI Prep Notes
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    !isTeacher && <span className="text-xs font-black text-white bg-pink-500 px-4 py-2 rounded-xl shadow-lg shadow-pink-200 group-hover:scale-105 transition-transform">BOOK</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: AI Insights (For Teacher) or Info (For Parent) */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-center border-4 border-slate-800 shadow-2xl">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-32 bg-pink-600/20 rounded-full blur-[80px] -mr-10 -mt-10 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 p-24 bg-indigo-600/20 rounded-full blur-[80px] -ml-10 -mb-10"></div>
                    
                    {selectedSlot && aiPrep ? (
                        <div className="relative z-10 animate-pop-in h-full flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em] mb-2">Meeting Prep</p>
                                    <h3 className="text-3xl font-black">{selectedSlot.studentName}</h3>
                                    <p className="text-sm opacity-60">Parent: {selectedSlot.parentName}</p>
                                </div>
                                <button onClick={() => setSelectedSlot(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><XIcon className="h-6 w-6"/></button>
                            </div>
                            
                            <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md flex-1 overflow-y-auto custom-scrollbar">
                                <h4 className="font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-wider text-pink-200"><SparklesIcon className="h-4 w-4"/> AI Suggestions</h4>
                                <div className="prose prose-invert prose-sm font-hindi leading-relaxed" dangerouslySetInnerHTML={{ __html: aiPrep }} />
                            </div>

                            <button className="w-full mt-6 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95">
                                <VideoCameraIcon className="h-4 w-4"/> Start Video Meeting
                            </button>
                        </div>
                    ) : (
                        <div className="text-center relative z-10 opacity-40 p-6">
                            {isTeacher ? (
                                <>
                                    <SparklesIcon className="h-24 w-24 mx-auto mb-6 text-pink-300 animate-pulse"/>
                                    <h3 className="text-3xl font-black uppercase tracking-widest mb-2">AI Meeting Assistant</h3>
                                    <p className="font-hindi text-lg">किसी भी 'Booked' स्लॉट पर क्लिक करें और AI आपको मीटिंग के लिए तैयार करेगा।</p>
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="h-24 w-24 mx-auto mb-6 text-green-400"/>
                                    <h3 className="text-3xl font-black uppercase tracking-widest mb-2">Book Your Slot</h3>
                                    <p className="font-hindi text-lg">टीचर से मिलने का समय चुनें। आप ऑनलाइन (Video Call) या स्कूल आकर मिल सकते हैं।</p>
                                </>
                            )}
                        </div>
                    )}
                    
                    {loading && (
                        <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20 backdrop-blur-sm">
                            <Loader message="AI बच्चे का रिकॉर्ड देख रहा है..." />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartPTM;
