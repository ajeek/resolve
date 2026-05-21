import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Activity, Layers } from 'lucide-react';

export function Landing() {
  return (
    <div className="flex flex-col gap-24 py-12 animate-in fade-in duration-700">
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#3B82F6]/10 text-[#2563EB] dark:text-[#3B82F6] text-xs font-medium tracking-wide mb-6 border border-blue-100 dark:border-[#3B82F6]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B82F6]"></span>
            </span>
            GenVM Optimistic Democracy Live
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#111827] dark:text-[#F9FAFB] leading-tight">
            Decentralized Intent Adjudication Protocol
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            ResolveLayer converts natural language intents into verifiable settlement outcomes using GenLayer's nondeterministic execution and multi-validator consensus.
          </p>
        </div>
        <div>
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] dark:bg-[#3B82F6] hover:bg-blue-700 dark:hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-sm"
          >
            Launch ResolveLayer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1A1D27] border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-base font-semibold text-[#111827] dark:text-[#F9FAFB]">Equivalence Consensus</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Outputs are interpreted under the equivalence principle, absorbing nondeterministic variance across independent reasoning nodes.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1A1D27] border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-[#3B82F6]/10 flex items-center justify-center border border-blue-100 dark:border-[#3B82F6]/20">
            <Layers className="w-5 h-5 text-[#2563EB] dark:text-[#3B82F6]" />
          </div>
          <h3 className="text-base font-semibold text-[#111827] dark:text-[#F9FAFB]">GenVM Nondeterminism</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Native support for web rendering and prompt execution inside the validator layer, without external oracles.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1A1D27] border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center border border-amber-100 dark:border-amber-800/50">
            <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-[#111827] dark:text-[#F9FAFB]">Immutable Settlement</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Consensus outcomes are locked as deterministic final states anchored on the GenLayer EVM-compatible chain.
          </p>
        </div>
      </section>
    </div>
  );
}
