import { create } from 'zustand';
import { StoreState } from '../types';

const initialState = {
  intents: {
    0: {
      id: 0,
      natural_language: "Verify delivery of package #20392 to resolving oracle.",
      evidence_url: "https://api.shipping.example/v1/status/20392",
      submitter_address: "0xABCDEF123456",
      timestamp: Date.now() / 1000 - 3600,
      status: 'SETTLED' as const
    },
    1: {
      id: 1,
      natural_language: "Confirm that temperatures remained below 20C during transit for batch #98.",
      evidence_url: "https://sensors.example/iot/batch/98",
      submitter_address: "0xABCDEF123456",
      timestamp: Date.now() / 1000 - 1800,
      status: 'INTENT_SUBMITTED' as const
    }
  },
  evidences: {
    0: `{"status": "DELIVERED", "timestamp": 1718042918, "signatory": "OracleNode_X1"}`
  },
  consensus_traces: {
    0: {
      classification: "FULFILLED",
      confidence: "HIGH",
      reasoning: "Delivery confirmed by oracle signature."
    }
  },
  outcomes: {
    0: {
      intent_id: 0,
      final_decision: "FULFILLED",
      locked: true
    }
  },
  audit_trail: [
    {
      intent_id: 0,
      classification: "FULFILLED",
      evidence_snippet: `{"status": "DELIVERED", "times`,
      timestamp: Date.now() / 1000 - 3500
    }
  ],
  walletAddress: null,
  theme: 'system' as const,
};

export const useStore = create<StoreState>((set) => ({
  ...initialState,
  
  submitIntent: (nl, url) => set((prev) => {
    const nextId = Object.keys(prev.intents).length;
    return {
      intents: {
        ...prev.intents,
        [nextId]: {
          id: nextId,
          natural_language: nl,
          evidence_url: url,
          submitter_address: prev.walletAddress || "0x1234567890",
          timestamp: Math.floor(Date.now() / 1000),
          status: 'INTENT_SUBMITTED'
        }
      }
    };
  }),

  adjudicateIntent: (id) => {
    set(prev => ({
      intents: {
        ...prev.intents,
        [id]: { ...prev.intents[id], status: 'ADJUDICATING' }
      }
    }));

    setTimeout(() => {
      set(prev => {
        const intent = prev.intents[id];
        if (!intent) return prev;
        
        const success = Math.random() > 0.3;
        const mockRawEvidence = `Fetched from ${intent.evidence_url}:\n{"success": ${success}, "observed": true, "timestamp": ${Date.now()}}`;
        const classification = success ? "FULFILLED" : "UNFULFILLED";
        const reasoning = success ? "Conditions met per source data." : "Conditions missing in source data.";

        if (!success) {
          return {
             ...prev,
             evidences: { ...prev.evidences, [id]: mockRawEvidence },
             intents: {
               ...prev.intents,
               [id]: { ...intent, status: 'FAILED' }
             }
          }
        }

        return {
          intents: {
            ...prev.intents,
            [id]: { ...intent, status: 'SETTLED' }
          },
          evidences: {
            ...prev.evidences,
            [id]: mockRawEvidence
          },
          consensus_traces: {
            ...prev.consensus_traces,
            [id]: { classification, confidence: "HIGH", reasoning }
          },
          outcomes: {
            ...prev.outcomes,
            [id]: { intent_id: id, final_decision: classification, locked: true }
          },
          audit_trail: [
            ...prev.audit_trail,
            {
              intent_id: id,
              classification,
              evidence_snippet: mockRawEvidence.substring(0, 50),
              timestamp: Math.floor(Date.now() / 1000)
            }
          ]
        };
      });
    }, 2000);
  },

  setWalletAddress: (address) => set({ walletAddress: address }),
  setTheme: (theme) => set({ theme }),
}));
