# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from routes.league_router import league_router
from routes.player_router import player_router
from routes.market_router import market_router


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
market_router


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
