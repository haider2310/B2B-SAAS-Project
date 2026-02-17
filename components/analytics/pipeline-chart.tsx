export function PipelineChart({ data }: { data: { stage: string; value: number }[] }) {
    const maxValue = Math.max(...data.map(d => d.value), 1000);
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 h-96 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-bold text-gray-900">Revenue by Stage</h3>
                <select className="text-sm border-gray-200 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-600 bg-gray-50 py-1.5 px-3 outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                    <option>This Month</option>
                    <option>Last Quarter</option>
                    <option>Year to Date</option>
                </select>
            </div>

            <div className="flex-1 relative z-10">
                {/* Y-Axis Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 25, 50, 75, 100].reverse().map((tick) => (
                        <div key={tick} className="w-full flex items-center">
                            <span className="text-xs text-gray-400 w-12 text-right pr-3 font-medium">
                                {formatter.format(maxValue * (tick / 100)).replace('$', '$')}
                            </span>
                            <div className="flex-1 h-px bg-gray-50 border-t border-dashed border-gray-200"></div>
                        </div>
                    ))}
                    {/* Extra space for X-axis labels */}
                    <div className="h-6"></div>
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between pl-16 pr-4 pb-6 pt-2">
                    {data.map((item, index) => (
                        <div key={item.stage} className="flex flex-col items-center flex-1 h-full justify-end group/bar cursor-pointer px-2">
                            <div
                                className="w-full max-w-[48px] bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md relative transition-all duration-500 ease-out hover:from-indigo-500 hover:to-indigo-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:-translate-y-1"
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-xl transform translate-y-2 group-hover/bar:translate-y-0 pointer-events-none">
                                    <div className="font-bold text-sm">{formatter.format(item.value)}</div>
                                    <div className="text-xs text-slate-300 font-medium">{item.stage}</div>
                                    {/* Arrow */}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between pl-16 pr-4 border-t border-gray-100 pt-3 relative z-10">
                {data.map((item) => (
                    <div key={item.stage} className="flex-1 text-center">
                        <span className="text-xs font-semibold text-gray-500 block truncate px-1 group-hover/bar:text-indigo-600 transition-colors">
                            {item.stage}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
