'use client';

import { useState, useEffect } from 'react';
import { searchGlobal } from '@/app/actions/search';
import { useRouter } from 'next/navigation';

export function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                const res = await searchGlobal(query);
                setResults(res.results);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" onClick={() => setIsOpen(false)} aria-hidden="true" />

            <div className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                <div className="relative">
                    <span className="pointer-events-none absolute top-3.5 left-4 text-gray-400">🔍</span>
                    <input
                        type="text"
                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder-gray-500 sm:text-sm focus:ring-0"
                        placeholder="Search Leads, Companies, Deals... (ESC to close)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>

                {results.length > 0 && (
                    <ul className="max-h-96 scroll-py-3 overflow-y-auto p-3">
                        {results.map((result) => (
                            <li key={result.id + result.type}>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push(result.url);
                                    }}
                                    className="group flex w-full select-none rounded-xl p-3 hover:bg-indigo-50 text-left"
                                >
                                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gray-100 group-hover:bg-indigo-200">
                                        <span className="text-lg">
                                            {result.type === 'Lead' && '🎯'}
                                            {result.type === 'Company' && '🏢'}
                                            {result.type === 'Deal' && '💰'}
                                            {result.type === 'Contact' && '👤'}
                                        </span>
                                    </div>
                                    <div className="ml-4 flex-auto">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{result.title}</p>
                                        <p className="text-sm text-gray-500 group-hover:text-gray-700">{result.type} • {result.subtitle}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {query.length > 1 && results.length === 0 && (
                    <div className="p-14 text-center sm:px-14">
                        <p className="mt-4 text-sm text-gray-900">No results found.</p>
                    </div>
                )}

                <div className="flex flex-wrap items-center bg-gray-50 py-2.5 px-4 text-xs text-gray-700">
                    Type 2+ chars to search.
                </div>
            </div>
        </div>
    );
}
