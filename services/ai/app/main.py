from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import fraud, governance, insights

app = FastAPI(
    title="AURIX AI Service",
    description="Fraud scoring, portfolio insights, and AI governance recommendations (mock implementations).",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "aurix-ai"}


app.include_router(fraud.router)
app.include_router(insights.router)
app.include_router(governance.router)
