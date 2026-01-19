
import React, { useState } from 'react';
import { UtensilsIcon, StarIcon, TrashIcon, ClipboardDocumentCheckIcon, UserGroupIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const MessManagement: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'feedback' | 'mdm'>('mdm'); // Default to MDM for Govt Feel
    const [rating, setRating] = useState(0);
    const [waste, setWaste] = useState('');
    
    // MDM State
    const [mdmCount, setMdmCount] = useState({ primary: 120, upperPrimary: 85 });
    const [mdmMenu, setMdmMenu] = useState('Dal Chawal + Kheer (Special)');
    const [isMdmSubmitted, setIsMdmSubmitted] = useState(false);

    const handleSubmitFeedback = () => {
        if (!waste) { toast.error("Enter waste amount."); return; }
        toast.success(`Feedback recorded! Today's waste: ${waste}kg logged.`);
        setRating(0);
        setWaste('');
    };

    const handleSubmitMDM = () => {
        setIsMdmSubmitted(true);
        toast.success("PM Poshan (Mid-Day Meal) Report sent to Govt Portal!");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[500px] flex flex-col animate-pop-in">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <UtensilsIcon className="h-8 w-8 text-orange-600" />
                    <div className="ml-3">
                        <h2 className="text-2xl font-bold text-neutral-900">Bhojan Sarthi</h2>
                        <p className="text-sm text-neutral-500 font-hindi">मैस, कैंटीन और मिड-डे मील (PM Poshan)</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('mdm')} className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'mdm' ? 'bg-white shadow text-orange-600' : 'text-slate-500'}`}>Govt (MDM)</button>
                    <button onClick={() => setActiveTab('feedback')} className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'feedback' ? 'bg-white shadow text-orange-600' : 'text-slate-500'}`}>Private/Hostel</button>
                </div>
            </div>

            {activeTab === 'mdm' ? (
                <div className="flex-1 space-y-6">
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
                        <h3 className="font-bold text-orange-800 flex items-center gap-2">
                            <ClipboardDocumentCheckIcon className="h-5 w-5"/> PM Poshan (Mid-Day Meal) Tracker
                        </h3>
                        <p className="text-xs text-orange-700 mt-1 font-hindi">
                            सरकारी स्कूलों के लिए दैनिक भोजन वितरण रिपोर्ट।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Today's Menu (आज का भोजन)</label>
                                <input value={mdmMenu} onChange={e => setMdmMenu(e.target.value)} className="w-full p-3 border rounded-xl font-hindi font-medium" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary (1-5)</label>
                                    <div className="flex items-center gap-2">
                                        <UserGroupIcon className="h-5 w-5 text-slate-400"/>
                                        <input type="number" value={mdmCount.primary} onChange={e => setMdmCount({...mdmCount, primary: Number(e.target.value)})} className="w-full bg-transparent font-bold text-xl outline-none" />
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upper Pry (6-8)</label>
                                    <div className="flex items-center gap-2">
                                        <UserGroupIcon className="h-5 w-5 text-slate-400"/>
                                        <input type="number" value={mdmCount.upperPrimary} onChange={e => setMdmCount({...mdmCount, upperPrimary: Number(e.target.value)})} className="w-full bg-transparent font-bold text-xl outline-none" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleSubmitMDM}
                                disabled={isMdmSubmitted}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isMdmSubmitted ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-700'}`}
                            >
                                {isMdmSubmitted ? <><CheckCircleIcon className="h-5 w-5"/> Report Submitted to Govt</> : 'Submit Daily Report'}
                            </button>
                        </div>

                        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                            <h4 className="font-black uppercase tracking-widest text-orange-400 mb-2">Inventory Check</h4>
                            <div className="space-y-2 text-sm opacity-80 mb-6">
                                <p>Wheat Stock: <span className="font-bold text-white">450 kg</span></p>
                                <p>Rice Stock: <span className="font-bold text-white">320 kg</span></p>
                                <p>Funds: <span className="font-bold text-white">₹12,500</span></p>
                            </div>
                            <button className="text-xs border border-white/20 px-4 py-2 rounded-full hover:bg-white/10">Request Refill</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                        <h3 className="font-bold text-orange-900 mb-4">Rate Today's Lunch</h3>
                        <div className="flex gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                                    <StarIcon className={`h-8 w-8 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-slate-300'}`} />
                                </button>
                            ))}
                        </div>
                        
                        <h3 className="font-bold text-orange-900 mb-2">Log Food Waste (Admin)</h3>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                value={waste} 
                                onChange={e => setWaste(e.target.value)} 
                                placeholder="Waste in Kg" 
                                className="flex-1 p-2 border rounded-md"
                            />
                            <button onClick={handleSubmitFeedback} className="bg-orange-600 text-white px-4 py-2 rounded-md font-bold hover:bg-orange-700">Log</button>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Waste Analysis (This Week)</h3>
                        <div className="flex items-end gap-2 h-40 pb-2 border-b">
                            <div className="w-1/5 bg-green-500 rounded-t" style={{height: '20%'}}></div>
                            <div className="w-1/5 bg-green-500 rounded-t" style={{height: '30%'}}></div>
                            <div className="w-1/5 bg-yellow-500 rounded-t" style={{height: '50%'}}></div>
                            <div className="w-1/5 bg-orange-500 rounded-t" style={{height: '40%'}}></div>
                            <div className="w-1/5 bg-red-500 rounded-t" style={{height: '80%'}}></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 text-center">High waste on Friday. Action: Revise Friday Menu.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessManagement;
