import { IntentRecord, AdjudicationTrace } from '../types';

const NETWORK_URL = import.meta.env.VITE_GENLAYER_NETWORK || 'https://rpc-bradbury.genlayer.com';
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  throw new Error("Missing VITE_CONTRACT_ADDRESS");
}

/* -----------------------------
   Helpers
------------------------------*/

function escapeString(str: string) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

/* -----------------------------
   Single RPC call
------------------------------*/

async function rpcCall(method: string, params: any[] = []) {
  const res = await fetch(NETWORK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    })
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error));
  }

  return data.result;
}

/* -----------------------------
   🔥 BATCH RPC CALL (NEW)
------------------------------*/

async function rpcBatchCall(calls: { method: string; params: any[] }[]) {
  const payload = calls.map((c, i) => ({
    jsonrpc: '2.0',
    id: i,
    method: c.method,
    params: c.params,
  }));

  const res = await fetch(NETWORK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Batch RPC failed: invalid response");
  }

  return data.map(d => {
    if (d.error) throw new Error(d.error.message || JSON.stringify(d.error));
    return d.result;
  });
}

/* -----------------------------
   Core contract reads
------------------------------*/

export async function getIntent(intentId: number): Promise<IntentRecord> {
  return rpcCall('gen_call', [
    {
      to: CONTRACT_ADDRESS,
      data: `get_intent(${intentId})`
    },
    'latest'
  ]);
}

export async function getIntentCount(): Promise<number> {
  const result = await rpcCall('gen_call', [
    { to: CONTRACT_ADDRESS, data: `get_intent_count()` },
    'latest'
  ]);

  return Number(result);
}

/* -----------------------------
   🚀 BATCHED TRACE FETCH
------------------------------*/

export async function getTrace(traceId: number): Promise<AdjudicationTrace> {
  const result = await rpcCall('gen_call', [
    { to: CONTRACT_ADDRESS, data: `get_trace(${traceId})` },
    'latest'
  ]);

  return result;
}

export async function getTraceCount(): Promise<number> {
  const result = await rpcCall('gen_call', [
    { to: CONTRACT_ADDRESS, data: `get_trace_count()` },
    'latest'
  ]);

  return Number(result);
}

/* -----------------------------
   🚀 FIXED + FAST VERSION
   (parallel + batched)
------------------------------*/

export async function getTracesForIntent(intentId: number): Promise<AdjudicationTrace[]> {
  const count = await getTraceCount();

  // Batch size controls RPC pressure
  const BATCH_SIZE = 20;

  const batches: Promise<any[]>[] = [];

  for (let i = 0; i < count; i += BATCH_SIZE) {
    const slice = Array.from(
      { length: Math.min(BATCH_SIZE, count - i) },
      (_, j) => i + j
    );

    batches.push(
      rpcBatchCall(
        slice.map(id => ({
          method: 'gen_call',
          params: [
            {
              to: CONTRACT_ADDRESS,
              data: `get_trace(${id})`
            },
            'latest'
          ]
        }))
      )
    );
  }

  const results = await Promise.all(batches);
  const traces = results.flat();

  return (traces as AdjudicationTrace[])
    .filter(t => t.intent_id === intentId)
    .sort((a, b) => b.adjudicated_at - a.adjudicated_at);
}

/* -----------------------------
   Writes (fixed escaping)
------------------------------*/

export async function submitIntent(
  nl: string,
  url: string,
  submitter: string
): Promise<string> {

  return rpcCall('gen_sendTransaction', [
    {
      from: submitter,
      to: CONTRACT_ADDRESS,
      data: `submit_intent("${escapeString(nl)}", "${escapeString(url)}")`
    }
  ]);
}

export async function adjudicateIntent(
  intentId: number,
  submitter: string
): Promise<string> {

  return rpcCall('gen_sendTransaction', [
    {
      from: submitter,
      to: CONTRACT_ADDRESS,
      data: `adjudicate_intent(${intentId})`
    }
  ]);
}