// Icons are now inline SVGs

export function KPICards({ stats }: { stats: any }) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });

    const cards = [
        {
            title: "Pipeline Value",
            value: formatter.format(stats.pipelineValue),
            change: "+12.5%",
            trend: "up",
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: "indigo"
        },
        {
            title: "Conversion Rate",
            value: `${stats.conversionRate}%`,
            change: "+4.2%",
            trend: "up",
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: "emerald"
        },
        {
            title: "Total Leads",
            value: stats.totalLeads,
            change: "+28",
            trend: "up",
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: "blue"
        },
        {
            title: "Open Tickets",
            value: stats.openTickets,
            change: "-2",
            trend: "down",
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: "orange"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-700 p-6 flex items-start justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                        {/* Background Decoration */}
                        <div className={`w-24 h-24 rounded-full blur-2xl ${card.color === 'indigo' ? 'bg-indigo-500' :
                                card.color === 'emerald' ? 'bg-emerald-500' :
                                    card.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                            }`}></div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">{card.value}</h3>
                        <div className="flex items-center mt-2.5">
                            <span className={`
                                inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full
                                ${card.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}
                                ${card.title === 'Open Tickets' && card.trend === 'down' ? 'bg-emerald-50 text-emerald-700' : ''} 
                                ${card.title === 'Open Tickets' && card.trend === 'up' ? 'bg-red-50 text-red-700' : ''}
                            `}>
                                {card.change}
                            </span>
                            <span className="ml-2 text-xs text-slate-400 font-medium">vs last month</span>
                        </div>
                    </div>
                    <div className={`
                        relative z-10
                        p-3 rounded-xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300
                        ${card.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/30 text-white' : ''}
                        ${card.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30 text-white' : ''}
                        ${card.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30 text-white' : ''}
                        ${card.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30 text-white' : ''}
                    `}>
                        {card.icon}
                    </div>
                </div>
            ))}
        </div>
    );
}
