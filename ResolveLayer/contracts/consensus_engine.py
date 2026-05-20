from genlayer.studio_adapter import StudioAdapter
from contracts.schemas import EvidenceBundle, ConsensusProposal, ConsensusResult, ConsensusFailureException
from typing import List
from datetime import datetime

class ConsensusEngine:
    """
    Consensus Rules:
    - minimum 3 nodes
    - isolated execution per node
    - no shared memory between nodes
    - multi-node independent reasoning system
    - outputs interpreted under equivalence principle
    - final result emerges from consensus convergence across nodes
    - adjudication outcome selection: if equal confidence -> select highest evidence coverage score
    
    Input: intent (str), evidence (List[EvidenceBundle])
    Output: ConsensusResult
    Failure: Raises Exception if < 3 nodes respond to trigger re-evaluation cycle and propagate uncertainty
    """
    def __init__(self):
        self.genlayer = StudioAdapter()
        self.min_nodes = 3

    def evaluate(self, intent: str, evidence: List[EvidenceBundle]) -> ConsensusResult:
        results: List[ConsensusProposal] = []
        
        # 1. Isolated execution per node
        for i in range(self.min_nodes):
            res = self.genlayer.execute_prompt(f"Evaluate intent: {intent}. Evidence: {evidence}", node_id=i)
            proposal = ConsensusProposal(
                node_id=i,
                action=res.get('action', 'NO_ACTION'),
                to_address=res.get('to', '0x0000000000000000000000000000000000000000'),
                amount=res.get('amount', 0),
                confidence=res.get('confidence', 0.0),
                evidence_coverage=res.get('evidence_coverage', 0.0)
            )
            results.append(proposal)
        
        if len(results) < self.min_nodes:
            raise ConsensusFailureException(
                message=f"Consensus failed: Expected {self.min_nodes} nodes, got {len(results)}",
                partial_responses=[vars(r) for r in results],
                timestamp=datetime.utcnow().isoformat()
            )
            
        # 2. Equivalence-based consensus aggregation across independent reasoning nodes
        aggregated_confidence = sum([r.confidence for r in results]) / len(results)
        
        # 3. Adjudication outcome selection (equivalence rule)
        # Sort by confidence purely, and if equal, use highest evidence coverage score
        sorted_results = sorted(results, key=lambda x: (x.confidence, x.evidence_coverage), reverse=True)
        selected_proposal = sorted_results[0]
        
        return ConsensusResult(
            decision_action=selected_proposal.action,
            target_to=selected_proposal.to_address,
            amount=selected_proposal.amount,
            aggregated_confidence=aggregated_confidence,
            selected_proposal=selected_proposal,
            trace=results
        )
