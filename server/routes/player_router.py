from fastapi import APIRouter
from resources.singletons import player_controller


player_router = APIRouter(
    prefix="/api/v1/player",
    tags=["League"]
)

@player_router.get(
    "/{league}/{athleteID}/stats-vs/{opponent}",
    name="Gets a players stats against a teams for the given season from ESPN"
)
async def get_players_stats_vs_team(
    league: str,
    athleteID: str,
    opponent: str
):  
    """Gets a players stats against a teams for the given season from ESPN"""
    if league == "nba":
        return await player_controller.get_nba_player_averages_vs_opponent(league,athleteID,opponent)
    elif league == "nfl":
        return await player_controller.get_nfl_player_averages_vs_opponent(league,athleteID,opponent)

    else:
        return "League not supported"