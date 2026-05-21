import { ShieldCheck } from 'lucide-react';
import { OutcomeObject } from '../../types';

export function OutcomePanel({ outcome }: { outcome?: OutcomeObject }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <ShieldCheck className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Settlement Outcome</span>
        {outcome?.locked && (
          <span className="ml-auto text-[10px] font-mono bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded px-2 py-0.5 border border-blue-200 dark:border-blue-800/60">LOCKED</span>
        )}
      </div>
      <div className="flex-1 bg-slate-50 dark:bg-[#070a13] p-0 relative h-full">
        {!outcome ? (
          <div className="absolute inset-0 flex items-center justify-center p-5 text-sm text-slate-400 dark:text-slate-500 italic bg-white dark:bg-slate-900">
            No outcome settled.
          </div>
        ) : (
          <pre className="p-4 text-xs font-mono text-slate-800 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{JSON.stringify({ intent_id: outcome.intent_id, final_decision: outcome.final_decision, locked: outcome.locked }, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
