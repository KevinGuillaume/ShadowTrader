from typing import Optional
from supabase import Client

class TeamController:
    def __init__(self, db: Client):
        self.db = db

    def get_team_location_splits(
        self,
        team_id: int,
        season: Optional[str] = None
    ) -> dict:
        """
        Fetch home/away splits for a team.

        Args:
            team_id: Internal team ID
            season: Optional season string (e.g., '2024-25'). If None, returns latest.

        Returns:
            Dict with team info and home/away split data
        """
        # Get team info
        team_response = (
            self.db
            .table("teams")
            .select("id, team_name, abbreviation")
            .eq("id", team_id)
            .single()
            .execute()
        )

        if not team_response.data:
            raise ValueError(f"Team with id {team_id} not found")

        team = team_response.data

        # Build query for splits
        query = (
            self.db
            .table("team_location_splits")
            .select("*")
            .eq("team_id", team_id)
        )

        if season:
            query = query.eq("season", season)
        else:
            # Get the latest season
            query = query.order("season", desc=True)

        splits_response = query.execute()

        if not splits_response.data:
            return {
                "team_id": team["id"],
                "team_name": team["team_name"],
                "season": season or "N/A",
                "home": None,
                "away": None
            }

        # Group by location
        splits = splits_response.data
        season_str = splits[0]["season"] if splits else season

        home_split = next((s for s in splits if s["location"] == "home"), None)
        away_split = next((s for s in splits if s["location"] == "away"), None)

        return {
            "team_id": team["id"],
            "team_name": team["team_name"],
            "season": season_str,
            "home": home_split,
            "away": away_split
        }

    def get_team_location_splits_by_name(
        self,
        league: str,
        team_name: str,
        season: Optional[str] = None
    ) -> dict:
        """
        Fetch home/away splits for a team by name.

        Args:
            league: League slug (e.g., 'nba')
            team_name: Team name/slug (e.g., 'lakers')
            season: Optional season string

        Returns:
            Dict with team info and home/away split data
        """
        league_map = {"nfl": 1, "nba": 2}
        league_id = league_map.get(league.lower())

        if league_id is None:
            raise ValueError(f"Unknown league: {league}")

        # Find the team
        team_response = (
            self.db
            .table("teams")
            .select("id, team_name, abbreviation")
            .eq("league_id", league_id)
            .ilike("team_name", f"%{team_name}%")
            .single()
            .execute()
        )

        if not team_response.data:
            raise ValueError(f"Team '{team_name}' not found in {league.upper()}")

        return self.get_team_location_splits(team_response.data["id"], season)

    def get_matchup_location_context(
        self,
        home_team_id: int,
        away_team_id: int,
        season: Optional[str] = None
    ) -> dict:
        """
        Get location splits context for a matchup.
        Returns the home team's home record and away team's away record.

        Args:
            home_team_id: Internal team ID of home team
            away_team_id: Internal team ID of away team
            season: Optional season string

        Returns:
            Dict with home team's home splits and away team's away splits
        """
        home_splits = self.get_team_location_splits(home_team_id, season)
        away_splits = self.get_team_location_splits(away_team_id, season)

        return {
            "season": home_splits["season"],
            "home_team": {
                "team_id": home_splits["team_id"],
                "team_name": home_splits["team_name"],
                "home_record": home_splits["home"]
            },
            "away_team": {
                "team_id": away_splits["team_id"],
                "team_name": away_splits["team_name"],
                "away_record": away_splits["away"]
            }
        }

    def get_team_recent_form(
        self,
        team_id: int,
        season: Optional[str] = None,
        games_back: int = 10
    ) -> dict:
        """
        Fetch recent form (last N games) for a team.

        Args:
            team_id: Internal team ID
            season: Optional season string (e.g., '2024-25'). If None, returns latest.
            games_back: Number of recent games to consider (default 10)

        Returns:
            Dict with team info and recent form data
        """
        # Get team info
        team_response = (
            self.db
            .table("teams")
            .select("id, team_name, abbreviation")
            .eq("id", team_id)
            .single()
            .execute()
        )

        if not team_response.data:
            raise ValueError(f"Team with id {team_id} not found")

        team = team_response.data

        # Build query for recent form
        query = (
            self.db
            .table("team_recent_form")
            .select("*")
            .eq("team_id", team_id)
            .eq("games_back", games_back)
        )

        if season:
            query = query.eq("season", season)
        else:
            query = query.order("season", desc=True)

        form_response = query.limit(1).execute()

        if not form_response.data:
            return {
                "team_id": team["id"],
                "team_name": team["team_name"],
                "season": season or "N/A",
                "recent_form": None
            }

        form = form_response.data[0]

        return {
            "team_id": team["id"],
            "team_name": team["team_name"],
            "season": form["season"],
            "recent_form": form
        }

    def get_team_recent_form_by_name(
        self,
        league: str,
        team_name: str,
        season: Optional[str] = None,
        games_back: int = 10
    ) -> dict:
        """
        Fetch recent form for a team by name.

        Args:
            league: League slug (e.g., 'nba')
            team_name: Team name/slug (e.g., 'lakers')
            season: Optional season string
            games_back: Number of recent games (default 10)

        Returns:
            Dict with team info and recent form data
        """
        league_map = {"nfl": 1, "nba": 2}
        league_id = league_map.get(league.lower())

        if league_id is None:
            raise ValueError(f"Unknown league: {league}")

        # Find the team
        team_response = (
            self.db
            .table("teams")
            .select("id, team_name, abbreviation")
            .eq("league_id", league_id)
            .ilike("team_name", f"%{team_name}%")
            .single()
            .execute()
        )

        if not team_response.data:
            raise ValueError(f"Team '{team_name}' not found in {league.upper()}")

        return self.get_team_recent_form(team_response.data["id"], season, games_back)

    def get_matchup_momentum(
        self,
        team1_id: int,
        team2_id: int,
        season: Optional[str] = None,
        games_back: int = 10
    ) -> dict:
        """
        Compare recent form between two teams for a matchup.

        Args:
            team1_id: Internal team ID of first team
            team2_id: Internal team ID of second team
            season: Optional season string
            games_back: Number of recent games (default 10)

        Returns:
            Dict with both teams' recent form for comparison
        """
        team1_form = self.get_team_recent_form(team1_id, season, games_back)
        team2_form = self.get_team_recent_form(team2_id, season, games_back)

        return {
            "season": team1_form["season"],
            "games_back": games_back,
            "team1": {
                "team_id": team1_form["team_id"],
                "team_name": team1_form["team_name"],
                "recent_form": team1_form["recent_form"]
            },
            "team2": {
                "team_id": team2_form["team_id"],
                "team_name": team2_form["team_name"],
                "recent_form": team2_form["recent_form"]
            }
        }
