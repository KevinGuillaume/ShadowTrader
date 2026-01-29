from typing import List, Dict, Any, Optional
from schemas import PlayerVsTeamStats
from datetime import date, datetime
from pydantic import BaseModel, Field
from resources.constants import LEAGUE_TO_SPORT, LEAGUE_NAME_TO_LEAGUE_ID
from supabase import Client

class PlayerController:
    def __init__(self, db: Client):
        self.test = "test"
        self.db = db


    def get_full_team_players_averages(self,
        league: str,
        team_name: str,
        opponent_name: str,):
        """Gets and builds a full teams averages against an opponent"""
        league = league.lower()
        sport_path = LEAGUE_TO_SPORT.get(league)
        league_id = LEAGUE_NAME_TO_LEAGUE_ID.get(league)

        if not league_id:
            return []

        # 1. Fetch team_id from supabase 'teams' table based on team_name and league_id
        team_response = (
            self.db
            .table("teams")
            .select("id")
            .ilike("team_name", f"%{team_name}%")
            .eq("league_id", league_id)
            .execute()
        )

        if not team_response.data:
            return []

        team_id = team_response.data[0]["id"]

        # 2. Fetch opponent_id from supabase 'teams' table based on opponent_name and league_id
        opponent_response = (
            self.db
            .table("teams")
            .select("id")
            .ilike("team_name", f"%{opponent_name}%")
            .eq("league_id", league_id)
            .execute()
        )

        if not opponent_response.data:
            return []

        opponent_id = opponent_response.data[0]["id"]


        # Get the current team's players stats against a team 
        teams_player_stats = self.get_team_players_stats_against_team(team_id=team_id,opponent_id=opponent_id)        

        full_team_averages = {
            "team_name": team_name,
            "team_id": team_id,
            "opponent_name": opponent_name,
            "opponent_id": opponent_id,
            "league": league,
            "all_players": []
        }


        # Calculate the averages for all these players
        for player in teams_player_stats:
            players_averages = self._get_player_averages_against_a_team(player=player)
            full_team_averages["all_players"].append(players_averages)


        return full_team_averages


    def get_team_players_stats_against_team(
        self,
        team_id: int,
        opponent_id: int,
    ) -> List[PlayerVsTeamStats]:
        """
        Fetches a teams players stats against a team from player_vs_team_stats table
        """
        

        # 3. Get all players from supabase 'players' table that are part of team_id
        players_response = (
            self.db
            .table("players")
            .select("id")
            .eq("team_id", team_id)
            .execute()
        )

        if not players_response.data:
            return []

        player_ids = [player["id"] for player in players_response.data]

        # 4. For each player part of team_id, get all the stats against the opponent_id obtained earlier
        stats_response = (
            self.db
            .table("player_vs_team_stats")
            .select("*")
            .in_("player_id", player_ids)
            .eq("opponent_team_id", opponent_id)
            .execute()
        )
        
        return [PlayerVsTeamStats(**stat) for stat in stats_response.data]


    
    def _get_player_averages_against_a_team(self, player: PlayerVsTeamStats) -> Dict[str, Any]:
        """Calculate a players averages using the data from player_vs_team_stats table"""
        games = player.games or 0

        # Fetch player info from players table
        player_info_response = (
            self.db
            .table("players")
            .select("first_name, last_name, photo_url")
            .eq("id", player.player_id)
            .execute()
        )

        player_info = player_info_response.data[0] if player_info_response.data else {}
        first_name = player_info.get("first_name", "")
        last_name = player_info.get("last_name", "")
        photo_url = player_info.get("photo_url", "")

        if games == 0:
            return {
                "player_id": player.player_id,
                "opponent_team_id": player.opponent_team_id,
                "games": 0,
                "first_name": first_name,
                "last_name": last_name,
                "photo_url": photo_url,
            }

        # Stats to average (cumulative stats that should be divided by games)
        stats_to_average = [
            # NFL stats
            "passing_attempts", "passing_completions", "passing_yards",
            "passing_tds", "passing_ints", "passing_sacks",
            "rushing_attempts", "rushing_yards", "rushing_tds",
            "receiving_targets", "receptions", "receiving_yards", "receiving_tds",
            # NBA stats
            "points", "field_goal_attempts", "field_goals_made",
            "three_pt_attempts", "three_pt_made",
            "free_throw_attempts", "free_throws_made",
            "rebounds_total", "rebounds_offensive", "rebounds_defensive",
            "assists", "steals", "blocks", "turnovers",
        ]

        averages = {
            "player_id": player.player_id,
            "opponent_team_id": player.opponent_team_id,
            "games": games,
            "starts": player.starts,
            "wins": player.wins,
            "losses": player.losses,
            "ties": player.ties,
            "last_game_date": player.last_game_date,
            "first_name": first_name,
            "last_name": last_name,
            "photo_url": photo_url,
        }

        for stat in stats_to_average:
            value = getattr(player, stat, None)
            if value is not None:
                averages[f"{stat}_avg"] = round(value / games, 2)

        return averages