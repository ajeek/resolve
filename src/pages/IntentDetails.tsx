import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Fingerprint, Play } from 'lucide-react';
import { LifecycleVisualizer } from '../components/status/LifecycleVisualizer';
import { EvidenceViewer } from '../components/adjudication/EvidenceViewer';
import { ConsensusPanel } from '../components/adjudication/ConsensusPanel';
import { OutcomePanel } from '../components/adjudication/OutcomePanel';
import { TraceTimeline } from '../components/traces/TraceTimeline';

export function IntentDetails() {
  const { id } = useParams();
  const intentId = Number(id);
  
  const { intents, evidences, consensus_traces, outcomes, audit_trail, adjudicateIntent } = useStore();
  
  const intent = intents[intentId];
  const evidence = evidences[intentId];
  const consensus = consensus_traces[intentId];
  const outcome = outcomes[intentId];
  const auditLogs = audit_trail.filter(a => a.intent_id === intentId).sort((a,b) => b.timestamp - a.timestamp);

  if (!intent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-medium mb-2">Intent Not Found</h2>
        <Link to="/dashboard" className="text-blue-600 hover:underline text-sm hover:text-blue-500">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <Link 
          to="/dashboard"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        {intent.status === 'INTENT_SUBMITTED' && (
          <button 
            onClick={() => adjudicateIntent(intentId)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-900 dark:bg-blue-600 dark:border-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Play className="w-4 h-4" />
            Adjudicate Now
          </button>
        )}
      </div>

      <LifecycleVisualizer currentStatus={intent.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <Fingerprint className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Intent Record</span>
            </div>
            <div className="p-5 flex flex-col gap-5">
              <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed max-w-2xl">
                {intent.natural_language}
              </p>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
                  <p className="text-sm font-mono mt-1 text-slate-800 dark:text-slate-300">{intent.status}</p>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</label>
                  <p className="text-sm font-mono mt-1 text-slate-800 dark:text-slate-300">{new Date(intent.timestamp * 1000).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Submitter Address</label>
                  <p className="text-sm font-mono mt-1 text-slate-500 dark:text-slate-400 break-all">{intent.submitter_address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px]">
            <EvidenceViewer evidence={evidence} />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <ConsensusPanel record={consensus} />
          
          <div className="h-[200px]">
            <OutcomePanel outcome={outcome} />
          </div>

          <TraceTimeline logs={auditLogs} />
        </div>
      </div>
    </div>
  );
}
