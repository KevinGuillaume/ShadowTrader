from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TeamLocationSplits(BaseModel):
    """
    Pydantic model representing the team_location_splits table.
    Stores team performance metrics split by home vs away games.
    """
    id: int = Field(..., description="Auto-incrementing primary key")
    team_id: int = Field(..., description="Foreign key to teams.id")
    season: str = Field(..., description="Season string e.g. '2024-25'")
    location: str = Field(..., description="'home' or 'away'")

    # Record
    games: int = Field(..., description="Games played at this location")
    wins: int = Field(..., description="Wins at this location")
    losses: int = Field(..., description="Losses at this location")
    win_pct: float = Field(..., description="Win percentage (0.0 to 1.0)")

    # Scoring
    points_per_game: float = Field(..., description="Average points scored per game")
    points_against_per_game: float = Field(..., description="Average points allowed per game")
    plus_minus: float = Field(..., description="Average point differential per game")

    # Shooting percentages
    field_goal_pct: float = Field(..., description="Field goal percentage")
    three_pt_pct: float = Field(..., description="Three-point percentage")
    free_throw_pct: float = Field(..., description="Free throw percentage")

    # Per-game stats
    rebounds_per_game: float = Field(..., description="Rebounds per game")
    assists_per_game: float = Field(..., description="Assists per game")
    steals_per_game: float = Field(..., description="Steals per game")
    blocks_per_game: float = Field(..., description="Blocks per game")
    turnovers_per_game: float = Field(..., description="Turnovers per game")

    # Advanced metrics (optional - may not always be available)
    offensive_rating: Optional[float] = Field(None, description="Points scored per 100 possessions")
    defensive_rating: Optional[float] = Field(None, description="Points allowed per 100 possessions")
    net_rating: Optional[float] = Field(None, description="Net rating (OFF_RTG - DEF_RTG)")

    # Metadata
    last_updated: datetime = Field(..., description="When this record was last updated")


class TeamLocationSplitsResponse(BaseModel):
    """Response model for team location splits API endpoint."""
    team_id: int
    team_name: str
    season: str
    home: Optional[TeamLocationSplits] = None
    away: Optional[TeamLocationSplits] = None
