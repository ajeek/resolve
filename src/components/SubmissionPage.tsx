import { useState } from 'react';
import { useStore } from '../store';
import { ArrowLeft } from 'lucide-react';

export function SubmissionPage({ onNavigate }: { onNavigate: (view: 'dashboard') => void }) {
  const { submitIntent } = useStore();
  const [nl, setNl] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nl.trim() || !url.trim()) return;
    submitIntent(nl, url);
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
      <button 
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 self-start transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div>
        <h1 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">Submit New Intent</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Initiate adjudication via optimistic democracy</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Natural Language Intent</label>
          <textarea 
            value={nl}
            onChange={e => setNl(e.target.value)}
            placeholder="e.g. Verify delivery of package #20392 to resolving oracle."
            className="w-full h-24 p-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Evidence URL</label>
          <input 
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://api.example.com/data"
            className="w-full p-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
            required
          />
        </div>

        <button 
          type="submit"
          className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Submit to Consensus
        </button>
      </form>
    </div>
  );
}
