import { useEffect, useState } from 'react';
import { IntentForm } from '../components/intent/IntentForm';
import { IntentList } from '../components/intent/IntentList';
import { IntentRecord } from '../types';
import { getIntent, getIntentCount } from '../lib/contractClient';
import { RefreshCw, Loader2 } from 'lucide-react';

export function Dashboard() {
  const [intents, setIntents] = useState<IntentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntents = async () => {
    setLoading(true);
    setError(null);
    try {
      const count = await getIntentCount();
      const data: IntentRecord[] = [];
      for (let i = 0; i < count; i++) {
        const intent = await getIntent(i);
        if (intent) {
          data.push(intent);
        }
      }
      data.sort((a,b) => b.submitted_at - a.submitted_at);
      setIntents(data);
    } catch (err: any) {
      setError(err.message || 'RPC Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#111827] dark:text-[#F9FAFB]">Adjudication Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor intelligent contract resolution states. Consensus and validator coordination handled natively.
          </p>
        </div>
        <button 
          onClick={fetchIntents}
          className="p-2 border border-gray-200 dark:border-gray-800 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1A1D27] transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm">
          Error: {error}. Check VITE_GENLAYER_NETWORK and VITE_CONTRACT_ADDRESS.
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <IntentForm onSuccess={fetchIntents} />
        </div>
        <div className="lg:col-span-2">
           {loading && intents.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-gray-500 border border-gray-200 dark:border-gray-800 rounded-xl bg-[#FFFFFF] dark:bg-[#1A1D27]/50">
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
                <span className="text-sm">Loading from contract...</span>
              </div>
           ) : (
             <IntentList intents={intents} />
           )}
        </div>
      </div>
    </div>
  );
}
