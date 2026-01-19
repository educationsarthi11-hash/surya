
import React, { useState, useEffect } from 'react';
import { ArchiveBoxIcon, PlusIcon, TrashIcon, MagnifyingGlassIcon, PencilSquareIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { InventoryItem } from '../types';

const mockInventory: InventoryItem[] = [
    { id: 'INV-001', name: 'Chalk Box (White)', category: 'Stationery', quantity: 50, unit: 'box', status: 'In Stock', location: 'Staff Room', lastUpdated: '2024-08-01' },
    { id: 'INV-002', name: 'Physics Lab Kit', category: 'Lab Equipment', quantity: 5, unit: 'set', status: 'Low Stock', location: 'Physics Lab', lastUpdated: '2024-07-20' },
    { id: 'INV-003', name: 'Projector (Epson)', category: 'Electronics', quantity: 12, unit: 'pcs', status: 'In Stock', location: 'AV Room', lastUpdated: '2024-06-15' },
    { id: 'INV-004', name: 'A4 Paper Ream', category: 'Stationery', quantity: 0, unit: 'ream', status: 'Out of Stock', location: 'Admin Office', lastUpdated: '2024-08-02' },
];

const InventoryManager: React.FC = () => {
    const toast = useToast();
    const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<Partial<InventoryItem>>({
        name: '', category: 'Stationery', quantity: 0, unit: 'pcs', location: ''
    });

    const categories = ['Stationery', 'Lab Equipment', 'Electronics', 'Furniture', 'Sports', 'Other'];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    const filteredItems = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'In Stock': return 'bg-green-100 text-green-800';
            case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
            case 'Out of Stock': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100';
        }
    };

    const determineStatus = (qty: number) => {
        if (qty === 0) return 'Out of Stock';
        if (qty < 10) return 'Low Stock';
        return 'In Stock';
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.location) {
            toast.error("Name and Location are required.");
            return;
        }

        if (isEditing && formData.id) {
            setInventory(prev => prev.map(item => item.id === formData.id ? {
                ...item,
                ...formData as InventoryItem,
                status: determineStatus(formData.quantity || 0),
                lastUpdated: new Date().toISOString().split('T')[0]
            } : item));
            toast.success("Item updated!");
        } else {
            const newItem: InventoryItem = {
                id: `INV-${Date.now()}`,
                name: formData.name,
                category: formData.category || 'Stationery',
                quantity: formData.quantity || 0,
                unit: formData.unit || 'pcs',
                status: determineStatus(formData.quantity || 0),
                location: formData.location,
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            setInventory([newItem, ...inventory]);
            toast.success("New item added to inventory.");
        }
        closeModal();
    };

    const handleEdit = (item: InventoryItem) => {
        setFormData(item);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm("Are you sure you want to delete this item?")) {
            setInventory(prev => prev.filter(i => i.id !== id));
            toast.info("Item deleted.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setFormData({ name: '', category: 'Stationery', quantity: 0, unit: 'pcs', location: '' });
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft h-full flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 shrink-0 gap-4">
                <div className="flex items-center">
                    <ArchiveBoxIcon className="h-8 w-8 text-primary" />
                    <div className="ml-3">
                        <h2 className="text-2xl font-bold text-neutral-900">Inventory Manager</h2>
                        <p className="text-sm text-neutral-500 font-hindi">स्टोर रूम और संपत्ति प्रबंधन</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark shadow-md transition-transform hover:scale-105 w-full sm:w-auto">
                    <PlusIcon className="h-5 w-5" /> Add Item
                </button>
            </div>

            <div className="mb-4 shrink-0">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search inventory..." 
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm shadow-sm"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
            </div>

            {/* Responsive Table Container */}
            <div className="flex-1 overflow-auto border rounded-lg custom-scrollbar bg-slate-50 relative">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Item Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                    <div className="text-xs text-slate-500 font-mono">{item.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold">{item.quantity} {item.unit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-3 p-1 hover:bg-blue-50 rounded"><PencilSquareIcon className="h-5 w-5"/></button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"><TrashIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-400">No items found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={closeModal}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-pop-in" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">{isEditing ? 'Edit Item' : 'Add New Stock'}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-md">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded-md" placeholder="e.g. Store Room A" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                                    <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full p-2 border rounded-md" min="0" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                                    <input type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-2 border rounded-md" placeholder="pcs, kg, etc." />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark mt-4 flex items-center justify-center gap-2">
                                <CheckCircleIcon className="h-5 w-5"/> Save Item
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManager;
