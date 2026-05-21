import { useStore } from '../store';
import { IntentCard } from './IntentCard';
import { Plus } from 'lucide-react';

export function Dashboard({ onNavigate }: { onNavigate: (view: 'dashboard' | 'submit' | 'detail', id?: number) => void }) {
  const { state } = useStore();
  const intents = Object.values(state.intents).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">Active Adjudications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor intelligent contract resolution states</p>
        </div>
        <button 
          onClick={() => onNavigate('submit')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Intent
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {intents.length === 0 ? (
          <div className="text-center py-12 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No intents submitted yet.</p>
          </div>
        ) : (
          intents.map(intent => (
            <IntentCard key={intent.id} intent={intent} onClick={() => onNavigate('detail', intent.id)} />
          ))
        )}
      </div>
    </div>
  );
}
