import { Link } from 'react-router-dom';
import { useStore } from '../../store';
import { StatusBadge } from '../status/StatusBadge';
import { ArrowRight, FileCheck } from 'lucide-react';

export function IntentList() {
  const { intents } = useStore();
  const sortedIntents = Object.values(intents).sort((a, b) => b.timestamp - a.timestamp);

  if (sortedIntents.length === 0) {
    return (
      <div className="text-center py-12 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50">
        <p className="text-slate-500 dark:text-slate-400 text-sm">No intents submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sortedIntents.map(intent => (
        <Link 
          key={intent.id}
          to={`/intent/${intent.id}`}
          className="group block p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="mt-0.5">
                <FileCheck className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug pr-4">
                  {intent.natural_language.length > 80 ? intent.natural_language.substring(0, 80) + '...' : intent.natural_language}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500 font-mono">
                  <span>ID: {intent.id}</span>
                  <span>•</span>
                  <span>{new Date(intent.timestamp * 1000).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <StatusBadge status={intent.status} />
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
