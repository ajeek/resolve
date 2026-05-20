"""
GLOBAL SYSTEM INVARIANTS:
1. Evidence MUST exist before ConsensusEngine runs.
2. Consensus MUST converge before OutcomeBuilder executes.
3. OutcomeObject MUST be finalized before SettlementLayer commit.
4. ExecutionLayer MUST NOT run unless OutcomeObject.finalized == True.

END-TO-END CONSISTENCY EXPECTATION:
Given identical IntentInput under equivalent evidence conditions, the system MUST produce consistent consensus outcomes.
AUDIT TRAIL REQUIREMENT: Every stage MUST produce immutable audit logs with input/output snapshots, timestamp, and hash reference.

LIFECYCLE PROGRESSION SYSTEM:
PENDING, PROCESSING, RESOLVED, EXECUTED, FAILED, EXECUTION_FAILED, ESCALATED.
ESCALATED is terminal non-recoverable state.

MODULE OWNERSHIP AND CROSS-MODULE INTERFACE CONTRACTS:
- StateManager is the ONLY module allowed to manage lifecycle progression. All other modules request transitions. Invalid progressions MUST be validation-gated.
- IntentInput: Owned by API Layer (api/routes.py). Instantiated on ingestion.
- EvidenceBundle: Owned by EvidenceEngine. Represents a snapshot of available information at reasoning time, not a fixed truth. Cannot be mutated externally.
- ConsensusProposal & ConsensusResult: Owned by ConsensusEngine. Provides equivalence-based consensus across nodes.
- OutcomeObject: Owned by OutcomeBuilder. A consensus-derived resolution artifact. Becomes an immutable settlement record at SettlementLayer.
- StateRecord: Owned by StateManager. Guides consensus-driven state transitions.
- UiMappingContract: Owned by API Layer to ensure strict type matching mapping.

FAILURE HANDLING PROTOCOL:
- EvidenceEngine: Network Timeout -> 3 attempts backoff -> Return explicit empty evidence state with null provenance.
- ConsensusEngine: Timeout or < 3 nodes -> trigger re-evaluation cycle, allow alternate node resolution paths, and propagate uncertainty into next consensus round by transitioning to FAILED state.
- OutcomeBuilder: Schema validation failure -> FAILED state.
- ExecutionLayer: Single execution attempt. On failure -> EXECUTION_FAILED state.
- SettlementLayer: Bradbury RPC failure -> Max 5 attempts with exponential backoff -> ESCALATED state. No infinite loops.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
import hashlib

@dataclass
class AuditLogEntry:
    stage: str
    input_snapshot: str
    output_snapshot: str
    timestamp: str
    hash_reference: Optional[str] = None

class ConsensusFailureException(Exception):
    """Custom exception containing partial traces for audit trail on consensus failure."""
    def __init__(self, message: str, partial_responses: List[Any], timestamp: str):
        super().__init__(message)
        self.partial_responses = partial_responses
        self.timestamp = timestamp

@dataclass
class IntentInput:
    intent_id: int
    intent_string: str
    sender: str

@dataclass
class EvidenceBundle:
    source: str
    data: Any
    relevance_score: float
    coverage_score: float
    
    @staticmethod
    def calculate_coverage_score(source_count: int, source_diversity: int, signal_strength: float) -> float:
        """
        Deterministic formula for Evidence Coverage Score.
        No LLM-derived scoring allowed for coverage.
        formula: coverage_score = (source_count * 0.4) + (source_diversity * 0.3) + (signal_strength * 0.3)
        """
        return (source_count * 0.4) + (source_diversity * 0.3) + (signal_strength * 0.3)

@dataclass
class ConsensusProposal:
    node_id: int
    action: str
    to_address: str
    amount: int
    confidence: float
    evidence_coverage: float

@dataclass
class ConsensusResult:
    decision_action: str
    target_to: str
    amount: int
    aggregated_confidence: float
    selected_proposal: ConsensusProposal
    trace: List[ConsensusProposal]

@dataclass
class OutcomeObject:
    intent_id: int
    original_intent: str
    evidence: List[EvidenceBundle]
    decision: Dict[str, Any]
    consensus_confidence: float
    resolution_trace: List[Dict[str, Any]]
    timestamp: str
    finalized: bool = False
    outcome_hash: Optional[str] = None
    
    def lock_and_finalize(self):
        """
        OutcomeObject immutability mechanism.
        Must include finalization step and hash signature.
        Becomes immutable ONLY after Bradbury commit locking it.
        """
        if self.finalized:
            raise ValueError("Outcome is already finalized and locked.")
            
        payload = f"{self.intent_id}:{self.original_intent}:{self.decision}:{self.consensus_confidence}:{self.timestamp}"
        self.outcome_hash = hashlib.sha256(payload.encode('utf-8')).hexdigest()
        self.finalized = True

@dataclass
class StateRecord:
    intent_id: int
    intent_string: str
    state: str
    outcome: Optional[OutcomeObject] = None
    failure_trace: Optional[Dict[str, Any]] = None
    audit_trail: List[AuditLogEntry] = field(default_factory=list)

@dataclass
class UiMappingContract:
    """
    Frontend contract binding layer maps UI to specific schema types.
    Enforces explicit structure transmission between frontend panels and core engine.
    """
    IntentForm: IntentInput
    EvidencePanel: List[EvidenceBundle]
    ConsensusViewer: ConsensusResult
    OutcomeViewer: OutcomeObject
    ExecutionPanel: Dict[str, Any] # Mapped to Status Representation
