from typing import Dict, Any


def apply_rules_layer(
    llm_result: Dict[str, Any],
    ipo_inputs: Dict[str, float],
) -> Dict[str, Any]:
    """
    Apply balanced rules on top of LLM output
    to ensure realistic and fair assessment.
    """

    scores = llm_result.get("scores", {})
    verdict = llm_result.get("final_verdict", "")
    financial_analysis = llm_result.get("financial_analysis", "")
    key_strengths = llm_result.get("key_strengths", [])

    # Only apply minor adjustments, not aggressive downgrades
    # Rule 1: If financial analysis mentions "decline" but has strengths, don't aggressively cap
    decline_count = financial_analysis.lower().count("decline") + financial_analysis.lower().count("declining")
    if decline_count >= 3:  # Only if multiple mentions
        fs = scores.get("financial_strength", 5)
        scores["financial_strength"] = max(2, min(fs, 5))  # Cap at 5, floor at 2

    # Rule 2: QIB subscription is just one factor, don't override LLM verdict
    sub_qib = ipo_inputs.get("sub_qib", 0.0)
    if sub_qib < 0.5 and verdict == "apply":  # Only if extremely low (< 0.5x)
        # Downgrade only if other scores are also weak
        avg_score = sum(scores.values()) / len(scores) if scores else 5
        if avg_score < 4:
            verdict = "high-risk-apply"

    # Rule 3: Don't override "apply" verdict unless there are multiple severe issues
    if verdict == "apply":
        weak_scores = sum(1 for v in scores.values() if v <= 2)
        if weak_scores >= 3:  # Only if 3+ scores are very low
            verdict = "high-risk-apply"

    # Rule 4: Respect LLM's balanced assessment
    # Only change to "avoid" if explicitly warranted by multiple factors
    if verdict == "high-risk-apply":
        # Keep as high-risk-apply unless there are critical issues
        critical_issues = financial_analysis.lower().count("critical") + financial_analysis.lower().count("severe")
        if critical_issues == 0 and len(key_strengths) > 0:
            # If no critical issues mentioned and there are strengths, keep high-risk-apply
            pass

    llm_result["scores"] = scores
    llm_result["final_verdict"] = verdict
    return llm_result