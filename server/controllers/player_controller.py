import aiohttp
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from resources.constants import LEAGUE_TO_SPORT


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
    def __init__(self):
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

        url = (
            f"https://site.web.api.espn.com/apis/common/v3/sports/"
            f"{sport_path}/athletes/{athlete_id}/gamelog"
        )

        print(f"Fetching ESPN gamelog: {url}")

        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; PolymarketApp/1.0)",
            "Accept": "application/json",
        }

        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, headers=headers, timeout=15) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ValueError(
                            f"ESPN returned status {response.status}: {error_text}"
                        )

                    data = await response.json()

                    labels: List[str] = data.get("labels", [])
                    events: Dict[str, Any] = data.get("events", {})
                    season_types: List[Dict] = data.get("seasonTypes", [])

                    if not labels or not events or not season_types:
                        raise ValueError("Missing required fields in ESPN response")

                    # Find stat indices dynamically (NBA-specific for now)
                    try:
                        min_idx = labels.index("MIN")
                        fg_idx = labels.index("FG")
                        reb_idx = labels.index("REB")
                        ast_idx = labels.index("AST")
                        stl_idx = labels.index("STL")
                        blk_idx = labels.index("BLK")
                        pts_idx = labels.index("PTS")
                    except ValueError as e:
                        raise ValueError(f"Missing required stat labels in response: {str(e)}")

                    normalized_opponent = opponent_name.lower().strip()

                    total_points = total_rebounds = total_assists = 0
                    total_steals = total_blocks = total_fg_made = total_fg_a = 0
                    game_count = 0

                    for st in season_types:
                        for category in st.get("categories", []):
                            for game in category.get("events", []):
                                event_id = game.get("eventId")
                                if not event_id:
                                    continue

                                meta = events.get(event_id)
                                if not meta:
                                    continue

                                opp_display = meta.get("opponent", {}).get("displayName", "").lower()

                                # Process only when opponent matches
                                if normalized_opponent not in opp_display:
                                    continue
                                print(f"Match found: {normalized_opponent} in {opp_display}")

                                stats_list: List[str] = game.get("stats", [])
                                if len(stats_list) <= pts_idx:
                                    continue

                                # Skip DNP/inactive
                                min_str = stats_list[min_idx]
                                if min_str in ("0", "--", ""):
                                    continue

                                # Parse FG "made-attempted"
                                fg_str = stats_list[fg_idx]
                                if fg_str == "--":
                                    continue
                                fg_parts = fg_str.split("-")
                                if len(fg_parts) != 2:
                                    continue
                                try:
                                    fg_made = int(fg_parts[0])
                                    fg_a = int(fg_parts[1])
                                    if fg_a == 0:
                                        continue
                                except ValueError:
                                    continue

                                # Parse main stats safely
                                try:
                                    points = int(stats_list[pts_idx])
                                    rebounds = int(stats_list[reb_idx]) if reb_idx < len(stats_list) else 0
                                    assists = int(stats_list[ast_idx]) if ast_idx < len(stats_list) else 0
                                    steals = int(stats_list[stl_idx]) if stl_idx < len(stats_list) else 0
                                    blocks = int(stats_list[blk_idx]) if blk_idx < len(stats_list) else 0
                                except (ValueError, IndexError):
                                    continue

                                game_count += 1
                                total_points += points
                                total_rebounds += rebounds
                                total_assists += assists
                                total_steals += steals
                                total_blocks += blocks
                                total_fg_made += fg_made
                                total_fg_a += fg_a

                    if game_count == 0:
                        return PlayerAveragesVsOpponent(games_played=0)

                    return PlayerAveragesVsOpponent(
                        games_played=game_count,
                        avg_points=total_points / game_count,
                        avg_rebounds=total_rebounds / game_count,
                        avg_assists=total_assists / game_count,
                        avg_steals=total_steals / game_count,
                        avg_blocks=total_blocks / game_count,
                        avg_fg_percentage=(total_fg_made / total_fg_a * 100) if total_fg_a > 0 else 0.0,
                    )

            except aiohttp.ClientError as e:
                raise ValueError(f"Failed to fetch ESPN gamelog: {str(e)}")



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

        sport_path = LEAGUE_TO_SPORT.get("nfl")
        if not sport_path:
            raise ValueError("Missing NFL sport path in constants")

        url = (
            f"https://site.web.api.espn.com/apis/common/v3/sports/"
            f"{sport_path}/athletes/{athlete_id}/gamelog"
        )
        print(f"Fetching NFL gamelog: {url}")

        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; PolymarketApp/1.0)",
            "Accept": "application/json",
        }

        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url, headers=headers, timeout=15) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ValueError(f"ESPN returned {response.status}: {error_text}")

                    data = await response.json()

                    if len(data.get("labels", [])) == 0:
                        return NFLPlayerAveragesVsOpponent(games_played=0)

                    labels: List[str] = data.get("labels", [])
                    events: Dict[str, Any] = data.get("events", {})
                    season_types: List[Dict] = data.get("seasonTypes", [])

                    # Block detection
                    pass_yds_idx = pass_td_idx = int_idx = -1
                    rush_att_idx = rush_yds_idx = rush_td_idx = -1
                    rec_idx = rec_yds_idx = rec_td_idx = -1

                    in_passing_block = in_rushing_block = in_receiving_block = False

                    for i, label in enumerate(labels):
                        if label in ("CMP", "ATT", "QBR", "RTG", "SACK"):
                            in_passing_block = True
                            in_rushing_block = in_receiving_block = False

                        elif label in ("CAR", "RUSH_ATT", "RUSH"):
                            in_rushing_block = True
                            in_passing_block = in_receiving_block = False
                            rush_att_idx = i

                        elif label in ("REC", "TGT", "RECEPTIONS"):
                            in_receiving_block = True
                            in_passing_block = in_rushing_block = False
                            rec_idx = i

                        elif label == "YDS":
                            if in_passing_block and pass_yds_idx == -1:
                                pass_yds_idx = i
                            elif in_rushing_block and rush_yds_idx == -1:
                                rush_yds_idx = i
                            elif in_receiving_block and rec_yds_idx == -1:
                                rec_yds_idx = i
                            elif pass_yds_idx == -1:
                                pass_yds_idx = i  # fallback

                        elif label == "TD":
                            if in_passing_block and pass_td_idx == -1:
                                pass_td_idx = i
                            elif in_rushing_block and rush_td_idx == -1:
                                rush_td_idx = i
                            elif in_receiving_block and rec_td_idx == -1:
                                rec_td_idx = i

                        elif label == "INT":
                            int_idx = i

                    # Additional fallbacks
                    if rush_yds_idx == -1 and rush_att_idx != -1 and rush_att_idx + 1 < len(labels):
                        if labels[rush_att_idx + 1] == "YDS":
                            rush_yds_idx = rush_att_idx + 1
                    if rush_td_idx == -1 and rush_att_idx != -1 and rush_att_idx + 2 < len(labels):
                        if labels[rush_att_idx + 2] == "TD":
                            rush_td_idx = rush_att_idx + 2
                    if rec_yds_idx == -1 and rec_idx != -1 and rec_idx + 1 < len(labels):
                        if labels[rec_idx + 1] == "YDS":
                            rec_yds_idx = rec_idx + 1
                    if rec_td_idx == -1 and rec_idx != -1 and rec_idx + 2 < len(labels):
                        if labels[rec_idx + 2] == "TD":
                            rec_td_idx = rec_idx + 2

                    normalized_opponent = opponent_name.lower().strip()

                    game_count = 0
                    total_pass_yds = total_pass_td = total_int = 0
                    total_rush_yds = total_rush_td = total_rec = 0
                    total_rec_yds = total_rec_td = 0

                    for st in season_types:
                        for cat in st.get("categories", []):
                            for game in cat.get("events", []):
                                event_id = game.get("eventId")
                                if not event_id:
                                    continue

                                meta = events.get(event_id)
                                if not meta:
                                    continue

                                opp_display = meta.get("opponent", {}).get("displayName", "").lower()
                                if normalized_opponent not in opp_display:
                                    continue

                                stats = game.get("stats", [])
                                if not stats:
                                    continue

                                # Skip DNP/inactive
                                if stats and stats[0] in ("0", "--", ""):
                                    continue

                                game_count += 1

                                # Accumulate safely
                                if pass_yds_idx >= 0 and pass_yds_idx < len(stats):
                                    try:
                                        total_pass_yds += int(stats[pass_yds_idx])
                                    except ValueError:
                                        pass
                                # ... repeat for all other stats (same pattern) ...

                                if pass_td_idx >= 0 and pass_td_idx < len(stats):
                                    try:
                                        total_pass_td += int(stats[pass_td_idx])
                                    except ValueError:
                                        pass
                                if int_idx >= 0 and int_idx < len(stats):
                                    try:
                                        total_int += int(stats[int_idx])
                                    except ValueError:
                                        pass
                                if rush_yds_idx >= 0 and rush_yds_idx < len(stats):
                                    try:
                                        total_rush_yds += int(stats[rush_yds_idx])
                                    except ValueError:
                                        pass
                                if rush_td_idx >= 0 and rush_td_idx < len(stats):
                                    try:
                                        total_rush_td += int(stats[rush_td_idx])
                                    except ValueError:
                                        pass
                                if rec_idx >= 0 and rec_idx < len(stats):
                                    try:
                                        total_rec += int(stats[rec_idx])
                                    except ValueError:
                                        pass
                                if rec_yds_idx >= 0 and rec_yds_idx < len(stats):
                                    try:
                                        total_rec_yds += int(stats[rec_yds_idx])
                                    except ValueError:
                                        pass
                                if rec_td_idx >= 0 and rec_td_idx < len(stats):
                                    try:
                                        total_rec_td += int(stats[rec_td_idx])
                                    except ValueError:
                                        pass

                    if game_count == 0:
                        return NFLPlayerAveragesVsOpponent(games_played=0)

                    avg = NFLPlayerAveragesVsOpponent(games_played=game_count)

                    if pass_yds_idx >= 0:
                        avg.avg_passing_yards = total_pass_yds / game_count
                    if pass_td_idx >= 0:
                        avg.avg_passing_tds = total_pass_td / game_count
                    if int_idx >= 0:
                        avg.avg_interceptions = total_int / game_count
                    if rush_yds_idx >= 0:
                        avg.avg_rushing_yards = total_rush_yds / game_count
                    if rush_td_idx >= 0:
                        avg.avg_rushing_tds = total_rush_td / game_count
                    if rec_idx >= 0:
                        avg.avg_receptions = total_rec / game_count
                    if rec_yds_idx >= 0:
                        avg.avg_receiving_yards = total_rec_yds / game_count
                    if rec_td_idx >= 0:
                        avg.avg_receiving_tds = total_rec_td / game_count

                    return avg

            except aiohttp.ClientError as e:
                raise ValueError(f"Failed to fetch ESPN NFL gamelog: {str(e)}")