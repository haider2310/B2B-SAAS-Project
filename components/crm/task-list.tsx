'use client';

import { useState, useEffect } from 'react';
import { toggleTaskCompletion } from '@/app/actions/tasks';

interface Task {
    id: string;
    title: string;
    dueDate: Date | null;
    status: string;
    priority: string;
    assignedTo?: { name: string | null } | null;
}

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    // Sync state with props when server revalidates
    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleToggle = async (id: string, currentStatus: string) => {
        const isCompleted = currentStatus === 'TODO';
        const newStatus = isCompleted ? 'COMPLETED' : 'TODO';

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));

        await toggleTaskCompletion(id, isCompleted);
    };

    const todoTasks = tasks.filter(t => t.status !== 'COMPLETED');
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* TODO List */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🔄 To Do <span className="text-gray-400 text-sm font-normal">({todoTasks.length})</span>
                </h2>
                <div className="space-y-3">
                    {todoTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={handleToggle} />
                    ))}
                    {todoTasks.length === 0 && <p className="text-gray-400 text-sm italic">No active tasks.</p>}
                </div>
            </div>

            {/* Completed List */}
            <div className="bg-gray-50 rounded-lg shadow-inner p-6 opacity-75">
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                    ✅ Completed <span className="text-gray-400 text-sm font-normal">({completedTasks.length})</span>
                </h2>
                <div className="space-y-3">
                    {completedTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={handleToggle} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TaskItem({ task, onToggle }: { task: Task, onToggle: (id: string, s: string) => void }) {
    const isCompleted = task.status === 'COMPLETED';

    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${isCompleted ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-200 shadow-sm'}`}>
            <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onToggle(task.id, task.status)}
                className="mt-1.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
            />
            <div className="flex-1">
                <p className={`text-sm font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                </p>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    {task.dueDate && (
                        <span className={new Date(task.dueDate) < new Date() && !isCompleted ? 'text-red-600 font-bold' : ''}>
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                    <span className={`uppercase font-bold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                    {task.assignedTo && (
                        <span>👤 {task.assignedTo.name}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function getPriorityColor(priority: string) {
    switch (priority) {
        case 'HIGH': return 'text-red-600';
        case 'URGENT': return 'text-purple-600';
        case 'LOW': return 'text-gray-400';
        default: return 'text-gray-600';
    }
}
