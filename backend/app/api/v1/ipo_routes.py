from fastapi import APIRouter, UploadFile, File, HTTPException, status

from app.models.ipo import IPOAnalysisRequest, IPOAnalysisResult, IPOScores
from app.services.pdf_service import extract_pdf_text
from app.services.ipo_analyzer import analyze_ipo_from_text
from app.services.llm_service import LLMError


router = APIRouter(prefix="/ipo", tags=["ipo"])


@router.post("/analyze", response_model=IPOAnalysisResult)
async def analyze_ipo(
    rhp: UploadFile = File(...),
):
    """
    Analyze IPO document. Takes only a PDF file and returns comprehensive analysis.
    """
    # Basic file validations
    if rhp.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a PDF.",
        )

    try:
        rhp_text = await extract_pdf_text(rhp)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read PDF: {e}",
        )

    if not rhp_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="RHP PDF appears to be empty or unreadable.",
        )

    # Use default IPO data
    try:
        ipo_data = IPOAnalysisRequest(
            issue_price=100.0,
            gmp=0.0,
            sub_retail=0.0,
            sub_nii=0.0,
            sub_qib=0.0,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid IPO data: {e}",
        )

    try:
        analysis_dict = analyze_ipo_from_text(rhp_text, ipo_data)
    except LLMError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"LLM error: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during analysis: {e}",
        )

    scores = analysis_dict["scores"]
    financial_metrics_data = analysis_dict.get("financial_metrics", {})

    result = IPOAnalysisResult(
        company_overview=analysis_dict["company_overview"],
        business_summary=analysis_dict["business_summary"],
        financial_analysis=analysis_dict["financial_analysis"],
        financial_metrics=financial_metrics_data,
        key_strengths=analysis_dict["key_strengths"],
        key_risks=analysis_dict["key_risks"],
        valuation_analysis=analysis_dict["valuation_analysis"],
        profit_potential=analysis_dict["profit_potential"],
        investment_recommendation=analysis_dict["investment_recommendation"],
        scores=IPOScores(**scores),
        final_verdict=analysis_dict["final_verdict"],
        final_comment=analysis_dict["final_comment"],
    )

    return result
