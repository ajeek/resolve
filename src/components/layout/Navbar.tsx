import { Link } from 'react-router-dom';
import { Diamond } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { WalletButton } from '../wallet/WalletButton';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-[#FFFFFF]/80 dark:bg-[#0F1117]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Diamond className="w-6 h-6 text-[#2563EB] dark:text-[#3B82F6] fill-[#2563EB]/20" />
          <span className="font-semibold text-lg tracking-tight text-[#111827] dark:text-[#F9FAFB]">ResolveLayer</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 hidden sm:inline-block border border-gray-200 dark:border-gray-700">GenVM Protocol</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link to="/dashboard" className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors">Dashboard</Link>
            <Link to="/explorer" className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors">Traces</Link>
          </nav>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block" />
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
