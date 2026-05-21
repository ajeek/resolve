import { Link } from 'react-router-dom';
import { StatusBadge } from '../status/StatusBadge';
import { ArrowRight, FileCheck } from 'lucide-react';
import { IntentRecord } from '../../types';

export function IntentList({ intents }: { intents: IntentRecord[] }) {
  if (intents.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-xl bg-[#FFFFFF] dark:bg-[#1A1D27]/50">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No intents available from contract.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {intents.map(intent => (
        <Link 
          key={intent.intent_id}
          to={`/intent/${intent.intent_id}`}
          className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-[#FFFFFF] dark:bg-[#1A1D27] hover:border-gray-300 dark:hover:border-gray-700 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="mt-0.5">
                <FileCheck className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB] leading-snug pr-4">
                  {intent.natural_language.length > 80 ? intent.natural_language.substring(0, 80) + '...' : intent.natural_language}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 font-mono">
                  <span>ID: {intent.intent_id}</span>
                  <span>•</span>
                  <span>{new Date(intent.submitted_at * 1000).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <StatusBadge status={intent.status} />
              <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
