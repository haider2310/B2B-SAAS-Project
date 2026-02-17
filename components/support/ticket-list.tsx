'use client';

import { useState, useEffect } from 'react';
import { updateTicketStatus } from '@/app/actions/support';

interface Ticket {
    id: string;
    title: string;
    priority: string;
    status: string;
    assignedTo: { name: string | null } | null;
    contact: { firstName: string; lastName: string; email: string | null } | null;
    createdAt: Date;
}

export function TicketList({ initialTickets }: { initialTickets: Ticket[] }) {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

    // Sync state with props when server revalidates
    useEffect(() => {
        setTickets(initialTickets);
    }, [initialTickets]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        // Optimistic
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        await updateTicketStatus(id, newStatus);
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md divide-y divide-gray-200">
            {tickets.map((ticket) => (
                <div key={ticket.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-sm font-bold text-gray-900 truncate">
                                #{ticket.id.slice(-4)} {ticket.title}
                            </h3>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-4">
                            {ticket.contact ? (
                                <span>👤 {ticket.contact.firstName} {ticket.contact.lastName}</span>
                            ) : (
                                <span>👤 Unassigned Contact</span>
                            )}
                            <span className="text-gray-400">•</span>
                            <span>🔧 {ticket.assignedTo?.name || 'Unassigned'}</span>
                            <span className="text-gray-400">•</span>
                            <span>🕒 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div>
                        <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                            className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md
                                ${ticket.status === 'OPEN' ? 'text-green-600 font-bold' : 'text-gray-500'}`}
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>
                </div>
            ))}
            {tickets.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-sm">
                    No open tickets. Good job!
                </div>
            )}
        </div>
    );
}

function getPriorityColor(priority: string) {
    switch (priority) {
        case 'URGENT': return 'bg-red-100 text-red-800';
        case 'HIGH': return 'bg-orange-100 text-orange-800';
        case 'MEDIUM': return 'bg-blue-100 text-blue-800';
        case 'LOW': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}
