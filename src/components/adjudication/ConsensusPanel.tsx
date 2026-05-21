import { CheckCircle2 } from 'lucide-react';
import { IntentRecord, OutcomeObject } from '../../types';

export function ConsensusPanel({ intent }: { intent: IntentRecord | null }) {
  if (!intent) return null;

  let parsedOutcome: OutcomeObject | null = null;
  let parseError = false;

  if (intent.outcome && intent.outcome !== "") {
    try {
      parsedOutcome = JSON.parse(intent.outcome);
    } catch {
      parseError = true;
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 bg-[#FFFFFF] dark:bg-[#1A1D27] rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1D27]/50">
        <CheckCircle2 className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Consensus Outcome</span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {!intent.outcome || intent.outcome === "" ? (
          <div className="text-sm text-gray-400 dark:text-gray-500 italic">Not yet available</div>
        ) : parseError ? (
          <div>
            <div className="text-sm text-red-500 mb-2">Outcome malformed — raw value available from contract</div>
            <pre className="p-3 text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0F1117] border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {intent.outcome}
            </pre>
          </div>
        ) : parsedOutcome ? (
          <>
            <div>
              <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Classification</label>
              <p className="text-sm font-semibold font-mono mt-1 text-[#2563EB] dark:text-[#3B82F6]">
                {parsedOutcome.classification}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</label>
              <p className="text-sm font-mono mt-1 text-[#111827] dark:text-[#F9FAFB]">{parsedOutcome.confidence}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reasoning</label>
              <p className="text-sm mt-1 text-[#111827] dark:text-[#F9FAFB]">{parsedOutcome.reasoning}</p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
