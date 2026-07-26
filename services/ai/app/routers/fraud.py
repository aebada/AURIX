"""Fraud / anomaly scoring.

This is a rule-based mock, not a trained model. It exists to give the
backend a real endpoint shape to call (see docs/PRODUCT_PLAN.md section
3.7 and 7 for the intended AI fraud-detection features). A production
version would replace `score_transaction` with an actual model and
feature pipeline.
"""

from enum import Enum

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/fraud", tags=["fraud"])


class Asset(str, Enum):
    GOLD = "GOLD"
    SILVER = "SILVER"
    FIAT = "FIAT"


class TransactionScoreRequest(BaseModel):
    user_id: str
    asset: Asset
    amount: float = Field(gt=0)
    # Rolling count of transactions by this user in the last 24h, supplied
    # by the caller (the backend) since this service holds no state.
    transactions_last_24h: int = Field(ge=0, default=0)
    is_new_recipient: bool = False


class TransactionScoreResponse(BaseModel):
    risk_score: float = Field(ge=0, le=1)
    risk_level: str
    reasons: list[str]


LARGE_AMOUNT_THRESHOLDS = {
    Asset.GOLD: 50_000,  # atomic units (~5g)
    Asset.SILVER: 500_000,  # atomic units (~50g)
    Asset.FIAT: 5_000,  # currency minor-unit-agnostic mock threshold
}


@router.post("/score-transaction", response_model=TransactionScoreResponse)
def score_transaction(req: TransactionScoreRequest) -> TransactionScoreResponse:
    score = 0.0
    reasons: list[str] = []

    if req.amount > LARGE_AMOUNT_THRESHOLDS[req.asset]:
        score += 0.35
        reasons.append("Amount exceeds typical threshold for this asset")

    if req.transactions_last_24h > 10:
        score += 0.3
        reasons.append("High transaction velocity in the last 24 hours")

    if req.is_new_recipient:
        score += 0.15
        reasons.append("First transaction to this recipient")

    score = min(score, 1.0)
    level = "low" if score < 0.3 else "medium" if score < 0.7 else "high"

    if not reasons:
        reasons.append("No anomaly signals detected")

    return TransactionScoreResponse(risk_score=round(score, 2), risk_level=level, reasons=reasons)
