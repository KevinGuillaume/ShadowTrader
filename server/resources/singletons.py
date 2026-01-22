from controllers.league_controller import LeagueController
from controllers.player_controller import PlayerController
from supabase import create_client, Client
from configparser import ConfigParser


_config = ConfigParser()
_config.read("config.ini")

supabase: Client = create_client(_config.get("SERVER","supabase_url"),_config.get("SERVER","supabase_key"))
league_controller = LeagueController(supabase)
player_controller = PlayerController(supabase)
