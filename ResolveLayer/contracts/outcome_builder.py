from datetime import datetime
from typing import List
from contracts.schemas import OutcomeObject, EvidenceBundle, ConsensusResult

class OutcomeBuilder:
    """
    Responsible for building the standardized consensus-derived resolution artifact.
    Represents consistent consensus outcomes under equivalent evidence conditions.
    Immutable once anchored on Bradbury Testnet.
    
    Input: intent_id (int), original_intent (str), evidence (List[EvidenceBundle]), consensus_result (ConsensusResult)
    Output: OutcomeObject
    Failure: Raises exception if inputs are malformed
    """
    def build(self, intent_id: int, original_intent: str, evidence: List[EvidenceBundle], consensus_result: ConsensusResult) -> OutcomeObject:
        if not consensus_result:
            raise ValueError("Consensus result cannot be null")
            
        trace_dicts = [{"node_id": t.node_id, "action": t.action, "confidence": t.confidence} for t in consensus_result.trace]

        return OutcomeObject(
            intent_id=intent_id,
            original_intent=original_intent,
            evidence=evidence,
            decision={
                "action": consensus_result.decision_action,
                "to": consensus_result.target_to,
                "amount": consensus_result.amount
            },
            consensus_confidence=consensus_result.aggregated_confidence,
            resolution_trace=trace_dicts,
            timestamp=datetime.utcnow().isoformat()
        )
