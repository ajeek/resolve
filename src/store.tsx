import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  IntentRecord, 
  ConsensusRecord, 
  OutcomeObject, 
  AuditRecord, 
  UIState,
  IntentStatus
} from './types';

const initialState: UIState = {
  intents: {
    0: {
      id: 0,
      natural_language: "Verify delivery of package #20392 to resolving oracle.",
      evidence_url: "https://api.shipping.example/v1/status/20392",
      submitter_address: "0xABCDEF123456",
      timestamp: Date.now() / 1000 - 3600,
      status: 'SETTLED'
    },
    1: {
      id: 1,
      natural_language: "Confirm that temperatures remained below 20C during transit for batch #98.",
      evidence_url: "https://sensors.example/iot/batch/98",
      submitter_address: "0xABCDEF123456",
      timestamp: Date.now() / 1000 - 1800,
      status: 'INTENT_SUBMITTED'
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
  ]
};

interface StoreContextType {
  state: UIState;
  submitIntent: (nl: string, url: string) => void;
  adjudicateIntent: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>(initialState);

  const submitIntent = (nl: string, url: string) => {
    setState((prev) => {
      const nextId = Object.keys(prev.intents).length;
      return {
        ...prev,
        intents: {
          ...prev.intents,
          [nextId]: {
            id: nextId,
            natural_language: nl,
            evidence_url: url,
            submitter_address: "0x1234567890",
            timestamp: Math.floor(Date.now() / 1000),
            status: 'INTENT_SUBMITTED'
          }
        }
      };
    });
  };

  const adjudicateIntent = (id: number) => {
    // Mock the protocol state progression
    setState(prev => ({
      ...prev,
      intents: {
        ...prev.intents,
        [id]: { ...prev.intents[id], status: 'ADJUDICATING' }
      }
    }));

    setTimeout(() => {
      setState(prev => {
        const intent = prev.intents[id];
        if (!intent) return prev;
        
        // Randomly succeed or fail for demo purposes
        const success = Math.random() > 0.2;
        
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
          ...prev,
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
            [id]: {
              classification,
              confidence: "HIGH",
              reasoning
            }
          },
          outcomes: {
            ...prev.outcomes,
            [id]: {
              intent_id: id,
              final_decision: classification,
              locked: true
            }
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
    }, 2500); // 2.5s for adjudicating simulation
  };

  return (
    <StoreContext.Provider value={{ state, submitIntent, adjudicateIntent }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
