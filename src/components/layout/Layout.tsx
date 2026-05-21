import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F1117] font-sans text-[#111827] dark:text-[#F9FAFB] flex flex-col transition-colors selection:bg-blue-100 dark:selection:bg-[#3B82F6]/30">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
