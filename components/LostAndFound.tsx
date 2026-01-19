
import React, { useState, useRef } from 'react';
import { TagIcon, PhotoIcon, MagnifyingGlassIcon, PlusIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

interface LostItem {
    id: string;
    type: 'Lost' | 'Found';
    itemName: string;
    description: string;
    location: string;
    date: string;
    status: 'Open' | 'Resolved';
    image?: string;
    contact?: string;
}

const mockItems: LostItem[] = [
    { id: 'LF001', type: 'Lost', itemName: 'Blue Water Bottle', description: 'Milton brand, 1 litre capacity. Lost near the playground.', location: 'Playground', date: '2024-08-25', status: 'Open' },
    { id: 'LF002', type: 'Found', itemName: 'Math Textbook', description: 'Class 10 NCERT book found on a bench.', location: 'Canteen', date: '2024-08-24', status: 'Open', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop' },
    { id: 'LF003', type: 'Lost', itemName: 'Wrist Watch', description: 'Black strap, analog dial.', location: 'Library', date: '2024-08-20', status: 'Resolved' },
];

const LostAndFound: React.FC = () => {
    const toast = useToast();
    const [items, setItems] = useState<LostItem[]>(mockItems);
    const [activeTab, setActiveTab] = useState<'browse' | 'report'>('browse');
    const [filterType, setFilterType] = useState<'All' | 'Lost' | 'Found'>('All');
    
    // Report Form State
    const [reportType, setReportType] = useState<'Lost' | 'Found'>('Lost');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setContact] = useState('');
    const [itemImage, setItemImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName || !description || !location) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const newItem: LostItem = {
            id: `LF${Date.now()}`,
            type: reportType,
            itemName,
            description,
            location,
            date: new Date().toISOString().split('T')[0],
            status: 'Open',
            contact,
            image: itemImage ? URL.createObjectURL(itemImage) : undefined
        };

        setItems([newItem, ...items]);
        toast.success("Item reported successfully!");
        
        // Reset form
        setItemName('');
        setDescription('');
        setLocation('');
        setContact('');
        setItemImage(null);
        setActiveTab('browse');
    };

    const handleResolve = (id: string) => {
        setItems(items.map(item => item.id === id ? { ...item, status: 'Resolved' } : item));
        toast.success("Item marked as resolved.");
    };

    const filteredItems = items.filter(item => filterType === 'All' || item.type === filterType);

    const renderBrowse = () => (
        <div className="space-y-6 animate-pop-in">
            <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => setFilterType('All')} className={`px-4 py-2 rounded-full text-sm font-semibold border ${filterType === 'All' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>All</button>
                <button onClick={() => setFilterType('Lost')} className={`px-4 py-2 rounded-full text-sm font-semibold border ${filterType === 'Lost' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-500 border-red-200 hover:bg-red-50'}`}>Lost Items</button>
                <button onClick={() => setFilterType('Found')} className={`px-4 py-2 rounded-full text-sm font-semibold border ${filterType === 'Found' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-500 border-green-200 hover:bg-green-50'}`}>Found Items</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className={`relative bg-white rounded-xl shadow-sm border overflow-hidden group hover:shadow-md transition-shadow ${item.status === 'Resolved' ? 'opacity-60' : ''}`}>
                        <div className={`absolute top-0 left-0 w-full h-1 ${item.type === 'Lost' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.type === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {item.type}
                                </span>
                                <span className="text-xs text-slate-500">{item.date}</span>
                            </div>
                            
                            <div className="flex gap-4 mt-3">
                                {item.image ? (
                                    <img src={item.image} alt={item.itemName} className="w-16 h-16 rounded-lg object-cover border" />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
                                        <PhotoIcon className="h-8 w-8" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.itemName}</h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MagnifyingGlassIcon className="h-3 w-3"/> {item.location}</p>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-600 mt-3 line-clamp-2">{item.description}</p>
                            
                            {item.status === 'Open' ? (
                                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                                    <button className="text-xs font-semibold text-primary hover:underline">Contact</button>
                                    <button onClick={() => handleResolve(item.id)} className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1">
                                        <CheckCircleIcon className="h-3 w-3"/> Mark Resolved
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-4 pt-3 border-t text-center">
                                    <span className="text-xs font-bold text-green-600 flex items-center justify-center gap-1">
                                        <CheckCircleIcon className="h-4 w-4"/> Resolved
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {filteredItems.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        <TagIcon className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                        <p>No items found.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderReportForm = () => (
        <form onSubmit={handleReportSubmit} className="max-w-2xl mx-auto p-6 border rounded-xl bg-neutral-50 space-y-6 animate-pop-in">
            <div className="flex gap-4 justify-center">
                <label className={`flex-1 cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${reportType === 'Lost' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-white hover:border-red-200'}`}>
                    <input type="radio" name="type" value="Lost" checked={reportType === 'Lost'} onChange={() => setReportType('Lost')} className="hidden"/>
                    <span className="font-bold">I Lost Something</span>
                </label>
                <label className={`flex-1 cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${reportType === 'Found' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 bg-white hover:border-green-200'}`}>
                    <input type="radio" name="type" value="Found" checked={reportType === 'Found'} onChange={() => setReportType('Found')} className="hidden"/>
                    <span className="font-bold">I Found Something</span>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g., Blue Water Bottle" className="w-full p-2 border rounded-md" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location {reportType === 'Lost' ? 'Lost' : 'Found'}</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Canteen" className="w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info (Optional)</label>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Phone or Room No." className="w-full p-2 border rounded-md" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describe color, brand, or unique marks..." className="w-full p-2 border rounded-md" required></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image (Optional)</label>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={e => setItemImage(e.target.files?.[0] || null)}
                    accept="image/*"
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
            </div>

            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                <PlusIcon className="h-5 w-5"/> Submit Report
            </button>
        </form>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft min-h-[600px]">
            <div className="flex items-center mb-6">
                <TagIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Lost & Found</h2>
                    <p className="text-sm text-neutral-500 font-hindi">खोया-पाया विभाग</p>
                </div>
            </div>

            <div className="border-b mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('browse')} className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'browse' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>Browse Items</button>
                    <button onClick={() => setActiveTab('report')} className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'report' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>Report Item</button>
                </nav>
            </div>

            {activeTab === 'browse' ? renderBrowse() : renderReportForm()}
        </div>
    );
};

export default LostAndFound;
