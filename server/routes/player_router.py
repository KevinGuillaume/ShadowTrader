from fastapi import APIRouter
from resources.singletons import player_controller


player_router = APIRouter(
    prefix="/api/v1/player",
    tags=["League"]
)

@player_router.get(
    "/{league}/{team_name}/stats-vs/{opponent}",
    name="Gets all players stat averages on a team against a teams"
)
def get_players_stats_vs_team(
    league: str,
    team_name: str,
    opponent: str
):  
    """Gets all players stat averages on a team against a teams"""
    if league == "nba":
        return player_controller.get_full_team_players_averages(league,team_name,opponent)

    else:
        return "League not supported"