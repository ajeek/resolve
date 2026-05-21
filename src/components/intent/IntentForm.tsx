import { useState } from 'react';
import { submitIntent } from '../../lib/contractClient';
import { useStore } from '../../store';
import { Loader2 } from 'lucide-react';

export function IntentForm({ onSuccess }: { onSuccess: () => void }) {
  const { walletAddress } = useStore();
  const [nl, setNl] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      alert("Connect wallet first");
      return;
    }
    if (!nl.trim() || !url.trim()) return;
    
    setLoading(true);
    setTxHash(null);
    try {
      const hash = await submitIntent(nl, url, walletAddress);
      setTxHash(hash || "Transaction submitted");
      setNl('');
      setUrl('');
      onSuccess();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-gray-200 dark:border-gray-800 bg-[#FFFFFF] dark:bg-[#1A1D27] rounded-xl p-5 shadow-sm">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] uppercase tracking-wider">Submit Intent</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Initiate adjudication via optimistic democracy</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Natural Language Intent</label>
          <textarea 
            value={nl}
            onChange={e => setNl(e.target.value)}
            disabled={loading}
            placeholder="e.g. Verify delivery of package #20392 to resolving oracle."
            className="w-full h-20 p-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0F1117] text-[#111827] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] dark:focus:ring-[#3B82F6] dark:focus:border-[#3B82F6] resize-none transition-all disabled:opacity-50"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Evidence URL</label>
          <input 
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            disabled={loading}
            placeholder="https://api.example.com/data"
            className="w-full p-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0F1117] text-[#111827] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] dark:focus:ring-[#3B82F6] dark:focus:border-[#3B82F6] transition-all font-mono disabled:opacity-50"
            required
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-2.5 bg-[#111827] dark:bg-[#2563EB] hover:bg-gray-800 dark:hover:bg-[#3B82F6] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit to Consensus
        </button>
      </form>
      {txHash && (
         <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded-lg font-mono">
           Transaction submitted — waiting for confirmation.
           <br/>
           <span className="truncate block mt-1">Hash: {txHash}</span>
         </div>
      )}
    </div>
  );
}
