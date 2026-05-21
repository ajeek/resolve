export type IntentStatus = 'INTENT_SUBMITTED' | 'ADJUDICATING' | 'SETTLED' | 'FAILED';

export interface AuditRecord {
  intent_id: number;
  classification: string;
  evidence_snippet: string;
  timestamp: number;
}

export interface IntentRecord {
  id: number;
  natural_language: string;
  evidence_url: string;
  submitter_address: string;
  timestamp: number;
  status: IntentStatus;
}

export interface ConsensusRecord {
  classification: 'FULFILLED' | 'UNFULFILLED' | 'INSUFFICIENT_EVIDENCE' | string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  reasoning: string;
}

export interface OutcomeObject {
  intent_id: number;
  final_decision: string;
  locked: boolean;
}

export interface UIState {
  intents: Record<number, IntentRecord>;
  evidences: Record<number, string>;
  consensus_traces: Record<number, ConsensusRecord>;
  outcomes: Record<number, OutcomeObject>;
  audit_trail: AuditRecord[];
}
