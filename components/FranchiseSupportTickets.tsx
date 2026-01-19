
import React, { useState } from 'react';
import { SupportTicket, TicketStatus, UserRole, TicketCategory } from '../types';
import { ExclamationTriangleIcon } from './icons/AllIcons';

const mockTickets: SupportTicket[] = [
    { id: 'TKT-001', franchiseName: 'Education Sarthi School', franchiseType: UserRole.Admin, category: TicketCategory.Technical, description: 'AI Study Guru is not responding to audio commands for Class 10 students.', status: TicketStatus.Open, dateReported: '2024-07-28' },
    { id: 'TKT-002', franchiseName: 'Future Sarthi College', franchiseType: UserRole.College, category: TicketCategory.Billing, description: 'Invoice for last month seems incorrect. Need clarification on the video generation charges.', status: TicketStatus.InProgress, dateReported: '2024-07-27' },
    { id: 'TKT-003', franchiseName: 'Vikram Coaching Center', franchiseType: UserRole.CoachingCenter, category: TicketCategory.Academic, description: 'The Test Paper Guru generated a physics paper with some out-of-syllabus questions for NEET prep.', status: TicketStatus.Open, dateReported: '2024-07-28' },
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

const FranchiseSupportTickets: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
    const openTicketsCount = tickets.filter(t => t.status === TicketStatus.Open).length;
    
    const handleStatusChange = (id: string, newStatus: TicketStatus) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <ExclamationTriangleIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                    <h2 className="ml-3 text-2xl font-bold text-neutral-900">Franchise Support Tickets</h2>
                </div>
                 {openTicketsCount > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-red-600">{openTicketsCount} Open Tickets</span>
                    </div>
                )}
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Franchise</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Issue</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <div className="font-medium text-neutral-900">{ticket.franchiseName}</div>
                            <div className="text-neutral-500">{ticket.franchiseType}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">{ticket.category}</td>
                        <td className="px-4 py-4 text-sm text-neutral-600 max-w-xs truncate">{ticket.description}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <select 
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                            className="text-xs p-1 rounded-md border-neutral-300 focus:ring-primary focus:border-primary"
                           >
                            {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        </div>
    );
};

export default FranchiseSupportTickets;
