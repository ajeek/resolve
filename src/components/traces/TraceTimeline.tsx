import { GitCommit } from 'lucide-react';
import { AdjudicationTrace } from '../../types';

export function TraceTimeline({ logs }: { logs: AdjudicationTrace[] }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 bg-[#FFFFFF] dark:bg-[#1A1D27] rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1D27]/50">
        <GitCommit className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Audit Timeline</span>
      </div>
      <div className="p-5">
        {logs.length === 0 ? (
          <div className="text-sm text-gray-400 dark:text-gray-500 italic">No traces available.</div>
        ) : (
          <div className="relative border-l border-gray-200 dark:border-gray-800 ml-2 pl-4 flex flex-col gap-6">
            {logs.map((log, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-[#FFFFFF] dark:border-[#1A1D27]" />
                <div className="text-[10px] font-mono text-gray-400 mb-1">{new Date(log.adjudicated_at * 1000).toLocaleString()}</div>
                <div className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
                  Leader Classification: <span className="font-mono font-medium text-[#2563EB] dark:text-[#3B82F6]">{log.leader_classification}</span>
                </div>
                <div className="mt-2 text-[10px] font-mono text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-[#0F1117] border border-gray-100 dark:border-gray-800 rounded">
                  {log.evidence_summary}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
