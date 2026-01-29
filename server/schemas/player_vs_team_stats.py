from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field

class PlayerVsTeamStats(BaseModel):
    """
    Pydantic model representing the player_vs_team_stats table.
    - All stat fields are optional (nullable in DB)
    - Uses Field for better serialization, descriptions, and validation
    """
    id: int = Field(..., description="Auto-incrementing primary key")
    player_id: int = Field(..., description="Foreign key to players.id")
    opponent_team_id: int = Field(..., description="Foreign key to teams.id")

    season_count: Optional[int] = Field(None, description="Number of seasons with data")
    games: Optional[int] = Field(None, description="Total games played vs opponent")
    starts: Optional[int] = Field(None, description="Games started vs opponent")

    wins: Optional[int] = Field(None, description="Team wins in those games")
    losses: Optional[int] = Field(None, description="Team losses in those games")
    ties: Optional[int] = Field(None, description="Team ties in those games (rare in NBA)")

    # NFL-specific stats (nullable for NBA players)
    passing_attempts: Optional[int] = Field(None, description="Passing attempts")
    passing_completions: Optional[int] = Field(None, description="Passing completions")
    passing_yards: Optional[int] = Field(None, description="Passing yards")
    passing_tds: Optional[int] = Field(None, description="Passing touchdowns")
    passing_ints: Optional[int] = Field(None, description="Passing interceptions")
    passing_sacks: Optional[int] = Field(None, description="Sacks taken")

    rushing_attempts: Optional[int] = Field(None, description="Rushing attempts")
    rushing_yards: Optional[int] = Field(None, description="Rushing yards")
    rushing_tds: Optional[int] = Field(None, description="Rushing touchdowns")

    receiving_targets: Optional[int] = Field(None, description="Receiving targets")
    receptions: Optional[int] = Field(None, description="Receptions")
    receiving_yards: Optional[int] = Field(None, description="Receiving yards")
    receiving_tds: Optional[int] = Field(None, description="Receiving touchdowns")

    # NBA-specific stats (nullable for NFL players)
    points: Optional[int] = Field(None, description="Total points scored")
    field_goal_attempts: Optional[int] = Field(None, description="Field goal attempts")
    field_goals_made: Optional[int] = Field(None, description="Field goals made")
    three_pt_attempts: Optional[int] = Field(None, description="Three-point attempts")
    three_pt_made: Optional[int] = Field(None, description="Three-pointers made")
    free_throw_attempts: Optional[int] = Field(None, description="Free throw attempts")
    free_throws_made: Optional[int] = Field(None, description="Free throws made")

    rebounds_total: Optional[int] = Field(None, description="Total rebounds")
    rebounds_offensive: Optional[int] = Field(None, description="Offensive rebounds")
    rebounds_defensive: Optional[int] = Field(None, description="Defensive rebounds")

    assists: Optional[int] = Field(None, description="Assists")
    steals: Optional[int] = Field(None, description="Steals")
    blocks: Optional[int] = Field(None, description="Blocks")
    turnovers: Optional[int] = Field(None, description="Turnovers")

    # Metadata
    last_game_date: Optional[date] = Field(None, description="Date of most recent game vs opponent")
    last_updated: datetime = Field(..., description="When this record was last updated")
