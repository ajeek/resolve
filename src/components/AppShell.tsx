import { useState } from 'react';
import { Dashboard } from './Dashboard';
import { SubmissionPage } from './SubmissionPage';
import { IntentDetailView } from './IntentDetailView';
import { ThemeToggle } from './ThemeToggle';
import { Diamond } from 'lucide-react';

export default function AppShell() {
  const [view, setView] = useState<'dashboard' | 'submit' | 'detail'>('dashboard');
  const [activeIntentId, setActiveIntentId] = useState<number | undefined>();

  const navigate = (newView: 'dashboard' | 'submit' | 'detail', intentId?: number) => {
    setView(newView);
    if (intentId !== undefined) setActiveIntentId(intentId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-100 dark:selection:bg-blue-900">
      
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('dashboard')}>
            <Diamond className="w-6 h-6 text-blue-600 dark:text-blue-500 fill-blue-600/20" />
            <span className="font-semibold text-lg tracking-tight">ResolveLayer</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hidden sm:inline-block">GenVM Protocol</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {view === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {view === 'submit' && <SubmissionPage onNavigate={navigate} />}
        {view === 'detail' && activeIntentId !== undefined && <IntentDetailView intentId={activeIntentId} onNavigate={navigate} />}
      </main>

    </div>
  );
}
