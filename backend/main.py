from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from jd_analytics.router import router as jd_router
from resume_parsing.router import router as resume_router
from profile_builder.router import router as profile_router
from talent_check.router import router as talent_router
from skill_matching.router import router as skill_router
from explain.router import router as explain_router

app = FastAPI(title="RADIX Talent Match API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jd_router, prefix="/api/jd", tags=["JD Analytics"])
app.include_router(resume_router, prefix="/api/resume", tags=["Resume Parsing"])
app.include_router(profile_router, prefix="/api/profile", tags=["Profile Builder"])
app.include_router(talent_router, prefix="/api/talent", tags=["Talent Check"])
app.include_router(skill_router, prefix="/api/skill", tags=["Skill Matching"])
app.include_router(explain_router, prefix="/api/explain", tags=["AI Explanation"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
