import { IntentStatus } from '../../types';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

const stages = ['INTENT_SUBMITTED', 'ADJUDICATING', 'SETTLED'];

export function LifecycleVisualizer({ currentStatus }: { currentStatus: IntentStatus }) {
  const isFailed = currentStatus === 'FAILED';
  const displayStages = isFailed ? ['INTENT_SUBMITTED', 'ADJUDICATING', 'FAILED'] : stages;
  
  const getStageIndex = (status: string) => displayStages.indexOf(status);
  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="flex items-center w-full justify-between mb-8 px-4">
      {displayStages.map((stage, idx) => {
        const isPast = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        
        return (
          <div key={stage} className="flex items-center w-full relative">
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                isPast ? "bg-slate-900 border-slate-900 dark:bg-blue-600 dark:border-blue-600 text-white" : "",
                isCurrent && !isFailed ? "bg-white dark:bg-slate-900 border-slate-900 dark:border-blue-500 text-slate-900 dark:text-blue-400" : "",
                isCurrent && isFailed ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400" : "",
                !isPast && !isCurrent ? "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400" : ""
              )}>
                {isPast ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={cn(
                "text-[10px] uppercase tracking-wider font-semibold absolute top-10 whitespace-nowrap",
                isCurrent || isPast ? "text-slate-900 dark:text-slate-200" : "text-slate-400"
              )}>
                {stage.replace('_', ' ')}
              </span>
            </div>
            
            {idx < displayStages.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2",
                isPast ? "bg-slate-900 dark:bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
