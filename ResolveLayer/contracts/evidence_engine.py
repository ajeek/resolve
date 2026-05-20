from genlayer.studio_adapter import StudioAdapter
from contracts.schemas import EvidenceBundle
from typing import List
import time

class EvidenceEngine:
    """
    Responsible solely for retrieval of observed web state via nondeterministic sources.
    Web data retrieval is nondeterministic and sources may vary between runs.
    EvidenceBundle represents a snapshot of available information at reasoning time.
    No concept of "truth guarantee", only observed signal context.
    
    Input: intent (str)
    Output: List[EvidenceBundle]
    Failure: 3 attempts with exponential backoff on fetch failure, then fallback to explicit empty evidence state with null provenance.
    """
    def __init__(self):
        self.genlayer = StudioAdapter()

    def collect_evidence(self, intent: str) -> List[EvidenceBundle]:
        extracted_keywords = intent.split(" ")
        
        evidence_results = []
        retries = 3
        for attempt in range(retries):
            try:
                evidence_results = self.genlayer.fetch_web_data(query=f"Validate {extracted_keywords}")
                break
            except Exception:
                if attempt == retries - 1:
                    # Explicit empty evidence state with null provenance
                    placeholder = EvidenceBundle(
                        source="SYSTEM_FALLBACK",
                        data={"source_count": 0, "source_diversity": 0, "signal_strength": 0},
                        relevance_score=0.0,
                        coverage_score=0.0
                    )
                    return [placeholder]
                time.sleep(2 ** attempt) # Exponential backoff
        
        bundles = []
        # Calculate evidence properties based on observed snapshot
        source_count = len(evidence_results)
        source_diversity = len(set([res.get("source", "unknown") for res in evidence_results]))
        
        for result in evidence_results:
            # Heuristic signal strength estimation based on measurable content
            signal_strength = 1.0 if "valid" in str(result.get("data", "")).lower() else 0.5
            
            coverage = EvidenceBundle.calculate_coverage_score(
                source_count=source_count,
                source_diversity=source_diversity,
                signal_strength=signal_strength
            )
            
            bundles.append(EvidenceBundle(
                source=result.get("source", "unknown"),
                data=result.get("data", ""),
                relevance_score=result.get("relevance", 0.0),
                coverage_score=coverage
            ))
        
        return bundles
