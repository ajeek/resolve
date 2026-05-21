import { GitCommit } from 'lucide-react';
import { AuditRecord } from '../../types';

export function TraceTimeline({ logs }: { logs: AuditRecord[] }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <GitCommit className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Audit Timeline</span>
      </div>
      <div className="p-5">
        {logs.length === 0 ? (
          <div className="text-sm text-slate-400 dark:text-slate-500 italic">No traces available.</div>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-2 pl-4 flex flex-col gap-6">
            {logs.map((log, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                <div className="text-[10px] font-mono text-slate-400 mb-1">{new Date(log.timestamp * 1000).toLocaleString()}</div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Decision: <span className="text-slate-900 dark:text-white font-mono font-medium">{log.classification}</span>
                </div>
                <div className="mt-2 text-[10px] font-mono text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded overflow-hidden text-ellipsis selection:bg-blue-100 dark:selection:bg-blue-900/50">
                  {log.evidence_snippet}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
