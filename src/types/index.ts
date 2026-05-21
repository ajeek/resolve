/**
 * =========================
 * GenLayer Intent Lifecycle
 * =========================
 *
 * Models Intelligent Contract execution states
 * with LLM-based validation + Optimistic Democracy consensus.
 */

export type IntentStatus =
  | "INTENT_SUBMITTED"
  | "VALIDATING"
  | "ADJUDICATING"
  | "CONSENSUS_REVIEW"
  | "SETTLED"
  | "REJECTED"
  | "DISPUTED";

/**
 * Core Intent record stored in GenLayer contract state
 */
export interface IntentRecord {
  status: IntentStatus;

  natural_language: string;

  /**
   * Optional evidence attached during or after execution
   */
  evidence_url?: string;

  submitter: string;

  submitted_at: number;

  /**
   * 0 or undefined until final settlement
   */
  settled_at?: number;

  /**
   * Final outcome after consensus (may be undefined during execution)
   */
  outcome?: string;
}

/**
 * =========================
 * Adjudication Trace Model
 * =========================
 *
 * Represents validator/LLM execution steps
 * during Intelligent Contract adjudication.
 */
export interface AdjudicationTrace {
  intent_id: number;

  leader_classification: string;

  evidence_summary: string;

  adjudicated_at: number;

  /**
   * Optional metadata for advanced UI analytics
   */
  validator_count?: number;

  consensus_score?: number;
}

/**
 * =========================
 * UI Helper Types
 * =========================
 *
 * Used for LifecycleVisualizer + dashboards
 */

export type IntentStageGroup =
  | "active"
  | "finalized"
  | "failed";

/**
 * Maps GenLayer lifecycle states into UI-friendly groups
 */
export const IntentStageGroupMap: Record<IntentStatus, IntentStageGroup> = {
  INTENT_SUBMITTED: "active",
  VALIDATING: "active",
  ADJUDICATING: "active",
  CONSENSUS_REVIEW: "active",
  SETTLED: "finalized",
  REJECTED: "failed",
  DISPUTED: "active"
};