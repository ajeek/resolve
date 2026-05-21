import { CheckCircle2 } from 'lucide-react';
import { ConsensusRecord } from '../../types';
import { cn } from '../../lib/utils';

export function ConsensusPanel({ record }: { record?: ConsensusRecord }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <CheckCircle2 className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Consensus Trace</span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {!record ? (
          <div className="text-sm text-slate-400 dark:text-slate-500 italic">Awaiting equivalence check...</div>
        ) : (
          <>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Classification</label>
              <p className={cn(
                "text-sm font-semibold font-mono mt-1",
                record.classification === 'FULFILLED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              )}>
                {record.classification}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confidence</label>
              <p className="text-sm font-mono mt-1 text-slate-800 dark:text-slate-300">{record.confidence}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reasoning</label>
              <p className="text-sm mt-1 text-slate-800 dark:text-slate-300">{record.reasoning}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
