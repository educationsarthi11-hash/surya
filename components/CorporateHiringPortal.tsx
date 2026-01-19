
import React, { useState } from 'react';
import { User } from '../types';
import { 
    BriefcaseIcon, PlusIcon, UsersIcon, SignalIcon, 
    ChartBarIcon, ShieldCheckIcon, SparklesIcon, 
    DocumentTextIcon, StarIcon, ArrowRightIcon, CheckCircleIcon,
    ArrowLeftIcon, BanknotesIcon, GlobeAltIcon, UserCircleIcon,
    CurrencyRupeeIcon, CalculatorIcon, ArchiveBoxIcon, ClipboardIcon,
    PrinterIcon, ClockIcon, XCircleIcon
} from './icons/AllIcons';
import PlacementForum from './PlacementForum';
import TalentScout from './TalentScout';
import { useToast } from '../hooks/useToast';
import { generateText } from '../services/geminiService';
import Loader from './Loader';

// --- Types for ATS ---
interface Applicant {
    id: string;
    name: string;
    role: string;
    status: 'New' | 'Shortlisted' | 'Interview' | 'Hired' | 'Rejected';
    score: number;
}

// --- Offer Letter Generator Sub-Component ---
const OfferLetterGenerator: React.FC<{ candidateName: string; role: string; onClose: () => void }> = ({ candidateName, role, onClose }) => {
    const [salary, setSalary] = useState('3.5 LPA');
    const [joiningDate, setJoiningDate] = useState('');
    const [letterContent, setLetterContent] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const prompt = `
                Generate a professional Job Offer Letter.
                Company: MGM Enterprise
                Candidate: ${candidateName}
                Role: ${role}
                Salary: ${salary}
                Joining Date: ${joiningDate || 'Immediate'}
                
                Format: HTML with standard corporate structure. 
                Tone: Professional and Welcoming.
            `;
            const result = await generateText(prompt, 'gemini-3-flash-preview');
            setLetterContent(result);
        } catch (e) {
            toast.error("Failed to generate letter.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6 text-yellow-400"/>
                        <h3 className="font-black text-lg uppercase">Instant Offer Letter</h3>
                    </div>
                    <button onClick={onClose}><XCircleIcon className="h-6 w-6 opacity-60 hover:opacity-100"/></button>
                </div>
                
                <div className="p-6 border-b bg-slate-50 grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Salary (CTC)</label>
                        <input value={salary} onChange={e => setSalary(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Joining Date</label>
                        <input type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <Loader message="AI HR is drafting the letter..." />
                        </div>
                    ) : letterContent ? (
                        <div className="prose prose-sm max-w-none font-serif text-slate-800" dangerouslySetInnerHTML={{ __html: letterContent }} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                            <DocumentTextIcon className="h-16 w-16 mb-2"/>
                            <p className="font-bold">Click Generate to create offer</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-slate-50 flex gap-3">
                    <button onClick={handleGenerate} className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary hover:text-slate-900 transition-all">
                        {letterContent ? 'Regenerate' : 'Generate Offer'}
                    </button>
                    {letterContent && (
                        <button onClick={() => window.print()} className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-white flex items-center gap-2">
                            <PrinterIcon className="h-5 w-5"/> Print
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- ATS (Applicant Tracking System) Component ---
const ATSPanel = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([
        { id: '1', name: 'Rahul Verma', role: 'Software Engineer', status: 'Shortlisted', score: 85 },
        { id: '2', name: 'Sneha Gupta', role: 'Graphic Designer', status: 'New', score: 92 },
        { id: '3', name: 'Amit Kumar', role: 'Data Analyst', status: 'Interview', score: 78 },
        { id: '4', name: 'Priya Singh', role: 'HR Intern', status: 'Hired', score: 88 },
    ]);
    const [showOfferModal, setShowOfferModal] = useState<Applicant | null>(null);

    const updateStatus = (id: string, newStatus: Applicant['status']) => {
        setApplicants(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shortlisted': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Interview': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Hired': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {showOfferModal && (
                <OfferLetterGenerator 
                    candidateName={showOfferModal.name} 
                    role={showOfferModal.role} 
                    onClose={() => setShowOfferModal(null)} 
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
                {['New', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map(status => (
                    <div key={status} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[200px] flex flex-col h-full">
                        <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-4 flex justify-between">
                            {status} 
                            <span className="bg-white px-2 rounded-full shadow-sm text-slate-800">{applicants.filter(a => a.status === status).length}</span>
                        </h4>
                        <div className="space-y-3 flex-1">
                            {applicants.filter(a => a.status === status).map(app => (
                                <div key={app.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-bold text-slate-800 text-sm">{app.name}</h5>
                                        <span className="text-[10px] font-black bg-green-50 text-green-600 px-1.5 py-0.5 rounded">{app.score}% Match</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">{app.role}</p>
                                    
                                    <div className="flex gap-1">
                                        {status !== 'Hired' && (
                                            <button onClick={() => updateStatus(app.id, 'Hired')} className="flex-1 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded hover:bg-primary transition-colors">
                                                HIRE
                                            </button>
                                        )}
                                        {status === 'Hired' && (
                                            <button onClick={() => setShowOfferModal(app)} className="flex-1 py-1.5 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                                                <PrinterIcon className="h-3 w-3"/> OFFER
                                            </button>
                                        )}
                                        {status === 'New' && (
                                             <button onClick={() => updateStatus(app.id, 'Interview')} className="p-1.5 bg-orange-100 text-orange-600 rounded hover:bg-orange-200" title="Schedule Interview">
                                                <ClockIcon className="h-4 w-4"/>
                                             </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Finance Sub-Component (Hisab Kitab) ---
const FinancePanel = () => (
    <div className="space-y-8 animate-pop-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 bg-white/10 rounded-full blur-xl -mr-5 -mt-5"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Wallet Balance</p>
                <h3 className="text-4xl font-black">₹45,000</h3>
                <p className="text-[10px] text-green-400 mt-2 font-bold uppercase tracking-wide flex items-center gap-1">
                    <CheckCircleIcon className="h-3 w-3"/> Credits Active
                </p>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Spent (YTD)</p>
                <h3 className="text-4xl font-black text-slate-900">₹1.2L</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wide">On Premium Hiring</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2.5rem] text-white shadow-lg flex flex-col justify-center items-center text-center cursor-pointer hover:scale-[1.02] transition-transform">
                <PlusIcon className="h-8 w-8 mb-2"/>
                <p className="font-black text-sm uppercase tracking-widest">Add Funds</p>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6 text-slate-400"/> Transaction History (हिसाब-किताब)
            </h4>
            <div className="space-y-4">
                {[
                    { id: 'INV-001', desc: 'Premium Job Post (Senior Dev)', date: 'Today', amount: '-₹2,500', status: 'Debited' },
                    { id: 'INV-002', desc: 'Talent Scout Database Access', date: 'Yesterday', amount: '-₹5,000', status: 'Debited' },
                    { id: 'INV-003', desc: 'Wallet Top-up', date: '20 Aug 2024', amount: '+₹20,000', status: 'Credited' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${item.status === 'Credited' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {item.status === 'Credited' ? <CurrencyRupeeIcon className="h-5 w-5"/> : <ArchiveBoxIcon className="h-5 w-5"/>}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{item.desc}</p>
                                <p className="text-xs text-slate-400">{item.id} • {item.date}</p>
                            </div>
                        </div>
                        <span className={`font-black text-lg ${item.status === 'Credited' ? 'text-green-600' : 'text-slate-900'}`}>{item.amount}</span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-100">Download GST Invoices</button>
        </div>
    </div>
);

// --- Corporate Dashboard Main Component ---

const CorporateHiringPortal: React.FC<{ user: User }> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'post-job' | 'scout' | 'ats' | 'finance'>('dashboard');
    const toast = useToast();

    const stats = [
        { label: 'Live Jobs', value: '04', icon: <BriefcaseIcon />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Applications', value: '128', icon: <DocumentTextIcon />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Shortlisted', value: '12', icon: <StarIcon />, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Hired', value: '03', icon: <CheckCircleIcon />, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    const renderDashboard = () => (
        <div className="space-y-10 animate-pop-in">
            {/* Header Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform`}>{s.icon}</div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Analytics</span>
                        </div>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Action Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Welcome Card */}
                    <div className="bg-[#0f172a] p-10 rounded-[3.5rem] text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[80px] animate-pulse"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-primary text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Enterprise Plan</span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">ID: {user.id}</span>
                            </div>
                            <h3 className="text-4xl lg:text-5xl font-black italic tracking-tighter uppercase leading-none mb-4">
                                Talent <span className="text-primary not-italic">OS.</span>
                            </h3>
                            <p className="text-lg font-hindi text-slate-400 max-w-xl leading-relaxed font-medium">
                                "आपका भर्ती कमांड सेंटर। यहाँ से जॉब पोस्ट करें, टैलेंट ढूंढें और अपना बजट मैनेज करें।"
                            </p>
                            <div className="mt-10 flex flex-wrap gap-4">
                                <button 
                                    onClick={() => setActiveTab('post-job')}
                                    className="px-8 py-4 bg-white text-slate-950 font-black rounded-2xl shadow-xl hover:bg-primary transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                                >
                                    <PlusIcon className="h-5 w-5"/> Post New Job
                                </button>
                                <button 
                                    onClick={() => setActiveTab('ats')}
                                    className="px-8 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all uppercase tracking-widest text-xs flex items-center gap-2"
                                >
                                    <ClipboardIcon className="h-5 w-5"/> Track Applications
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AI Smart Match (Advanced Feature) */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                <SparklesIcon className="h-6 w-6 text-purple-600"/> AI Smart Match
                            </h4>
                            <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">New</span>
                        </div>
                        <div className="bg-purple-50/50 p-6 rounded-[2.5rem] border border-purple-100 flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-md">
                                <UserCircleIcon className="h-10 w-10"/>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-lg">Top Recommendation: Rahul Verma</p>
                                <p className="text-xs text-slate-500 mt-1">98% Match for "Graphic Designer" Role</p>
                                <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mt-2">Skills: Photoshop, Figma, Branding</p>
                            </div>
                            <button className="ml-auto px-6 py-3 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition-all shadow-lg">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Recent Activity */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 h-full">
                        <h4 className="font-black text-sm text-slate-400 uppercase tracking-[0.2em] mb-6">Live Feed</h4>
                        <div className="space-y-6">
                            {[
                                { text: 'Aarav applied for Senior Dev', time: '10 mins ago', type: 'app' },
                                { text: 'Invoice #003 generated', time: '1 hour ago', type: 'finance' },
                                { text: 'Job "Marketing Head" approved', time: '2 hours ago', type: 'job' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className={`p-2 rounded-xl mt-1 ${item.type === 'app' ? 'bg-blue-100 text-blue-600' : item.type === 'finance' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {item.type === 'app' ? <UsersIcon className="h-4 w-4"/> : item.type === 'finance' ? <CurrencyRupeeIcon className="h-4 w-4"/> : <ShieldCheckIcon className="h-4 w-4"/>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.text}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-4 bg-slate-50 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100">View All Notifications</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfdfe] pb-20 font-sans">
            {/* Navigation Header */}
            <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-white p-4 sm:p-6 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-0 z-40 mx-2 sm:mx-6 mt-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-primary shadow-lg"><BriefcaseIcon className="h-6 w-6"/></div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">MGM <span className="text-primary not-italic">ENTERPRISE</span></h2>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Corporate Suite</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] overflow-x-auto no-scrollbar max-w-full">
                    <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>DASHBOARD</button>
                    <button onClick={() => setActiveTab('post-job')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === 'post-job' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>JOBS</button>
                    <button onClick={() => setActiveTab('scout')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === 'scout' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>TALENT SCOUT</button>
                    <button onClick={() => setActiveTab('ats')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === 'ats' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>APPLICATIONS (ATS)</button>
                    <button onClick={() => setActiveTab('finance')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'finance' ? 'bg-white text-green-700 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                        <BanknotesIcon className="h-3 w-3"/> FINANCE
                    </button>
                </div>
            </header>

            <div className="px-4 sm:px-8">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'post-job' && (
                    <div className="animate-pop-in h-full bg-white rounded-[3.5rem] border border-slate-100 shadow-xl p-8">
                        <PlacementForum user={user} />
                    </div>
                )}
                {activeTab === 'scout' && (
                    <div className="animate-pop-in h-full bg-white rounded-[3.5rem] border border-slate-100 shadow-xl p-8">
                        <TalentScout />
                    </div>
                )}
                {activeTab === 'ats' && (
                    <div className="animate-pop-in h-full bg-white rounded-[3.5rem] border border-slate-100 shadow-xl p-8">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Application Tracker (ATS)</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Candidates Pipeline</p>
                            </div>
                        </div>
                        <ATSPanel />
                    </div>
                )}
                {activeTab === 'finance' && <FinancePanel />}
            </div>
        </div>
    );
};

export default CorporateHiringPortal;
