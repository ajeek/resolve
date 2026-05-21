export const stages = [
  "INTENT_SUBMITTED",
  "VALIDATION_PENDING",
  "VALIDATING",
  "CONSENSUS_REVIEW",
  "SETTLED",
  "REJECTED"
] as const;

export type IntentStatus = typeof stages[number];