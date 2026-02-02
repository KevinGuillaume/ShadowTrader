from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from resources.singletons import team_controller
from auth import verify_token

team_router = APIRouter(
    prefix="/api/v1/team",
    tags=["Team"],
    dependencies=[Depends(verify_token)]
)


@team_router.get(
    "/{league}/{team_name}/location-splits",
    name="Get team home/away splits"
)
def get_team_location_splits(
    league: str,
    team_name: str,
    season: Optional[str] = Query(None, description="Season (e.g., '2024-25'). Defaults to latest.")
):
    """
    Get home/away performance splits for a team.

    Returns win/loss records, scoring averages, and shooting percentages
    for both home and away games.
    """
    try:
        return team_controller.get_team_location_splits_by_name(league, team_name, season)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@team_router.get(
    "/matchup/location-context",
    name="Get location context for a matchup"
)
def get_matchup_location_context(
    home_team_id: int = Query(..., description="Internal team ID of home team"),
    away_team_id: int = Query(..., description="Internal team ID of away team"),
    season: Optional[str] = Query(None, description="Season (e.g., '2024-25')")
):
    """
    Get location-relevant splits for a head-to-head matchup.

    Returns the home team's home performance and away team's road performance,
    which is the most relevant comparison for predicting the matchup outcome.
    """
    try:
        return team_controller.get_matchup_location_context(home_team_id, away_team_id, season)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@team_router.get(
    "/{league}/{team_name}/recent-form",
    name="Get team recent form"
)
def get_team_recent_form(
    league: str,
    team_name: str,
    season: Optional[str] = Query(None, description="Season (e.g., '2024-25'). Defaults to latest."),
    games_back: int = Query(10, description="Number of recent games to consider", ge=1, le=20)
):
    """
    Get recent form (last N games) for a team.

    Returns win/loss record, current streak, scoring averages, and shooting
    percentages over the specified number of recent games.
    """
    try:
        return team_controller.get_team_recent_form_by_name(league, team_name, season, games_back)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@team_router.get(
    "/matchup/momentum",
    name="Get momentum comparison for a matchup"
)
def get_matchup_momentum(
    team1_id: int = Query(..., description="Internal team ID of first team"),
    team2_id: int = Query(..., description="Internal team ID of second team"),
    season: Optional[str] = Query(None, description="Season (e.g., '2024-25')"),
    games_back: int = Query(10, description="Number of recent games to consider", ge=1, le=20)
):
    """
    Compare recent form between two teams for matchup prediction.

    Returns both teams' recent performance including win streaks,
    scoring trends, and shooting efficiency over the last N games.
    """
    try:
        return team_controller.get_matchup_momentum(team1_id, team2_id, season, games_back)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
