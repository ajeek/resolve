import { FileCode } from 'lucide-react';

export function EvidenceViewer({ evidence }: { evidence?: string }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
        <FileCode className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Evidence Retrieval</span>
        <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded px-2 py-0.5">Validator-specific view</span>
      </div>
      <div className="flex-1 bg-slate-50 dark:bg-[#070a13] p-0 overflow-hidden relative">
        {evidence ? (
          <pre className="p-4 text-xs font-mono text-slate-700 dark:text-slate-400 overflow-auto w-full h-full whitespace-pre-wrap leading-relaxed outline-none focus:outline-none scrollbar-thin">
            {evidence.length > 4000 ? evidence.substring(0, 4000) + '\n\n... (truncated)' : evidence}
          </pre>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-sm text-slate-400 dark:text-slate-500 italic bg-white dark:bg-slate-900">
            Awaiting GenVM non-deterministic fetch...
          </div>
        )}
      </div>
    </div>
  );
}
