from contracts.intent_contract import IntentContract
from contracts.schemas import IntentInput

class ResolveApiRoutes:
    """
    API Interface layer entrypoint for submitting user intents.
    
    Input: dict representing JSON payload
    Output: JSON serializable dictionary representing execution status and OutcomeObject
    """
    def __init__(self):
        self.contract = IntentContract()
        
    def handle_intent_request(self, req_body: dict):
        try:
            intent_input = IntentInput(
                intent_id=req_body.get("intent_id"),
                intent_string=req_body.get("intent_string"),
                sender=req_body.get("sender", "anonymous")
            )
            outcome = self.contract.process_intent(intent_input)
            
            # Note: real environments should handle dataclass to dict mapping properly.
            # Using __dict__ for this structural example.
            return {"status": "success", "outcome": outcome.__dict__}
        except Exception as e:
            return {"status": "error", "message": str(e)}
