# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from routes.league_router import league_router
from routes.player_router import player_router
from routes.market_router import market_router
from routes.team_router import team_router

# Rate limiter - 60 requests per minute per IP
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI(
    title="Sports Prediction Market API",
    description="Backend for Polymarket-style sports prediction markets with ESPN stats",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS - allow your frontend origin(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173/",          # Vite default dev server
        "http://127.0.0.1:5173",
        "http://localhost:3000",          # if using Create React App
        "http://127.0.0.1:3000",
        "*"                               # Temporary: allow all (for dev only!)
    ],
    allow_credentials=True,
    allow_methods=["*"],                  # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],                  # Allow any headers
)

# Include API routers with prefix
app.include_router(league_router)
app.include_router(player_router)
app.include_router(market_router)
app.include_router(team_router)


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
