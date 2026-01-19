
import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { SupportTicket, TicketStatus, TicketCategory, UserRole } from '../types';
import { ExclamationTriangleIcon } from './icons/AllIcons';

const mockSubmittedTickets: SupportTicket[] = [
    { id: 'TKT-001', franchiseName: 'Education Sarthi School', franchiseType: UserRole.Admin, category: TicketCategory.Technical, description: 'AI Study Guru is not responding to audio commands for Class 10 students.', status: TicketStatus.Open, dateReported: '2024-07-28' },
    { id: 'TKT-004', franchiseName: 'Education Sarthi School', franchiseType: UserRole.Admin, category: TicketCategory.Administrative, description: 'Unable to add a new teacher to the User Management panel.', status: TicketStatus.Resolved, dateReported: '2024-07-26' },
];

const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
    const style = {
        [TicketStatus.Open]: 'bg-red-100 text-red-800',
        [TicketStatus.InProgress]: 'bg-amber-100 text-amber-800',
        [TicketStatus.Resolved]: 'bg-green-100 text-green-800',
    }[status];
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>{status}</span>;
};

const FranchiseSupport: React.FC = () => {
    const [myTickets, setMyTickets] = useState<SupportTicket[]>(mockSubmittedTickets);
    const [category, setCategory] = useState<TicketCategory>(TicketCategory.Technical);
    const [description, setDescription] = useState('');
    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            toast.error('Please provide a detailed description of the issue.');
            return;
        }

        const newTicket: SupportTicket = {
            id: `TKT-${String(Math.floor(1000 + Math.random() * 9000))}`,
            franchiseName: 'Education Sarthi School', // In a real app, this would come from the logged-in user
            franchiseType: UserRole.Admin,
            category,
            description,
            status: TicketStatus.Open,
            dateReported: new Date().toISOString().split('T')[0],
        };

        setMyTickets(prev => [newTicket, ...prev]);
        toast.success('Your support ticket has been submitted!');
        
        // Reset form
        setDescription('');
        setCategory(TicketCategory.Technical);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-6">
                <ExclamationTriangleIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Franchise Support Center</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submit Ticket Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-neutral-50 space-y-4">
                        <h3 className="text-lg font-bold text-neutral-800">Submit a New Ticket</h3>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Issue Category</label>
                            <select 
                                id="category" 
                                value={category} 
                                onChange={e => setCategory(e.target.value as TicketCategory)}
                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"
                            >
                                {Object.values(TicketCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Detailed Description</label>
                            <textarea 
                                id="description" 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                rows={5} 
                                placeholder="Please describe the issue in detail..."
                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"
                            />
                        </div>
                        <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                            Submit Ticket
                        </button>
                    </form>
                </div>
                
                {/* My Tickets */}
                <div className="lg:col-span-2">
                     <h3 className="text-lg font-bold text-neutral-800 mb-4">Your Submitted Tickets</h3>
                     <div className="space-y-4">
                        {myTickets.length > 0 ? myTickets.map(ticket => (
                            <div key={ticket.id} className="p-4 border rounded-lg bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-neutral-800">{ticket.category} Issue</p>
                                        <p className="text-xs text-neutral-500">Ticket ID: {ticket.id} | Reported: {ticket.dateReported}</p>
                                    </div>
                                    <StatusBadge status={ticket.status} />
                                </div>
                                <p className="mt-2 text-sm text-neutral-600">{ticket.description}</p>
                            </div>
                        )) : (
                            <p className="text-center text-neutral-500 py-8">You have not submitted any tickets.</p>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default FranchiseSupport;
