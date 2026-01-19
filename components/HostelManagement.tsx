
import React, { useState } from 'react';
import { HomeIcon, UserCircleIcon, CalendarDaysIcon, ChatBubbleIcon, CheckCircleIcon, ExclamationTriangleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

type Tab = 'room' | 'mess' | 'outpass' | 'complaints';

interface Menu {
    breakfast: string;
    lunch: string;
    dinner: string;
}

const HostelManagement: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('room');
    
    // Mock Data
    const roomDetails = {
        block: 'B',
        roomNo: '302',
        type: 'Double Occupancy',
        roommates: [
            { name: 'Amit Kumar', course: 'B.Tech CS' },
            { name: 'You', course: 'B.Tech CS' }
        ]
    };

    const weeklyMenu: { [key: string]: Menu } = {
        'Monday': { breakfast: 'Aloo Paratha + Curd', lunch: 'Rajma Chawal + Salad', dinner: 'Mix Veg + Chapati' },
        'Tuesday': { breakfast: 'Poha + Tea', lunch: 'Chole Bhature', dinner: 'Egg Curry / Paneer + Rice' },
        'Wednesday': { breakfast: 'Sandwich + Milk', lunch: 'Dal Makhani + Naan', dinner: 'Chicken Biryani / Veg Pulao' },
        // ... add more days
    };
    const todayMenu = weeklyMenu['Monday']; // Mock today as Monday

    // Outpass State
    const [outpassReason, setOutpassReason] = useState('');
    const [outpassDate, setOutpassDate] = useState('');
    const [outpassStatus, setOutpassStatus] = useState<'idle' | 'pending'>('idle');

    // Complaint State
    const [complaint, setComplaint] = useState('');

    const handleOutpassSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!outpassReason || !outpassDate) {
            toast.error("Please fill all fields.");
            return;
        }
        setOutpassStatus('pending');
        toast.success("Outpass request submitted to Warden.");
        setOutpassReason('');
        setOutpassDate('');
    };

    const handleComplaintSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!complaint) return;
        toast.success("Complaint registered. Maintenance team alerted.");
        setComplaint('');
    };

    const renderRoom = () => (
        <div className="animate-pop-in space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-1">My Room</h3>
                <p className="opacity-90">Block {roomDetails.block} | Room {roomDetails.roomNo}</p>
                <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">{roomDetails.type}</span>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-slate-800 mb-3">Roommates</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roomDetails.roommates.map((mate, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <UserCircleIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{mate.name}</p>
                                <p className="text-sm text-slate-500">{mate.course}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMess = () => (
        <div className="animate-pop-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Today's Menu</h3>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Monday</span>
            </div>
            
            <div className="space-y-4">
                <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded-r-lg">
                    <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-1">Breakfast (08:00 - 09:30)</p>
                    <p className="text-lg font-medium text-slate-800">{todayMenu.breakfast}</p>
                </div>
                <div className="p-4 border-l-4 border-orange-400 bg-orange-50 rounded-r-lg">
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Lunch (12:30 - 02:00)</p>
                    <p className="text-lg font-medium text-slate-800">{todayMenu.lunch}</p>
                </div>
                <div className="p-4 border-l-4 border-indigo-400 bg-indigo-50 rounded-r-lg">
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Dinner (08:00 - 09:30)</p>
                    <p className="text-lg font-medium text-slate-800">{todayMenu.dinner}</p>
                </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-lg border text-center">
                <p className="text-sm text-slate-500">Review Next Week's Menu?</p>
                <button className="text-primary font-bold text-sm hover:underline mt-1">Download PDF</button>
            </div>
        </div>
    );

    const renderOutpass = () => (
        <div className="animate-pop-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Apply for Outpass / Leave</h3>
            
            {outpassStatus === 'pending' ? (
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarDaysIcon className="h-8 w-8"/>
                    </div>
                    <h4 className="font-bold text-yellow-800 text-lg">Application Pending</h4>
                    <p className="text-sm text-yellow-700 mt-2">Your request has been sent to the warden. You will receive a notification once approved.</p>
                    <button onClick={() => setOutpassStatus('idle')} className="mt-4 text-sm underline text-yellow-800">New Request</button>
                </div>
            ) : (
                <form onSubmit={handleOutpassSubmit} className="space-y-4 bg-white p-4 border rounded-xl">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date of Leaving</label>
                        <input type="date" value={outpassDate} onChange={e => setOutpassDate(e.target.value)} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                        <textarea value={outpassReason} onChange={e => setOutpassReason(e.target.value)} rows={4} className="w-full p-2 border rounded-md" placeholder="e.g., Going home for weekend..." required />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
                        Submit Request
                    </button>
                </form>
            )}

            <div className="mt-6">
                <h4 className="font-bold text-slate-700 text-sm mb-3">Recent History</h4>
                <div className="space-y-2 opacity-60">
                    <div className="p-3 border rounded-lg flex justify-between items-center bg-slate-50">
                        <span className="text-sm">15 Aug 2024 (Home Visit)</span>
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Approved</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderComplaints = () => (
        <div className="animate-pop-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Maintenance & Complaints</h3>
            
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Describe Issue</label>
                    <textarea 
                        value={complaint} 
                        onChange={e => setComplaint(e.target.value)} 
                        rows={4} 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                        placeholder="e.g., Fan in Room 302 is making noise..." 
                        required 
                    />
                </div>
                <button type="submit" className="w-full py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5"/> Report Issue
                </button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">Emergency Contacts</h4>
                <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Warden:</strong> +91 98765 43210</p>
                    <p><strong>Security:</strong> +91 1122 334455</p>
                    <p><strong>Medical Room:</strong> Ext 102</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <HomeIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Hostel & Mess</h2>
                    <p className="text-sm text-neutral-500 font-hindi">आवास और भोजन प्रबंधन</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6 shrink-0">
                <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveTab('room')} className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'room' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                        My Room
                    </button>
                    <button onClick={() => setActiveTab('mess')} className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'mess' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                        Mess Menu
                    </button>
                    <button onClick={() => setActiveTab('outpass')} className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'outpass' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                        Outpass
                    </button>
                    <button onClick={() => setActiveTab('complaints')} className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'complaints' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                        Complaints
                    </button>
                </nav>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {activeTab === 'room' && renderRoom()}
                {activeTab === 'mess' && renderMess()}
                {activeTab === 'outpass' && renderOutpass()}
                {activeTab === 'complaints' && renderComplaints()}
            </div>
        </div>
    );
};

export default HostelManagement;
