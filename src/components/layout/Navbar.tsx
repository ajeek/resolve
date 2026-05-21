import { Link } from 'react-router-dom';
import { Diamond } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { WalletButton } from '../wallet/WalletButton';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Diamond className="w-6 h-6 text-blue-600 dark:text-blue-500 fill-blue-600/20" />
          <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white">ResolveLayer</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hidden sm:inline-block border border-slate-200 dark:border-slate-700">GenVM Protocol</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link to="/explorer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Traces</Link>
          </nav>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block" />
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
