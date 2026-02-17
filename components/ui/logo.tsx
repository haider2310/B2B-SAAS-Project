import { Terminal } from 'lucide-react';

export const Logo = ({ className = "h-8 w-8" }: { className?: string }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Terminal className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
                SnapCut <span className="text-indigo-400">AI</span>
            </span>
        </div>
    );
};
