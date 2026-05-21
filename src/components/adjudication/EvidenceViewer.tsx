import { FileCode } from 'lucide-react';
import { AdjudicationTrace, IntentRecord } from '../../types';

export function EvidenceViewer({ intent, trace }: { intent: IntentRecord | null, trace: AdjudicationTrace | null }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 bg-[#FFFFFF] dark:bg-[#1A1D27] rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1D27]/50 relative">
        <FileCode className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Evidence Retrieval</span>
      </div>
      <div className="flex-1 bg-gray-50 dark:bg-[#0F1117] p-0 relative h-full">
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Evidence URL</label>
            <p className="text-sm font-mono text-[#2563EB] dark:text-[#3B82F6] break-all">{intent?.evidence_url || 'Not available from contract'}</p>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Evidence Summary</label>
            {trace?.evidence_summary ? (
              <pre className="mt-1 p-3 text-xs font-mono text-gray-700 dark:text-gray-300 bg-[#FFFFFF] dark:bg-[#1A1D27] border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {trace.evidence_summary}
              </pre>
            ) : (
               <div className="mt-1 text-sm text-gray-400 dark:text-gray-500 italic">Not available from contract</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
