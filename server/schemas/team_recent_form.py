from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class RecentGame(BaseModel):
    """Individual game result for recent form display."""
    game_date: str
    opponent: str
    is_home: bool
    result: str  # 'W' or 'L'
    points_scored: int
    points_allowed: int


class TeamRecentForm(BaseModel):
    """
    Pydantic model representing the team_recent_form table.
    Stores team performance metrics over the last N games.
    """
    id: int = Field(..., description="Auto-incrementing primary key")
    team_id: int = Field(..., description="Foreign key to teams.id")
    season: str = Field(..., description="Season string e.g. '2024-25'")
    games_back: int = Field(..., description="Number of games in this sample (e.g., 10)")

    # Record
    games: int = Field(..., description="Games played in sample")
    wins: int = Field(..., description="Wins in sample")
    losses: int = Field(..., description="Losses in sample")
    win_pct: float = Field(..., description="Win percentage (0.0 to 1.0)")

    # Streak
    streak_type: str = Field(..., description="'W' for win streak, 'L' for loss streak")
    streak_count: int = Field(..., description="Number of consecutive W or L")

    # Scoring
    points_per_game: float = Field(..., description="Average points scored per game")
    points_against_per_game: float = Field(..., description="Average points allowed per game")
    point_differential: float = Field(..., description="Average point differential per game")

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

    # Date range
    first_game_date: date = Field(..., description="Date of oldest game in sample")
    last_game_date: date = Field(..., description="Date of most recent game")

    # Metadata
    last_updated: datetime = Field(..., description="When this record was last updated")


class TeamRecentFormResponse(BaseModel):
    """Response model for team recent form API endpoint."""
    team_id: int
    team_name: str
    season: str
    recent_form: Optional[TeamRecentForm] = None
    recent_games: Optional[List[RecentGame]] = None
