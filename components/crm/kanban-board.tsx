'use client';

import { useState, useEffect } from 'react';
import { updateDealStage } from '@/app/actions/deals';

interface Deal {
    id: string;
    title: string;
    value: number;
    stage: string;
    company?: { name: string } | null;
}

const STAGES = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED'];

export function KanbanBoard({ initialDeals }: { initialDeals: Deal[] }) {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    // Sync state with props when server revalidates
    useEffect(() => {
        setDeals(initialDeals);
    }, [initialDeals]);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggingId(id);
        e.dataTransfer.setData('text/plain', id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Allow drop
    };

    const handleDrop = async (e: React.DragEvent, stage: string) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');

        if (!id) return;

        // Optimistic update
        setDeals(prev => prev.map(d => d.id === id ? { ...d, stage } : d));
        setDraggingId(null);

        try {
            await updateDealStage(id, stage);
        } catch (error) {
            console.error('Failed to move deal', error);
            // Revert would go here (fetch latest)
        }
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-8 h-[calc(100vh-200px)]">
            {STAGES.map(stage => (
                <div
                    key={stage}
                    className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4 flex flex-col"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage)}
                >
                    <h3 className="font-bold text-gray-700 mb-4 px-2 flex justify-between">
                        {stage}
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {deals.filter(d => d.stage === stage).length}
                        </span>
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {deals.filter(d => d.stage === stage).map(deal => (
                            <div
                                key={deal.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, deal.id)}
                                className={`bg-white p-4 rounded shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow 
                                    ${draggingId === deal.id ? 'opacity-50' : 'opacity-100'}`}
                            >
                                <h4 className="font-medium text-gray-900">{deal.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">{deal.company?.name || 'No Company'}</p>
                                <div className="mt-3 flex justify-between items-center text-sm">
                                    <span className="font-semibold text-green-700">
                                        ${deal.value.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
