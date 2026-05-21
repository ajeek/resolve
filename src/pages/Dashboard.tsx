import { IntentForm } from '../components/intent/IntentForm';
import { IntentList } from '../components/intent/IntentList';

export function Dashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Adjudication Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor intelligent contract resolution states. Consensus and validator coordination handled natively by GenLayer Optimistic Democracy.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <IntentForm />
        </div>
        <div className="lg:col-span-2">
           <IntentList />
        </div>
      </div>
    </div>
  );
}
