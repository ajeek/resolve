from contracts.schemas import StateRecord, OutcomeObject, AuditLogEntry

class StateManager:
    """
    Lifecycle progression tracking for intents and consensus-driven outcomes.
    Lifecycle stages: PENDING, PROCESSING, RESOLVED, EXECUTED, FAILED, EXECUTION_FAILED, ESCALATED.
    ESCALATED is terminal non-recoverable state.
    Produces immutable settlement records after RESOLVED.
    No skipping stages allowed.
    LIFECYCLE PROGRESSION AUTHORITY:
    - StateManager is the ONLY module allowed to manage lifecycle progression.
    - All other modules request progressions based on validation gates.
    - Invalid progressions MUST be validation-gated and throw exceptions.
    """
    def __init__(self):
        self.records: dict[int, StateRecord] = {}

    def initialize_intent(self, intent_id: int, intent_str: str) -> StateRecord:
        if intent_id in self.records:
            raise ValueError("Intent already exists")
        record = StateRecord(intent_id=intent_id, intent_string=intent_str, state="PENDING")
        self.records[intent_id] = record
        return record

    def transition_to_processing(self, intent_id: int) -> StateRecord:
        record = self.records.get(intent_id)
        if not record or record.state != "PENDING":
            raise ValueError("Invalid progression: Must be PENDING to move to PROCESSING")
        record.state = "PROCESSING"
        return record

    def save_outcome(self, intent_id: int, outcome: OutcomeObject) -> StateRecord:
        record = self.records.get(intent_id)
        if not record or record.state != "PROCESSING":
            raise ValueError("Invalid progression: Must be PROCESSING to move to RESOLVED")
        record.state = "RESOLVED"
        record.outcome = outcome
        return record
        
    def transition_to_executed(self, intent_id: int) -> StateRecord:
        record = self.records.get(intent_id)
        if not record or record.state != "RESOLVED":
            raise ValueError("Invalid progression: Must be RESOLVED to move to EXECUTED")
        record.state = "EXECUTED"
        return record
        
    def transition_to_failed(self, intent_id: int, reason: str = "", partial_trace: dict = None) -> StateRecord:
        record = self.records.get(intent_id)
        if not record:
            raise ValueError("Intent not found")
        record.state = "FAILED"
        from datetime import datetime
        record.failure_trace = {
            "reason": reason,
            "partial_trace": partial_trace or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        return record
        
    def transition_to_execution_failed(self, intent_id: int) -> StateRecord:
        record = self.records.get(intent_id)
        if not record or record.state != "RESOLVED":
            raise ValueError("Invalid progression: Must be RESOLVED to move to EXECUTION_FAILED")
        record.state = "EXECUTION_FAILED"
        return record
        
    def transition_to_escalated(self, intent_id: int) -> StateRecord:
        record = self.records.get(intent_id)
        if not record:
            raise ValueError("Intent not found")
        record.state = "ESCALATED"
        return record

    def append_audit_log(self, intent_id: int, stage: str, input_snapshot: str, output_snapshot: str, hash_ref: str = None) -> None:
        from datetime import datetime
        record = self.records.get(intent_id)
        if record:
            record.audit_trail.append(AuditLogEntry(
                stage=stage,
                input_snapshot=input_snapshot,
                output_snapshot=output_snapshot,
                timestamp=datetime.utcnow().isoformat(),
                hash_reference=hash_ref
            ))

    def get_record(self, intent_id: int) -> StateRecord:
        return self.records.get(intent_id)
