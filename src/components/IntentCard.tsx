import { IntentRecord } from '../types';
import { PlayCircle, ShieldCheck, ShieldAlert, FileSearch, ArrowRight } from 'lucide-react';

export function IntentCard({ intent, onClick }: { intent: IntentRecord; onClick: () => void }) {
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'INTENT_SUBMITTED':
        return <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Submitted</span>;
      case 'ADJUDICATING':
        return <span className="px-2 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse">Adjudicating</span>;
      case 'SETTLED':
        return <span className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Settled</span>;
      case 'FAILED':
        return <span className="px-2 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">Failed</span>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'INTENT_SUBMITTED': return <FileSearch className="w-5 h-5 text-blue-500" />;
      case 'ADJUDICATING': return <PlayCircle className="w-5 h-5 text-amber-500" />;
      case 'SETTLED': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'FAILED': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all flex items-start justify-between"
    >
      <div className="flex gap-4">
        <div className="mt-1">
          {getStatusIcon(intent.status)}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 leading-snug">
            {intent.natural_language.length > 80 ? intent.natural_language.substring(0, 80) + '...' : intent.natural_language}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>ID: {intent.id}</span>
            <span>•</span>
            <span>{new Date(intent.timestamp * 1000).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        {getStatusBadge(intent.status)}
        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
      </div>
    </div>
  );
}
