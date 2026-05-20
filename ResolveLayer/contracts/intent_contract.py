from state.state_manager import StateManager
from contracts.evidence_engine import EvidenceEngine
from contracts.consensus_engine import ConsensusEngine
from contracts.outcome_builder import OutcomeBuilder
from contracts.execution_layer import ExecutionLayer
from bradbury.settlement_layer import SettlementLayer
from contracts.schemas import IntentInput, OutcomeObject, ConsensusFailureException
import json

class IntentContract:
    """
    Core entrypoint orchestrating the multi-layer resolution pipeline.
    A GenLayer-native Intelligent Contract system for intent adjudication and outcome settlement.
    
    Input: IntentInput
    Output: OutcomeObject
    Failure: Progresses state to FAILED if exception occurs in reasoning pipeline.
    """
    def __init__(self):
        self.state = StateManager()
        self.evidence_engine = EvidenceEngine()
        self.consensus = ConsensusEngine()
        self.outcome_builder = OutcomeBuilder()
        self.execution = ExecutionLayer()
        self.settlement = SettlementLayer()

    def process_intent(self, intent_input: IntentInput) -> OutcomeObject:
        intent_id = intent_input.intent_id
        intent_string = intent_input.intent_string
        
        # Initialize and transition: PENDING -> PROCESSING
        self.state.initialize_intent(intent_id, intent_string)
        self.state.transition_to_processing(intent_id)
        
        try:
            # 1. Evidence Collection
            evidence = self.evidence_engine.collect_evidence(intent_string)
            if evidence is None:
                raise ValueError("System Invariant Failed: Evidence MUST exist before ConsensusEngine runs")
            
            self.state.append_audit_log(intent_id, "EVIDENCE_COLLECTION", json.dumps({"intent": intent_string}), json.dumps(evidence, default=str))

            # 2. Multi-node Consensus
            consensus_result = self.consensus.evaluate(intent_string, evidence)
            if not consensus_result:
                raise ValueError("System Invariant Failed: Consensus MUST succeed before OutcomeBuilder executes")
            
            self.state.append_audit_log(intent_id, "CONSENSUS_EVALUATION", json.dumps(evidence, default=str), json.dumps(consensus_result, default=str))

            # 3. Outcome Resolution
            outcome = self.outcome_builder.build(
                intent_id=intent_id,
                original_intent=intent_string,
                evidence=evidence,
                consensus_result=consensus_result
            )
            
            self.state.append_audit_log(intent_id, "OUTCOME_RESOLUTION", json.dumps(consensus_result, default=str), json.dumps(outcome, default=str))

            # Transition: PROCESSING -> RESOLVED
            self.state.save_outcome(intent_id, outcome)
            
            # 3.5 Finalize OutcomeObject
            outcome.lock_and_finalize()
            
            self.state.append_audit_log(intent_id, "OUTCOME_FINALIZATION", json.dumps(outcome, default=str), f"FINALIZED:{outcome.outcome_hash}", hash_ref=outcome.outcome_hash)
            
            # 4. Execution
            record = self.state.get_record(intent_id)
            exec_success = self.execution.execute_decision(outcome, record)
            
            self.state.append_audit_log(intent_id, "EXECUTION", json.dumps({"outcome_hash": outcome.outcome_hash}), json.dumps({"success": exec_success}))
            
            if exec_success:
                # Transition: RESOLVED -> EXECUTED 
                self.state.transition_to_executed(intent_id)
            else:
                self.state.transition_to_execution_failed(intent_id)
                
            # 5. Commit on Deterministic Settlement Layer (Bradbury)
            try:
                self.settlement.commit_outcome(outcome)
            except Exception:
                self.state.transition_to_escalated(intent_id)
                raise
            
            return outcome
            
        except Exception as e:
            record = self.state.get_record(intent_id)
            if record:
                if isinstance(e, ConsensusFailureException):
                    self.state.transition_to_failed(intent_id, e.args[0], partial_trace={"partial_responses": e.partial_responses, "timestamp": e.timestamp})
                elif record.state in ["PROCESSING", "PENDING"]:
                    # Consensus Failure -> FAILED
                    self.state.transition_to_failed(intent_id, str(e))
                elif record.state == "RESOLVED":
                    pass # Handled by execution or settlement failure states
            raise e
