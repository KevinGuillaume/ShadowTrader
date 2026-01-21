from fastapi import APIRouter
from resources.singletons import league_controller
from resources.singletons import supabase

league_router = APIRouter(
    prefix="/api/v1/league",
    tags=["League"]
)

@league_router.get(
    "/{league}",
    name="Gets all markets associated with a league"
)
async def get_league_markets(
    league: str
):
    """Gets all markets associated with a league"""
    print("Supabase connection: ", supabase)
    response = supabase.table('players').select("*").execute()
    todos = response.data
    print("Raw response:", response)
    print("Data:", response.data)
    print("Data length:", len(response.data))

    for todo in todos:
        print(todo)
    return await league_controller.get_markets_by_league(league)


@league_router.get(
    "/{league}/{teamName}",
    name="Gets a roster for the passed in team and league"
)
async def get_roster_for_team(
    league:str,
    teamName:str
):
    """Gets a roster for the passed in team and league"""
    return await league_controller.get_team_rosters_by_league_and_team(league,teamName)
