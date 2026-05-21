"""
ResolveLayer Intelligent Contract (Python GenVM implementation)
"""
import json
from genlayer import *

@allow_storage
@dataclass
class AuditRecord:
    intent_id: u32
    classification: str
    evidence_snippet: str
    timestamp: u64

@allow_storage
@dataclass
class IntentRecord:
    id: u32
    natural_language: str
    evidence_url: str
    submitter_address: Address
    timestamp: u64
    status: str

@allow_storage
@dataclass
class ConsensusRecord:
    classification: str
    confidence: str
    reasoning: str

@allow_storage
@dataclass
class OutcomeObject:
    intent_id: u32
    final_decision: str
    locked: bool

class ResolveLayer:
    intents: TreeMap[u32, IntentRecord]
    consensus_traces: TreeMap[u32, ConsensusRecord]
    outcomes: TreeMap[u32, OutcomeObject]
    audit_trail: DynArray[AuditRecord]
    intent_counter: u32

    def __init__(self):
        self.intent_counter = 0

    def submit_intent(self, natural_language: str, evidence_url: str) -> u32:
        intent_id = self.intent_counter
        self.intent_counter += 1
        
        self.intents[intent_id] = IntentRecord(
            id=intent_id,
            natural_language=natural_language,
            evidence_url=evidence_url,
            submitter_address=gl.message.sender,
            timestamp=gl.message.datetime.timestamp(),
            status="INTENT_SUBMITTED"
        )
        return intent_id

    def adjudicate_intent(self, intent_id: u32):
        intent = gl.storage.copy_to_memory(self.intents.get(intent_id))
        
        if intent.status != "INTENT_SUBMITTED":
            raise UserError("Intent is not in submitted state")
            
        intent.status = "ADJUDICATING"
        self.intents[intent_id] = intent
        
        # Optimistic Democracy Execution
        res = gl.vm.run_nondet_unsafe(
            lambda: self._leader_fn(intent),
            lambda leader_res: self._validator_fn(intent, leader_res)
        )
        
        # Post-consensus state transitions (Deterministic context)
        intent_mem = gl.storage.copy_to_memory(self.intents.get(intent_id))
        if res.is_error:
            intent_mem.status = "FAILED"
            self.intents[intent_id] = intent_mem
            return
            
        result = res.value
        
        intent_mem.status = "SETTLED"
        self.intents[intent_id] = intent_mem
        
        self.consensus_traces[intent_id] = ConsensusRecord(
            classification=result["classification"],
            confidence=result["confidence"],
            reasoning=result["reasoning"]
        )
        
        self.outcomes[intent_id] = OutcomeObject(
            intent_id=intent_id,
            final_decision=result["classification"],
            locked=True
        )
        
        # Log limited 200 chars snippet
        snippet = result.get("evidence_raw", "")[:200]
        
        self.audit_trail.append(AuditRecord(
            intent_id=intent_id,
            classification=result["classification"],
            evidence_snippet=snippet,
            timestamp=gl.message.datetime.timestamp()
        ))

    def _leader_fn(self, intent: IntentRecord) -> dict:
        evidence_resp = gl.nondet.web.get(intent.evidence_url)
        evidence_content = evidence_resp.data
        
        prompt = f"Evaluate intent: {intent.natural_language}. Evidence: {evidence_content}"
        llm_resp = gl.nondet.exec_prompt(prompt, response_format="json")
        data = json.loads(llm_resp)
        
        return {
            "classification": data.get("classification", "INSUFFICIENT_EVIDENCE"),
            "confidence": data.get("confidence", "LOW"),
            "reasoning": data.get("reasoning", "No valid reasoning provided"),
            "evidence_raw": evidence_content
        }
        
    def _validator_fn(self, intent: IntentRecord, leader_res: Result) -> bool:
        if leader_res.is_error:
            # Under strict rules, we could compare the error types
            # For simplicity, returning True if both fail 
            return True
        
        leader_data = leader_res.value
        
        evidence_resp = gl.nondet.web.get(intent.evidence_url)
        evidence_content = evidence_resp.data
        
        prompt = f"Evaluate intent: {intent.natural_language}. Evidence: {evidence_content}"
        llm_resp = gl.nondet.exec_prompt(prompt, response_format="json")
        validator_data = json.loads(llm_resp)
        
        val_class = str(validator_data.get("classification", ""))
        lead_class = str(leader_data.get("classification", ""))
        
        # Hard check classification match equivalence
        if val_class != lead_class:
            return False
            
        return True
