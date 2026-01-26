import aiohttp
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from resources.constants import LEAGUE_TO_SPORT
from supabase import Client

class PlayerAveragesVsOpponent(BaseModel):
    games_played: int = 0
    avg_points: float = 0.0
    avg_rebounds: float = 0.0
    avg_assists: float = 0.0
    avg_steals: float = 0.0
    avg_blocks: float = 0.0
    avg_fg_percentage: float = 0.0


class NFLPlayerAveragesVsOpponent(BaseModel):
    games_played: int = 0
    avg_passing_yards: Optional[float] = None
    avg_passing_tds: Optional[float] = None
    avg_interceptions: Optional[float] = None
    avg_rushing_yards: Optional[float] = None
    avg_rushing_tds: Optional[float] = None
    avg_receptions: Optional[float] = None
    avg_receiving_yards: Optional[float] = None
    avg_receiving_tds: Optional[float] = None



class PlayerController:
    def __init__(self, db: Client):
        self.test = "test"
    async def get_nba_player_averages_vs_opponent(
        self,
        league: str,
        athlete_id: str,
        opponent_name: str,
    ) -> PlayerAveragesVsOpponent:
        """
        Fetch a player's career game log from ESPN and compute averages vs a specific opponent.
        """
        league = league.lower()
        sport_path = LEAGUE_TO_SPORT.get(league)
        if not sport_path:
            raise ValueError(f"Unsupported league: {league}")


        

    async def get_nfl_player_averages_vs_opponent(
        self,
        league: str,
        athlete_id: str,
        opponent_name: str,
    ) -> NFLPlayerAveragesVsOpponent:
        """
        Fetch an NFL player's game log from ESPN and compute career averages vs a specific opponent.
        Compatible with Python 3.8+ (no match/case required).
        """
        if league.lower() != "nfl":
            raise ValueError("This function is for NFL only")
        

        response = (
            self.db
            .table("players")
            .select("*, teams!inner(*)")
            .ilike("teams.team_name", f"%{team_name}%")
            .eq("teams.league_id", league_map[league])
            .execute()
        )

        

        