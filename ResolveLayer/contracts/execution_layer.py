from contracts.schemas import OutcomeObject, StateRecord

class ExecutionLayer:
    """
    Execution Rules:
    - execution eligibility conditions must be met
    - execution_layer only consumes OutcomeObject
    - execution MUST be deterministic
    
    EXECUTION FAILURE CLARIFICATION:
    - No retry loops allowed.
    - Single deterministic attempt only.
    - On failure -> state = EXECUTION_FAILED.
    - No implicit reprocessing.
    
    EXECUTION GATING RULE:
    - MUST validate: state == RESOLVED AND OutcomeObject.finalized == True
    - Reject if not satisfied.
    
    Input: OutcomeObject, StateRecord
    Output: bool
    Failure: Returns False or raises exception on failed deterministic execution
    """
    def execute_decision(self, outcome: OutcomeObject, state_record: StateRecord) -> bool:
        if state_record.state != "RESOLVED":
            raise ValueError("Execution rejected: State must be RESOLVED")
        if not outcome.finalized:
            raise ValueError("Execution rejected: OutcomeObject must be finalized")
            
        decision = outcome.decision
        action = decision.get('action')
        target = decision.get('to')
        amount = decision.get('amount')
        
        if action == "TRANSFER":
            # Deterministic execution call
            print(f"Executed: Transferred {amount} to {target}")
            return True
            
        print(f"Executed action {action} to {target}")
        return False
