'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link href="/dashboard" className="text-gray-400 hover:text-gray-500">
                            <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join('/')}`;
                    const isLast = index === segments.length - 1;
                    const title = segment.charAt(0).toUpperCase() + segment.slice(1);

                    return (
                        <li key={segment}>
                            <div className="flex items-center">
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <Link
                                    href={href}
                                    className={`ml-2 text-sm font-medium ${isLast ? 'text-gray-900 dark:text-white pointer-events-none' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {title}
                                </Link>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
