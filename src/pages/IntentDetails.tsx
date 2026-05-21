import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getIntent } from '../lib/contractClient';

type Props = {
  intent: {
    natural_language?: string;
    status?: string;
    submitted_at?: number;
    settled_at?: number;
    submitter?: string;
  };
};

const formatTimestamp = (ts?: number) => {
  if (!ts || ts === 0) return "—";

  const date = new Date(ts * 1000);

  if (isNaN(date.getTime())) return "—";

  return date.toLocaleString();
};

const safeText = (value?: string) => value?.trim() || "—";

const formatStatus = (status?: string) => {
  if (!status) return "—";

  switch (status.toLowerCase()) {
    case "pending":
      return "⏳ Pending";
    case "adjudicated":
      return "⚖️ Adjudicated";
    case "settled":
      return "✅ Settled";
    case "rejected":
      return "❌ Rejected";
    default:
      return status;
  }
};

function IntentView({ intent }: Props) {
  return (
    <div className="space-y-3">

      <div>
        <p className="text-sm text-gray-500">Intent</p>
        <p>{safeText(intent.natural_language)}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Status</p>
        <p>{formatStatus(intent.status)}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Submitted At</p>
        <p>{formatTimestamp(intent.submitted_at)}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Submitter</p>
        <p className="font-mono text-xs">
          {safeText(intent.submitter)}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Settled At</p>
        <p>{formatTimestamp(intent.settled_at)}</p>
      </div>

    </div>
  );
}

export function IntentDetails() {
  const { id } = useParams();
  const intentId = Number(id);
  
  const [intent, setIntent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const intentData = await getIntent(intentId);
        if (mounted) {
          setIntent(intentData);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'RPC Error');
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [intentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mb-4" />
        <p className="text-sm">Fetching from contract...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm">
          RPC Error: {error}
        </div>
        <Link to="/dashboard" className="text-[#2563EB] dark:text-[#3B82F6] hover:underline text-sm">Return to Dashboard</Link>
      </div>
    );
  }

  if (!intent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-medium mb-2 text-[#111827] dark:text-[#F9FAFB]">Intent Not Found</h2>
        <Link to="/dashboard" className="text-[#2563EB] dark:text-[#3B82F6] hover:underline text-sm">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in duration-500 pb-16 pt-8">
      <Link 
        to="/dashboard"
        className="text-[#2563EB] dark:text-[#3B82F6] hover:underline text-sm inline-block mb-6"
      >
        &larr; Back to Dashboard
      </Link>
      
      <div className="bg-white dark:bg-[#1A1D27] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">Intent #{intentId}</h2>
        <IntentView intent={intent} />
      </div>
    </div>
  );
}