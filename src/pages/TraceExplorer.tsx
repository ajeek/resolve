import { useEffect, useState } from 'react';
import { GitCommit, Activity, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTraceCount, getTrace } from '../lib/contractClient';
import { AdjudicationTrace } from '../types';

export function TraceExplorer() {
  const [logs, setLogs] = useState<AdjudicationTrace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchTraces = async () => {
      try {
        const count = await getTraceCount();
        const data: AdjudicationTrace[] = [];
        for (let i = 0; i < count; i++) {
          const trace = await getTrace(i);
          if (trace) data.push(trace);
        }
        data.sort((a,b) => b.adjudicated_at - a.adjudicated_at);
        if (mounted) setLogs(data);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load traces");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTraces();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[#111827] dark:text-[#F9FAFB]">Protocol Trace Explorer</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Audit log of all adjudication events from contract</p>
      </div>

      {error ? (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm">
          RPC Error: {error}
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mb-4" />
          <p className="text-sm">Fetching traces from contract...</p>
        </div>
      ) : logs.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-12 py-20 border border-gray-200 dark:border-gray-800 bg-[#FFFFFF] dark:bg-[#1A1D27]/50 rounded-xl text-center">
            <Activity className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No traces available on the network yet.</p>
         </div>
      ) : (
        <div className="flex flex-col gap-4">
          {logs.map((log, i) => (
             <div key={i} className="flex flex-col gap-3 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-[#FFFFFF] dark:bg-[#1A1D27] shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <GitCommit className="w-4 h-4 text-gray-400" />
                   <span className="text-[11px] font-mono text-gray-500">{new Date(log.adjudicated_at * 1000).toLocaleString()}</span>
                 </div>
                 <Link to={`/intent/${log.intent_id}`} className="text-xs font-medium text-[#2563EB] dark:text-[#3B82F6] hover:underline">
                    Intent #{log.intent_id}
                 </Link>
               </div>
               <div>
                  <h4 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]">
                    Classification: <span className="font-mono text-[#2563EB] dark:text-[#3B82F6]">{log.leader_classification}</span>
                  </h4>
                  <div className="mt-2 text-[11px] font-mono text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-[#0F1117] border border-gray-100 dark:border-gray-800 rounded">
                    Evidence summary: {log.evidence_summary}
                  </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
