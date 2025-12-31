import aiohttp
import json
from typing import List, Optional

from resources.constants import LEAGUE_TAG_IDS, LEAGUE_TO_SPORT, NBA_TEAM_IDS, NFL_TEAM_IDS

class LeagueController:
    def __init__(self):
        self.test = "test"
    
    
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
        Fetch the roster for a team in a given league from ESPN's API.

        Args:
            league: The league slug (e.g., "nba", "nfl")
            team_name: The lowercase team slug (e.g., "lakers", "chiefs")
        Raises:
            ValueError: For invalid league, unknown team, or API errors
            aiohttp.ClientError: For network issues
        """
        league = league.lower()
        team_name = team_name.lower()

        # Get sport path
        sport_path = LEAGUE_TO_SPORT.get(league)
        if sport_path is None:
            raise ValueError(f"Unsupported league: {league}")

        # Get team ID based on league
        team_id_map = None
        if league == "nba":
            team_id_map = NBA_TEAM_IDS
        elif league == "nfl":
            team_id_map = NFL_TEAM_IDS
        else:
            raise ValueError(f"Unsupported league: {league}")

        team_id = team_id_map.get(team_name)
        if team_id is None:
            raise ValueError(f"Unknown team: {team_name} in league {league}")

        url = f"https://site.web.api.espn.com/apis/site/v2/sports/{sport_path}/teams/{team_id}/roster"

        print(f"Fetching ESPN roster: {url}")  # Debug log

        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, timeout=15) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ValueError(f"ESPN returned {response.status}: {error_text}")

                    data = await response.json()

                    # Extract the athletes data (could be flat or nested)
                    athletes_data = data.get("athletes", [])

                    # Flatten players
                    players = []

                    # NBA: athletes is already a flat list of players
                    if league == "nba" and isinstance(athletes_data, list):
                        players = [p for p in athletes_data if p and p.get("id")]

                    # NFL: athletes is list of position groups, each with "items"
                    elif league == "nfl" and isinstance(athletes_data, list):
                        for position_group in athletes_data:
                            items = position_group.get("items", [])
                            if isinstance(items, list):
                                for player in items:
                                    if player and player.get("id"):
                                        players.append(player)

                    else:
                        print(f"Warning: Unexpected roster structure for {league}: {athletes_data}")
                        return []

                    print(f"Found {len(players)} players for {team_name} ({league})")
                    return players

            except aiohttp.ClientError as e:
                raise ValueError(f"Failed to fetch roster from ESPN: {str(e)}")
