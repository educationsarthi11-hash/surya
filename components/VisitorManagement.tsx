
import React, { useState, useRef } from 'react';
import { IdentificationIcon, UsersIcon, ArrowRightIcon, PrinterIcon, PlusIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

interface Visitor {
    id: string;
    name: string;
    phone: string;
    purpose: string;
    meetTo: string;
    entryTime: string;
    exitTime?: string;
    status: 'In' | 'Out';
    photoUrl?: string;
}

const mockVisitors: Visitor[] = [
    { id: 'VIS-001', name: 'Rajesh Kumar', phone: '9876543210', purpose: 'Parent Meeting', meetTo: 'Principal', entryTime: '10:30 AM', status: 'In', photoUrl: 'https://i.pravatar.cc/150?u=rajesh' },
    { id: 'VIS-002', name: 'Sunita Devi', phone: '9123456780', purpose: 'Admission Enquiry', meetTo: 'Admin', entryTime: '11:15 AM', exitTime: '12:00 PM', status: 'Out', photoUrl: 'https://i.pravatar.cc/150?u=sunita' },
];

const VisitorManagement: React.FC = () => {
    const toast = useToast();
    const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
    const [activeTab, setActiveTab] = useState<'log' | 'entry'>('log');
    const [showGatePass, setShowGatePass] = useState<Visitor | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [purpose, setPurpose] = useState('Parent Meeting');
    const [meetTo, setMeetTo] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEntrySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !meetTo) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const newVisitor: Visitor = {
            id: `VIS-${Date.now().toString().slice(-4)}`,
            name,
            phone,
            purpose,
            meetTo,
            entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'In',
            photoUrl: photo ? URL.createObjectURL(photo) : undefined,
        };

        setVisitors([newVisitor, ...visitors]);
        toast.success("Visitor entry recorded successfully!");
        setShowGatePass(newVisitor);
        
        // Reset form
        setName('');
        setPhone('');
        setPurpose('Parent Meeting');
        setMeetTo('');
        setPhoto(null);
        setActiveTab('log');
    };

    const handleCheckout = (id: string) => {
        setVisitors(visitors.map(v => 
            v.id === id ? { ...v, status: 'Out', exitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : v
        ));
        toast.success("Visitor checked out.");
    };

    const renderGatePass = (visitor: Visitor) => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGatePass(null)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="bg-orange-600 p-4 text-white text-center">
                    <h3 className="text-xl font-bold uppercase tracking-wider">Gate Pass</h3>
                    <p className="text-xs opacity-80">Visitor Entry Permit</p>
                </div>
                <div className="p-6 text-center">
                    {visitor.photoUrl ? (
                        <img src={visitor.photoUrl} alt={visitor.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-orange-100" />
                    ) : (
                        <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400">
                            <UsersIcon className="h-12 w-12" />
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-slate-900">{visitor.name}</h2>
                    <p className="text-sm text-slate-500 mb-4">{visitor.phone}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Purpose</p>
                            <p className="font-semibold">{visitor.purpose}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Meeting</p>
                            <p className="font-semibold">{visitor.meetTo}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Time In</p>
                            <p className="font-semibold">{visitor.entryTime}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold">Pass ID</p>
                            <p className="font-mono font-semibold">{visitor.id}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <button onClick={() => setShowGatePass(null)} className="text-sm text-slate-500 hover:text-slate-700">Close</button>
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-bold">
                            <PrinterIcon className="h-4 w-4"/> Print Pass
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px]">
            {showGatePass && renderGatePass(showGatePass)}
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <IdentificationIcon className="h-8 w-8 text-primary" />
                    <div className="ml-3">
                        <h2 className="text-2xl font-bold text-neutral-900">Visitor Management</h2>
                        <p className="text-sm text-neutral-500 font-hindi">सुरक्षा और गेट पास सिस्टम</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm font-bold flex flex-col items-center">
                        <span>{visitors.filter(v => v.status === 'In').length}</span>
                        <span className="text-[10px] uppercase">Inside</span>
                    </div>
                    <button 
                        onClick={() => setActiveTab('entry')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark shadow-md transition-all"
                    >
                        <PlusIcon className="h-5 w-5" /> New Entry
                    </button>
                </div>
            </div>

            {activeTab === 'entry' ? (
                <div className="max-w-2xl mx-auto bg-slate-50 p-6 rounded-xl border border-slate-200 animate-pop-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">New Visitor Entry</h3>
                        <button onClick={() => setActiveTab('log')} className="text-sm text-slate-500 hover:text-primary">Cancel</button>
                    </div>
                    <form onSubmit={handleEntrySubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Visitor Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded-md" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                                <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full p-2 border rounded-md">
                                    <option>Parent Meeting</option>
                                    <option>Admission Enquiry</option>
                                    <option>Vendor / Delivery</option>
                                    <option>Official Visit</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Whom to Meet</label>
                                <input type="text" value={meetTo} onChange={e => setMeetTo(e.target.value)} placeholder="Staff Name / Dept" className="w-full p-2 border rounded-md" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Photo (Optional)</label>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white border rounded-md text-sm hover:bg-slate-50">Upload Photo</button>
                                <span className="text-xs text-slate-500">{photo ? photo.name : 'No file selected'}</span>
                                <input type="file" ref={fileInputRef} onChange={e => setPhoto(e.target.files?.[0] || null)} className="hidden" accept="image/*" />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors">
                            Generate Pass
                        </button>
                    </form>
                </div>
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Visitor</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Purpose</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Time In</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {visitors.map((visitor) => (
                                <tr key={visitor.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                                                {visitor.photoUrl ? <img src={visitor.photoUrl} alt="" className="h-full w-full object-cover" /> : <UsersIcon className="h-5 w-5" />}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{visitor.name}</div>
                                                <div className="text-xs text-slate-500">{visitor.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900">{visitor.purpose}</div>
                                        <div className="text-xs text-slate-500">To: {visitor.meetTo}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {visitor.entryTime}
                                        {visitor.exitTime && <span className="block text-xs">Out: {visitor.exitTime}</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${visitor.status === 'In' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {visitor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {visitor.status === 'In' ? (
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setShowGatePass(visitor)} className="text-indigo-600 hover:text-indigo-900">View Pass</button>
                                                <button onClick={() => handleCheckout(visitor.id)} className="text-red-600 hover:text-red-900 font-bold">Check Out</button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs">Checked Out</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VisitorManagement;
