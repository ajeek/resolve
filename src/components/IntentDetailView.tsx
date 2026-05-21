import { useStore } from '../store';
import { ArrowLeft, GitCommit, FileCode, CheckCircle2, AlertCircle, Play, Fingerprint } from 'lucide-react';
import clsx from 'clsx';

export function IntentDetailView({ intentId, onNavigate }: { intentId: number, onNavigate: (view: 'dashboard') => void }) {
  const { state, adjudicateIntent } = useStore();
  const intent = state.intents[intentId];
  const evidence = state.evidences[intentId];
  const consensus = state.consensus_traces[intentId];
  const outcome = state.outcomes[intentId];
  const auditLogs = state.audit_trail.filter(a => a.intent_id === intentId).sort((a,b) => b.timestamp - a.timestamp);

  if (!intent) return null;

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 pb-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        {intent.status === 'INTENT_SUBMITTED' && (
          <button 
            onClick={() => adjudicateIntent(intentId)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Adjudicate Now
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (State, Evidence) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* A. Intent Panel */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
               <Fingerprint className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Intent Record</span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {intent.natural_language}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Status</label>
                  <p className="text-sm font-mono mt-1 text-slate-700 dark:text-slate-300">{intent.status}</p>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Timestamp</label>
                  <p className="text-sm font-mono mt-1 text-slate-700 dark:text-slate-300">{new Date(intent.timestamp * 1000).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Submitter Address</label>
                  <p className="text-sm font-mono mt-1 text-slate-700 dark:text-slate-300 break-all">{intent.submitter_address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* B. Evidence Panel */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
               <FileCode className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Evidence Retrieval</span>
               <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 rounded px-2 py-0.5">Validator-specific view</span>
            </div>
            <div className="p-0">
               {evidence ? (
                 <pre className="p-4 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#070a13] overflow-x-auto whitespace-pre-wrap">
                   {evidence.length > 4000 ? evidence.substring(0, 4000) + '... (truncated)' : evidence}
                 </pre>
               ) : (
                 <div className="p-8 text-center text-sm text-slate-400 dark:text-slate-500 italic">
                   Evidence pending adjudication...
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Column (Consensus, Outcome, Audit) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* C. Consensus Panel */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
               <CheckCircle2 className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Consensus Trace</span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              {!consensus ? (
                 <div className="text-sm text-slate-400 dark:text-slate-500 italic">Awaiting equivalence check...</div>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Classification</label>
                    <p className={clsx(
                      "text-sm font-semibold font-mono mt-1",
                      consensus.classification === 'FULFILLED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    )}>
                      {consensus.classification}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Confidence</label>
                    <p className="text-sm font-mono mt-1 text-slate-700 dark:text-slate-300">{consensus.confidence}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Reasoning</label>
                    <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{consensus.reasoning}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* D. Outcome Panel */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
               <ShieldCheck className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Settlement Outcome</span>
               {outcome?.locked && (
                 <span className="ml-auto text-[10px] font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded px-2 py-0.5 border border-blue-200 dark:border-blue-800">LOCKED</span>
               )}
            </div>
            <div className="p-0">
               {!outcome ? (
                 <div className="p-5 text-sm text-slate-400 dark:text-slate-500 italic border-t border-transparent">No outcome settled.</div>
               ) : (
                 <pre className="p-4 text-xs font-mono text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-[#070a13] overflow-x-auto whitespace-pre-wrap">
{JSON.stringify({ intent_id: outcome.intent_id, final_decision: outcome.final_decision, locked: outcome.locked }, null, 2)}
                 </pre>
               )}
            </div>
          </div>

          {/* E. Audit Trail Panel */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
               <GitCommit className="w-4 h-4 text-slate-400" />
               <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Audit Timeline</span>
            </div>
            <div className="p-5">
               {auditLogs.length === 0 ? (
                 <div className="text-sm text-slate-400 dark:text-slate-500 italic">No traces available.</div>
               ) : (
                 <div className="relative border-l border-slate-200 dark:border-slate-800 ml-2 pl-4 flex flex-col gap-6">
                   {auditLogs.map((log, i) => (
                     <div key={i} className="relative">
                       <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900" />
                       <div className="text-[11px] font-mono text-slate-400 mb-1">{new Date(log.timestamp * 1000).toLocaleString()}</div>
                       <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                         Decision: <span className="text-slate-900 dark:text-white font-mono font-medium">{log.classification}</span>
                       </div>
                       <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded overflow-hidden text-ellipsis">
                         {log.evidence_snippet}...
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
// Using lucide-react icons conditionally inside the file
import { ShieldCheck } from 'lucide-react';
