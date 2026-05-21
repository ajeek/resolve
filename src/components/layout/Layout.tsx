import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-100 dark:selection:bg-blue-900/50">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
