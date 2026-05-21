import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Activity, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export function Landing() {
  return (
    <div className="flex flex-col gap-24 py-12">
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium tracking-wide mb-6 border border-blue-100 dark:border-blue-800/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            GenVM Optimistic Democracy Live
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-tight">
            Decentralized Intent Adjudication Protocol
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            ResolveLayer converts natural language intents into verifiable settlement outcomes using GenLayer's nondeterministic execution and multi-validator consensus.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow"
          >
            Launch ResolveLayer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Equivalence Consensus</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Outputs are interpreted under the equivalence principle, absorbing nondeterministic variance across independent reasoning nodes.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">GenVM Nondeterminism</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Native support for web rendering and prompt execution inside the validator layer, without external oracles.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center border border-amber-100 dark:border-amber-800/50">
            <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Immutable Settlement</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Consensus outcomes are locked as deterministic final states anchored on the GenLayer EVM-compatible chain.
          </p>
        </div>
      </section>
    </div>
  );
}
