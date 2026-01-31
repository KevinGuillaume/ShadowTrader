from controllers.league_controller import LeagueController
from controllers.player_controller import PlayerController
from controllers.team_controller import TeamController
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
from configparser import ConfigParser
import httpx


_config = ConfigParser()
_config.read("config.ini")

# # Configure Supabase client with increased timeout
# options = ClientOptions(
#     postgrest_client_timeout=30,  # 30 seconds timeout for database operations
# )

supabase: Client = create_client(
    _config.get("SERVER", "supabase_url"),
    _config.get("SERVER", "supabase_key"),
    # options=options
)

league_controller = LeagueController(supabase)
player_controller = PlayerController(supabase)
team_controller = TeamController(supabase)
