import { cn } from '../../lib/utils';
import { IntentStatus } from '../../types';

export function StatusBadge({ status }: { status: IntentStatus }) {
  const styles = {
    INTENT_SUBMITTED: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
    ADJUDICATING: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 animate-pulse",
    SETTLED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
    FAILED: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
  };

  const labels = {
    INTENT_SUBMITTED: "Submitted",
    ADJUDICATING: "Adjudicating",
    SETTLED: "Settled",
    FAILED: "Failed"
  };

  return (
    <span className={cn("px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md", styles[status])}>
      {labels[status]}
    </span>
  );
}
