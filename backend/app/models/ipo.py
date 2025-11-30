from pydantic import BaseModel, Field
from typing import List, Dict, Any

class IPOAnalysisRequest(BaseModel):
    issue_price: float = 100.0
    gmp: float = 0.0
    sub_retail: float = 0.0
    sub_nii: float = 0.0
    sub_qib: float = 0.0


class IPOScores(BaseModel):
    financial_strength: int
    valuation_comfort: int
    promoter_quality: int
    demand_strength: int


class FinancialYear(BaseModel):
    year: str
    revenue: float
    profit: float
    loss: float
    margin: float
    growth_rate: float


class FinancialMetrics(BaseModel):
    yearly_data: List[FinancialYear]
    total_revenue: float
    total_profit: float
    total_loss: float
    avg_margin: float
    revenue_growth_trend: str
    profitability_trend: str


class IPOAnalysisResult(BaseModel):
    company_overview: str
    business_summary: str
    financial_analysis: str
    financial_metrics: FinancialMetrics
    key_strengths: List[str]
    key_risks: List[str]
    valuation_analysis: str
    profit_potential: str
    investment_recommendation: str
    scores: IPOScores
    final_verdict: str
    final_comment: str