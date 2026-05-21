export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-auto bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>ResolveLayer System</span>
          <span>•</span>
          <span>Powered by GenLayer Optimistic Democracy</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Testnet Explorer</a>
        </div>
      </div>
    </footer>
  );
}
