# AURIX AI Services

Not yet scaffolded. Planned stack: Python.

Per `docs/PRODUCT_PLAN.md` sections 3.2 and 4, the AI layer is AURIX's core
differentiator — an AI governance model used in place of blockchain
consensus.

Planned modules:

- Fraud detection / transaction anomaly detection
- Onboarding fraud scoring
- Portfolio insights and investment recommendations
- Smart savings suggestions
- Risk scoring for gold-backed lending
- Reserve mismatch / proof-of-reserve anomaly detection
- AI governance engine — trust scoring, proposal ranking, anomaly-based
  voting guidance (recommendations only; irreversible governance actions
  always require human approval)

This service is consumed by `services/backend`, which does not exist yet.
