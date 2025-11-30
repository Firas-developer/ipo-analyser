from typing import Dict, Any

from app.models.ipo import IPOAnalysisRequest
from app.services.llm_service import call_llm, LLMError
from app.services.rules_engine import apply_rules_layer


def build_ipo_prompt(rhp_text: str, ipo_data: IPOAnalysisRequest) -> str:
    """
    Build the prompt for the IPO analysis LLM call.
    Keep RHP text truncated to avoid massive context.
    """
    # Use all extracted text for comprehensive analysis
    # No truncation - send complete document content to LLM
    truncated_rhp = rhp_text  # Full document content for accurate analysis

    return f"""You are an experienced IPO equity analyst. Provide balanced, comprehensive analysis for investment decision-making.

IMPORTANT INSTRUCTIONS:
- Perform thorough analysis considering BOTH strengths AND weaknesses
- Evaluate opportunities and growth potential alongside risks
- Provide balanced verdicts: not every IPO should be "avoid"
- Consider market conditions, sector trends, and company fundamentals
- Give scores that reflect realistic assessment (not overly pessimistic)
- Only recommend "avoid" if there are CRITICAL red flags or severe concerns
- Consider "apply" or "high-risk-apply" for companies with reasonable prospects

You are given:
1) RHP text (may be imperfect OCR, do your best).
2) Basic IPO data: issue price, grey market premium (GMP), subscription data.

Analysis Guidelines:
- Be realistic and balanced, not overly conservative
- Highlight both strengths AND risks clearly
- Provide actionable insights for investors
- Consider long-term growth potential
- Assess management quality and market opportunity
- Evaluate if valuation offers reasonable entry point

RHP TEXT (may be long, focus on business, financials, risks, opportunities):
{truncated_rhp}

IPO DATA:
- Issue Price: {ipo_data.issue_price}
- GMP (may be 0 if not applicable): {ipo_data.gmp}
- Subscription (Retail): {ipo_data.sub_retail}x
- Subscription (NII): {ipo_data.sub_nii}x
- Subscription (QIB): {ipo_data.sub_qib}x

Tasks:
1. company_overview: Brief overview of the company, its sector, market position, and growth potential (3-4 lines).
2. business_summary: Concise business model, operations, and market opportunity (4-5 lines).
3. financial_analysis: Detailed analysis of:
   - Revenue trend (growth/decline) and trajectory
   - Profit trend (net income, margins, profitability)
   - Debt/leverage levels and financial health
   - Cash flow health and capital efficiency
   - Growth prospects and market expansion
4. financial_metrics: Extract and structure YEARLY financial data (CRITICAL):
   - For each year available, provide: year, revenue (in millions), profit (in millions), loss (in millions), profit margin (%), revenue growth rate (%)
   - Calculate: total_revenue, total_profit, total_loss, avg_margin
   - Identify: revenue_growth_trend ("increasing", "decreasing", "stable"), profitability_trend ("improving", "declining", "stable")
   - Return as array of yearly objects with these exact fields
5. key_strengths: List 4-5 main strengths and competitive advantages (as array of strings).
6. key_risks: List 5-6 main risks/concerns and mitigation factors (as array of strings).
7. valuation_analysis: Is the IPO fairly valued? Consider market comparables, growth potential, and entry point (3-4 lines).
8. profit_potential: Will investors likely make profit? Analyze short-term listing gains and long-term value creation (3-4 lines).
9. investment_recommendation: Clear recommendation with reasoning. Consider risk-reward ratio and investor profile (3-4 lines).
10. Give scores (0-10) for:
   - financial_strength (based on revenue, profitability, debt levels)
   - valuation_comfort (is price reasonable for growth prospects?)
   - promoter_quality (track record, experience, alignment with investors)
   - demand_strength (market demand, subscription interest, sector appeal)
11. Give a final_verdict:
    - "apply" (good investment with reasonable risk-reward)
    - "high-risk-apply" (risky but significant upside potential)
    - "avoid" (only if critical red flags or severe concerns exist)
12. Give a final_comment (2-4 lines) explaining your verdict and key considerations.

SCORING GUIDANCE:
- Scores should reflect balanced assessment (not all 1-3)
- Strong fundamentals: 7-9
- Moderate fundamentals: 4-6
- Only use 1-2 for severe issues

Return ONLY valid JSON in this EXACT schema:

{{
  "company_overview": "...",
  "business_summary": "...",
  "financial_analysis": "...",
  "financial_metrics": {{
    "yearly_data": [
      {{"year": "2021", "revenue": 100.5, "profit": 15.2, "loss": 0, "margin": 15.1, "growth_rate": 0}},
      {{"year": "2022", "revenue": 125.3, "profit": 22.5, "loss": 0, "margin": 17.9, "growth_rate": 24.8}},
      {{"year": "2023", "revenue": 156.8, "profit": 31.2, "loss": 0, "margin": 19.9, "growth_rate": 25.1}}
    ],
    "total_revenue": 382.6,
    "total_profit": 68.9,
    "total_loss": 0,
    "avg_margin": 17.6,
    "revenue_growth_trend": "increasing",
    "profitability_trend": "improving"
  }},
  "key_strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "key_risks": ["risk1", "risk2", "risk3", "risk4", "risk5", "risk6"],
  "valuation_analysis": "...",
  "profit_potential": "...",
  "investment_recommendation": "...",
  "scores": {{
    "financial_strength": 0,
    "valuation_comfort": 0,
    "promoter_quality": 0,
    "demand_strength": 0
  }},
  "final_verdict": "apply",
  "final_comment": "..."
}}"""


def analyze_ipo_from_text(rhp_text: str, ipo_data: IPOAnalysisRequest) -> Dict[str, Any]:
    """
    Full flow: build prompt -> call LLM -> apply rules -> return dict.
    """
    print("\n" + "="*80)
    print(" IPO ANALYSIS STARTED")
    print("="*80)
    print(f"RHP Text Length: {len(rhp_text)} characters")
    print(f"Issue Price: {ipo_data.issue_price}")
    print(f"GMP: {ipo_data.gmp}")
    print(f"Subscription - Retail: {ipo_data.sub_retail}x, NII: {ipo_data.sub_nii}x, QIB: {ipo_data.sub_qib}x")
    print("="*80 + "\n")
    
    prompt = build_ipo_prompt(rhp_text, ipo_data)

    llm_raw = call_llm(prompt)
    
    print("\n" + "="*80)
    print(" LLM RESPONSE RECEIVED")
    print("="*80)
    print(f"Response Keys: {list(llm_raw.keys())}")
    print(f"Final Verdict: {llm_raw.get('final_verdict', 'N/A')}")
    print(f"Scores: {llm_raw.get('scores', {})}")
    print("="*80 + "\n")

    # Ensure basic keys exist; if not, raise to client
    required_keys = [
        "company_overview",
        "business_summary",
        "financial_analysis",
        "financial_metrics",
        "key_strengths",
        "key_risks",
        "valuation_analysis",
        "profit_potential",
        "investment_recommendation",
        "scores",
        "final_verdict",
        "final_comment",
    ]
    for key in required_keys:
        if key not in llm_raw:
            raise LLMError(f"LLM response missing key: {key}")

    # rules engine will modify scores & verdict if needed
    adjusted = apply_rules_layer(
        llm_result=llm_raw,
        ipo_inputs={
            "issue_price": ipo_data.issue_price,
            "gmp": ipo_data.gmp,
            "sub_retail": ipo_data.sub_retail,
            "sub_nii": ipo_data.sub_nii,
            "sub_qib": ipo_data.sub_qib,
        },
    )

    return adjusted