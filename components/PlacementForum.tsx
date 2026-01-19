
import React, { useState, useEffect } from 'react';
import { User, UserRole, JobOpening } from '../types';
import { placementService } from '../services/placementService';
import { 
    BriefcaseIcon, PlusIcon, SparklesIcon, 
    ArrowRightIcon, ShieldCheckIcon, MapPinIcon,
    PaperAirplaneIcon, XCircleIcon, CurrencyRupeeIcon,
    DocumentTextIcon, BellIcon, StarIcon, HeartIcon
} from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { notificationService } from '../services/notificationService';
import Loader from './Loader';

const TalentCategories = [
    { id: 'dance', name: 'Dance & Arts', icon: <StarIcon className="h-4 w-4"/> },
    { id: 'tech', name: 'Technical / ITI', icon: <BriefcaseIcon className="h-4 w-4"/> },
    { id: 'admin', name: 'Staff / Admin', icon: <DocumentTextIcon className="h-4 w-4"/> },
    { id: 'sports', name: 'Sports Coach', icon: <HeartIcon className="h-4 w-4"/> }
];

const PlacementForum: React.FC<{ user: User }> = ({ user }) => {
    const toast = useToast();
    const [view, setView] = useState<'list' | 'post'>('list');
    const [jobs, setJobs] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('dance');
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');
    const [salary, setSalary] = useState('');

    useEffect(() => {
        const update = () => setJobs(placementService.getJobOpenings());
        update();
        return placementService.subscribe(update);
    }, []);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const newJob: JobOpening = {
            id: `JOB-${Date.now()}`,
            companyId: user.id,
            companyName: user.name,
            jobTitle: title,
            location,
            description: `[${category.toUpperCase()}] ${desc} | Salary: ${salary}`,
            postedDate: new Date().toISOString(),
            isApproved: true 
        };

        try {
            await placementService.postJobOpening(newJob);
            
            // Notification Blast to Students
            notificationService.addNotification({
                title: `New ${category.toUpperCase()} Job!`,
                message: `${user.name} has posted a new opportunity for ${title}.`,
                icon: <BriefcaseIcon/>,
                link: { service: 'Placement Forum' }
            });

            toast.success("Requirement Published! Students notified.");
            setView('list');
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Posting failed.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle(''); setDesc(''); setLocation(''); setSalary('');
    };

    const isRecruiter = [UserRole.Company, UserRole.Director, UserRole.Admin].includes(user.role);

    return (
        <div className="space-y-8 animate-pop-in h-full flex flex-col pb-20">
            {/* Professional Header */}
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl border-b-8 border-primary">
                <div className="flex items-center gap-6">
                    <div className="bg-primary p-4 rounded-2xl text-slate-950 shadow-xl rotate-3">
                        <BriefcaseIcon className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">PLACEMENT <span className="text-primary not-italic">HUB</span></h2>
                        <p className="text-sm text-slate-400 font-hindi font-bold tracking-widest">मंगमत ग्रुप: भर्ती और अवसर पोर्टल</p>
                    </div>
                </div>
                {isRecruiter && (
                    <button 
                        onClick={() => setView(view === 'list' ? 'post' : 'list')}
                        className={`px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-4 shadow-xl active:scale-95 ${view === 'list' ? 'bg-primary text-slate-950 hover:bg-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                        {view === 'list' ? <><PlusIcon className="h-6 w-6"/> POST REQUIREMENT</> : 'BACK TO LIST'}
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {view === 'post' ? (
                    <div className="max-w-4xl mx-auto animate-slide-in-up">
                        <div className="bg-white p-10 rounded-[4rem] border-8 border-slate-50 shadow-3xl">
                            <form onSubmit={handlePost} className="space-y-8">
                                <div className="text-center space-y-2 mb-10">
                                    <h3 className="text-3xl font-black text-slate-900 uppercase">Hire Best <span className="text-primary">Talent</span></h3>
                                    <p className="text-slate-500 font-hindi font-bold">अपनी कंपनी की जरूरतें यहाँ भरें</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Talent Category</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {TalentCategories.map(cat => (
                                                <button 
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`p-3 rounded-xl border-2 flex items-center gap-2 text-[10px] font-black uppercase transition-all ${category === cat.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400'}`}
                                                >
                                                    {cat.icon} {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Job Title</label>
                                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Lead Dancer for Event" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pay/Salary</label>
                                        <input value={salary} onChange={e => setSalary(e.target.value)} placeholder="₹15k - ₹25k / Month" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Location</label>
                                        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City / Remote" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Job Description</label>
                                    <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="Tell students about the role..." className="w-full p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-primary outline-none font-hindi font-medium text-lg leading-relaxed" required />
                                </div>

                                <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex gap-4 items-start shadow-sm">
                                    <ShieldCheckIcon className="h-6 w-6 text-red-500 shrink-0 mt-1"/>
                                    <p className="text-xs font-hindi text-red-800 font-bold leading-relaxed">
                                        <b>AI सुरक्षा चेतावनी:</b> हमारा सिस्टम MLM, नेटवर्क मार्केटिंग या संदिग्ध निवेश वाली पोस्ट को आटोमेटिक ब्लॉक करता है। केवल असली नौकरियाँ ही पोस्ट करें।
                                    </p>
                                </div>

                                <button type="submit" disabled={loading} className="w-full py-6 bg-slate-950 text-white font-black rounded-3xl shadow-2xl hover:bg-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 text-2xl uppercase active:scale-95 disabled:opacity-50">
                                    {loading ? <Loader message="" /> : <><PaperAirplaneIcon className="h-8 w-8 text-primary"/> BLAST REQUIREMENT</>}
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white p-8 rounded-[3.5rem] border-2 border-slate-50 shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between group hover:border-primary/20">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-slate-950 text-primary rounded-xl shadow-lg">
                                            <BriefcaseIcon className="h-6 w-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{new Date(job.postedDate).toLocaleDateString()}</p>
                                            <p className="text-xs font-black text-slate-400 uppercase">{job.companyName}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">{job.jobTitle}</h3>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <div className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 border flex items-center gap-2"><MapPinIcon className="h-3 w-3"/> {job.location}</div>
                                        <div className="px-3 py-1 bg-green-50 rounded-full text-[10px] font-bold text-green-600 border border-green-100 flex items-center gap-2"><CurrencyRupeeIcon className="h-3 w-3"/> {job.description.split('Salary: ')[1] || 'Negotiable'}</div>
                                    </div>
                                    <p className="text-sm text-slate-500 font-hindi font-medium line-clamp-3 leading-relaxed mb-6">
                                        {job.description.split('] ')[1] || job.description}
                                    </p>
                                </div>
                                
                                {user.role === UserRole.Student ? (
                                    <button onClick={() => toast.success("Application Sent to HR!")} className="w-full py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-primary transition-all shadow-xl text-xs uppercase tracking-widest">
                                        APPLY NOW
                                    </button>
                                ) : (
                                    <div className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live on Student Portal</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacementForum;
