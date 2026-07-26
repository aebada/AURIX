# AURIX AI Service

FastAPI service. Currently **rule-based mocks** — no trained models. It
exists to give `services/backend` a real endpoint shape to call for the AI
features described in `docs/PRODUCT_PLAN.md` sections 3.7 and 4.

## Running locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Interactive API docs at `http://localhost:8001/docs`.

## What's implemented (mock)

- `POST /fraud/score-transaction` — rule-based risk score from amount,
  velocity, and new-recipient signals (not a trained fraud model)
- `POST /insights/portfolio` — rule-based portfolio summary and suggestions
- `POST /insights/savings-nudge` — goal-completion messaging
- `POST /governance/evaluate-proposal` — proposal scoring; always returns
  `requires_human_approval: true`

## A hard rule, not a detail

Per `docs/PRODUCT_PLAN.md` section 4 ("AI Governance Use"): AI may support
governance with recommendations, but must never autonomously execute
irreversible governance actions (fund movements, reserve/allocation
changes, compliance rule changes) without human approval. The
`/governance/evaluate-proposal` endpoint always sets
`requires_human_approval: true` — do not remove this when the mock is
replaced with a real model.

## What's explicitly not here yet

- Any trained model — everything above is deterministic, rule-based logic
- Real fraud/anomaly detection on live transaction data
- Reserve mismatch / proof-of-reserve anomaly detection (see
  `docs/PRODUCT_PLAN.md` "Continuous Proof-of-Reserve")
- Auth between this service and `services/backend` (currently open, no API key)

## Planned modules (per `docs/PRODUCT_PLAN.md`)

- Fraud detection / transaction anomaly detection
- Onboarding fraud scoring
- Portfolio insights and investment recommendations
- Smart savings suggestions
- Risk scoring for gold-backed lending
- Reserve mismatch / proof-of-reserve anomaly detection
- AI governance engine — trust scoring, proposal ranking, anomaly-based
  voting guidance (recommendations only; irreversible governance actions
  always require human approval)
