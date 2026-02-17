'use client';

import { Check } from 'lucide-react';

const tiers = [
    {
        name: 'Starter',
        id: 'tier-starter',
        href: '#',
        priceMonthly: '$29',
        description: 'For small teams just getting started.',
        features: ['5 Users', 'Unlimited Leads', 'Basic Analytics', 'Email Support'],
        featured: false,
    },
    {
        name: 'Pro',
        id: 'tier-pro',
        href: '#',
        priceMonthly: '$99',
        description: 'For scaling teams with advanced needs.',
        features: [
            '25 Users',
            'Advanced Automation',
            'Custom Reports',
            'Priority Support',
            'API Access',
        ],
        featured: true,
    },
    {
        name: 'Enterprise',
        id: 'tier-enterprise',
        href: '#',
        priceMonthly: '$299',
        description: 'For large organizations requiring maximum control.',
        features: [
            'Unlimited Users',
            'Dedicated Account Manager',
            'SSO & Audit Logs',
            'SLA Guarantee',
            'On-premise Option',
        ],
        featured: false,
    },
];

export function Pricing() {
    return (
        <div className="bg-white dark:bg-zinc-900 py-24 sm:py-32" id="pricing">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Simple, transparent pricing</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Choose the plan that fits your growth stage. No hidden fees.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
                    {tiers.map((tier, tierIdx) => (
                        <div
                            key={tier.id}
                            className={`
                                relative p-8 bg-white dark:bg-zinc-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 sm:p-10 rounded-3xl
                                ${tier.featured ? 'z-10 scale-105 border-2 border-indigo-600' : 'border border-gray-200 dark:border-zinc-700'}
                            `}
                        >
                            <h3 id={tier.id} className="text-base font-semibold leading-7 text-indigo-600">
                                {tier.name}
                            </h3>
                            <p className="mt-4 flex items-baseline gap-x-2">
                                <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">{tier.priceMonthly}</span>
                                <span className="text-base text-gray-500 dark:text-gray-400">/month</span>
                            </p>
                            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">{tier.description}</p>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={tier.href}
                                aria-describedby={tier.id}
                                className={`mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                ${tier.featured
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                                        : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 dark:ring-indigo-900 dark:hover:ring-indigo-800'}`}
                            >
                                Get started today
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
