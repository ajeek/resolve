export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto bg-[#FAFAFA] dark:bg-[#0F1117]">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span>ResolveLayer System</span>
          <span>•</span>
          <span>Powered by GenLayer Optimistic Democracy</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors">Documentation</a>
          <a href="#" className="hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors">Testnet Explorer</a>
        </div>
      </div>
    </footer>
  );
}
