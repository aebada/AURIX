"""AI governance: proposal ranking and voting guidance.

Per docs/PRODUCT_PLAN.md section 4: AI generates recommendations only.
`requires_human_approval` is always true here by design — this service
must never be wired up to autonomously execute irreversible governance
actions (fund movements, allocation changes, reserve/compliance logic).
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/governance", tags=["governance"])


class ProposalEvaluationRequest(BaseModel):
    title: str
    description: str
    affects_reserves: bool = False
    affects_compliance: bool = False


class ProposalEvaluationResponse(BaseModel):
    recommendation_score: float = Field(ge=0, le=1)
    recommendation: str
    requires_human_approval: bool = True
    notes: list[str]


@router.post("/evaluate-proposal", response_model=ProposalEvaluationResponse)
def evaluate_proposal(req: ProposalEvaluationRequest) -> ProposalEvaluationResponse:
    score = 0.5
    notes: list[str] = []

    if req.affects_reserves:
        score -= 0.2
        notes.append("Proposal affects reserve logic — requires elevated review")
    if req.affects_compliance:
        score -= 0.2
        notes.append("Proposal affects compliance rules — requires legal/compliance sign-off")

    score = max(0.0, min(1.0, score))
    recommendation = (
        "Favorable, standard review" if score >= 0.5 else "Needs additional scrutiny before a vote"
    )

    notes.append("AI recommendations never auto-execute — a human must approve this action.")

    return ProposalEvaluationResponse(
        recommendation_score=round(score, 2),
        recommendation=recommendation,
        requires_human_approval=True,
        notes=notes,
    )
