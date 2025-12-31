# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from routes.league_router import league_router
from routes.player_router import player_router

app = FastAPI(
    title="Sports Prediction Market API",
    description="Backend for Polymarket-style sports prediction markets with ESPN stats",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS - allow your frontend origin(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # dev
        "http://localhost:5173",      # Vite default
        "*"                           # temporary - tighten later!
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers with prefix
app.include_router(league_router)
app.include_router(player_router)

# Root endpoint - health check
@app.get("/", response_class=JSONResponse)
async def root():
    return {
        "status": "OK",
        "version": "0.1.0",
    }

# Global exception handler (optional but recommended)
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )
