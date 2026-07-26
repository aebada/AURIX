"""Portfolio / spending insights.

Mock, rule-based summaries — not a trained recommendation model. See
docs/MOBILE_UX.md "AI Features (Mobile-facing)" for the intended feature
set: spending insights, investment suggestions, smart notifications.
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/insights", tags=["insights"])


class AssetBalance(BaseModel):
    asset: str
    balance: float


class PortfolioInsightsRequest(BaseModel):
    balances: list[AssetBalance]


class PortfolioInsightsResponse(BaseModel):
    summary: str
    suggestions: list[str]


@router.post("/portfolio", response_model=PortfolioInsightsResponse)
def portfolio_insights(req: PortfolioInsightsRequest) -> PortfolioInsightsResponse:
    total = sum(b.balance for b in req.balances)
    suggestions: list[str] = []

    if total == 0:
        return PortfolioInsightsResponse(
            summary="No balances yet — fund your wallet to get personalized insights.",
            suggestions=["Top up your fiat wallet", "Set a savings goal"],
        )

    fiat = next((b.balance for b in req.balances if b.asset == "FIAT"), 0)
    gold = next((b.balance for b in req.balances if b.asset == "GOLD"), 0)
    silver = next((b.balance for b in req.balances if b.asset == "SILVER"), 0)

    fiat_share = fiat / total if total else 0
    if fiat_share > 0.7:
        suggestions.append(
            "Most of your balance is sitting in fiat — consider moving some into gold or silver savings."
        )
    if gold == 0 and silver == 0:
        suggestions.append("You haven't started a gold or silver position yet.")
    if gold > 0 and silver == 0:
        suggestions.append("Consider diversifying part of your metal holdings into silver.")

    if not suggestions:
        suggestions.append("Your portfolio looks reasonably balanced.")

    return PortfolioInsightsResponse(
        summary=f"Total portfolio value across tracked assets: {total:.2f} units.",
        suggestions=suggestions,
    )


class SavingsNudgeRequest(BaseModel):
    goal_name: str
    target_amount: float = Field(gt=0)
    current_amount: float = Field(ge=0)


class SavingsNudgeResponse(BaseModel):
    percent_complete: float
    message: str


@router.post("/savings-nudge", response_model=SavingsNudgeResponse)
def savings_nudge(req: SavingsNudgeRequest) -> SavingsNudgeResponse:
    percent = min(req.current_amount / req.target_amount * 100, 100)
    if percent >= 100:
        message = f"You've reached your \"{req.goal_name}\" goal!"
    elif percent >= 75:
        message = f"Almost there — \"{req.goal_name}\" is {percent:.0f}% funded."
    else:
        message = f"\"{req.goal_name}\" is {percent:.0f}% funded. Keep going!"

    return SavingsNudgeResponse(percent_complete=round(percent, 1), message=message)
