import { useState } from 'react';
import { useStore } from '../../store';

export function IntentForm() {
  const { submitIntent } = useStore();
  const [nl, setNl] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nl.trim() || !url.trim()) return;
    submitIntent(nl, url);
    setNl('');
    setUrl('');
  };

  return (
    <div className="flex flex-col gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Submit Intent</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Initiate adjudication via optimistic democracy</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Natural Language Intent</label>
          <textarea 
            value={nl}
            onChange={e => setNl(e.target.value)}
            placeholder="e.g. Verify delivery of package #20392 to resolving oracle."
            className="w-full h-20 p-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Evidence URL</label>
          <input 
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://api.example.com/data"
            className="w-full p-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
            required
          />
        </div>
        <button 
          type="submit"
          className="mt-2 w-full py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Submit to Consensus
        </button>
      </form>
    </div>
  );
}
