import aiohttp
import json
from typing import List, Optional
from resources.constants import LEAGUE_TAG_IDS, LEAGUE_TO_SPORT, NBA_TEAM_IDS, NFL_TEAM_IDS
from supabase import Client


class LeagueController:
    def __init__(self, db: Client):
        self.test = "test"
        self.db = db
    
    
    async def get_markets_by_league(self,league: str):
        """
        Fetch active moneyline markets from Polymarket for a given league.
        
        Args:
            league: The league slug (e.g., "nba", "nfl")
            
        Returns:
            List of Market objects
            
        Raises:
            ValueError: If the league is unknown
            aiohttp.ClientError: If the HTTP request fails
            json.JSONDecodeError: If response cannot be parsed
        """
        league = league.lower()
        
        tag_id = LEAGUE_TAG_IDS.get(league)
        if tag_id is None:
            raise ValueError(f"Unknown league: {league}")
        
        url = (
            f"https://gamma-api.polymarket.com/markets"
            f"?sports_market_types=moneyline"
            f"&closed=false"
            f"&tag_id={tag_id}"
        )
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=15) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise aiohttp.ClientResponseError(
                        response.request_info,
                        response.history,
                        status=response.status,
                        message=f"Polymarket API error {response.status}: {error_text}"
                    )
                
                try:
                    data = await response.json()
                    # Assuming the response is a list of market objects
                    markets = [item for item in data]
                    return markets
                except json.JSONDecodeError as e:
                    raise ValueError(f"Failed to parse Polymarket response: {str(e)}")
                except Exception as e:
                    raise ValueError(f"Failed to deserialize markets: {str(e)}")

    async def get_market_by_id(self,market_id: int):
        """
        Fetch a single market by its ID from Polymarket's Gamma API.

        Args:
            market_id: The ID of the market to fetch

        Returns:
            Market: The parsed market object

        Raises:
            ValueError: For invalid responses, parsing errors, or unexpected status codes
            aiohttp.ClientError: For network/connection issues
        """
        url = f"https://gamma-api.polymarket.com/markets/{market_id}"

        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, timeout=15) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ValueError(
                            f"Polymarket API returned status {response.status}: {error_text}"
                        )

                    try:
                        data = await response.json()
                        # Parse into Pydantic model
                        market = data
                        return market
                    except Exception as parse_err:
                        error_text = await response.text()
                        raise ValueError(
                            f"Failed to parse market response: {str(parse_err)}\n"
                            f"Raw body: {error_text}"
                        )

            except aiohttp.ClientError as http_err:
                raise ValueError(f"Failed to fetch market from Polymarket: {str(http_err)}")

    async def get_team_rosters_by_league_and_team(
        self,
        league: str,
        team_name: str,
    ):
        """
        Fetch the roster for a team in a given league from our DB.

        Args:
            league: The league slug (e.g., "nba", "nfl")
            team_name: The lowercase team slug (e.g., "lakers", "chiefs")
        Raises:
            ValueError: For invalid league, unknown team, or other errors
            aiohttp.ClientError: For network issues
        """
        league = league.lower()
        team_name = team_name.lower()
        # Default positions to search for so it doesn't return like 50 people back
        skill_positions = ["QB", "RB", "WR", "TE", "P", "K"]
        league_map = {
            "nfl": 1,
            "nba": 2
        }

        
        response = (
            self.db
            .table("players")
            .select("*, teams!inner(*)")
            .ilike("teams.team_name", f"%{team_name}%")
            .eq("teams.league_id", league_map[league])
            .execute()
        )

        return response.data

        
