import { useStore } from '../store';
import { GitCommit, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TraceExplorer() {
  const { audit_trail } = useStore();
  const sortedLogs = [...audit_trail].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Protocol Trace Explorer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Audit log of all adjudication events</p>
      </div>

      {sortedLogs.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-12 py-20 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 rounded-xl text-center">
            <Activity className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No traces available on the network yet.</p>
         </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedLogs.map((log, i) => (
             <div key={i} className="flex flex-col gap-3 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <GitCommit className="w-4 h-4 text-slate-400" />
                   <span className="text-[11px] font-mono text-slate-500">{new Date(log.timestamp * 1000).toLocaleString()}</span>
                 </div>
                 <Link to={`/intent/${log.intent_id}`} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    Intent #{log.intent_id}
                 </Link>
               </div>
               <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Equivalence Match: <span className="font-mono text-emerald-600 dark:text-emerald-400">{log.classification}</span>
                  </h4>
                  <pre className="mt-3 p-3 text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#070a13] rounded-lg border border-slate-100 dark:border-slate-800/80 overflow-x-auto whitespace-pre-wrap">
                    {log.evidence_snippet}...
                  </pre>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
