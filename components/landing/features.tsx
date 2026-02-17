'use client';

import {
    Cpu,
    BarChart3,
    Phone,
    Share2,
    ShieldCheck,
    Zap
} from 'lucide-react';

const features = [
    {
        name: 'Automated Lead Capture',
        description: 'Sync leads from your website directly into your CRM. Zero data entry required.',
        icon: Zap,
    },
    {
        name: 'Visual Pipeline',
        description: 'Track deals with a drag-and-drop Kanban board. Never lose sight of revenue.',
        icon: BarChart3,
    },
    {
        name: 'Call Logging',
        description: 'Log inbound and outbound calls with a single click. Keep history organized.',
        icon: Phone,
    },
    {
        name: 'Workflow Automation',
        description: 'Trigger emails and tasks based on deal stages. Put your sales on autopilot.',
        icon: Cpu,
    },
    {
        name: 'Team Collaboration',
        description: 'Assign tasks, share notes, and close deals faster together.',
        icon: Share2,
    },
    {
        name: 'Enterprise Security',
        description: 'Role-based access control and secure data storage for peace of mind.',
        icon: ShieldCheck,
    },
];

export function Features() {
    return (
        <div className="bg-white dark:bg-zinc-900 py-24 sm:py-32" id="features">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Everything you need to scale your SaaS
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Stop juggling multiple tools. SnapCut AI brings your entire sales process into one intuitive platform.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
