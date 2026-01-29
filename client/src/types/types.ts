export interface ESPNAthlete {
    id: string;
    team_id: number
    first_name: string;
    last_name: string;
    jersey?: string;
    position?: string;
    status: string;
    teams?: DBTeamObject
    created_at: string
    photo_url: string
}

export interface DBTeamObject {
  id: number;
  team_name: string;
  abbreviation: string;
  logo_url?: string;
  venue_id: number;
  league_id: number;
  created_at: string;
}
  
export interface TeamRosterProps {
    league: string; // NEW: required - 'nba', 'nfl', etc.
    teamName: string;
    players: ESPNAthlete[];
    isLoading?: boolean;
    opponentName: string;
    playerStats: Record<string, any | 'loading' | 'error'>; // more generic type
}
  
export interface PlayerVsStats {
    gamesPlayed: number;
    // NBA fields (optional)
    avgPoints?: number;
    avgRebounds?: number;
    avgAssists?: number;
    avgSteals?: number;
    avgBlocks?: number;
    avgFGPercentage?: number;
    // NFL fields (optional)
    avgPassingYards?: number;
    avgPassingTDs?: number;
    avgInterceptions?: number;
    avgRushingYards?: number;
    avgRushingTDs?: number;
    avgReceptions?: number;
    avgReceivingYards?: number;
    avgReceivingTDs?: number;
}


export interface PlayerVsTeamStats {
  id: number;
  player_id: number;
  opponent_team_id: number;

  season_count?: number | null;
  games?: number | null;
  starts?: number | null;

  wins?: number | null;
  losses?: number | null;
  ties?: number | null;

  passing_attempts?: number | null;
  passing_completions?: number | null;
  passing_yards?: number | null;
  passing_tds?: number | null;
  passing_ints?: number | null;
  passing_sacks?: number | null;

  rushing_attempts?: number | null;
  rushing_yards?: number | null;
  rushing_tds?: number | null;

  receiving_targets?: number | null;
  receptions?: number | null;
  receiving_yards?: number | null;
  receiving_tds?: number | null;

  points?: number | null;
  field_goal_attempts?: number | null;
  field_goals_made?: number | null;
  three_pt_attempts?: number | null;
  three_pt_made?: number | null;
  free_throw_attempts?: number | null;
  free_throws_made?: number | null;

  rebounds_total?: number | null;
  rebounds_offensive?: number | null;
  rebounds_defensive?: number | null;

  assists?: number | null;
  steals?: number | null;
  blocks?: number | null;
  turnovers?: number | null;

  last_game_date?: Date | null;     // Parsed Date object
  last_updated: Date;               // Parsed Date object
}

export interface PlayerAverages {
  player_id: number;
  opponent_team_id: number;
  games: number;
  starts?: number | null;
  wins?: number | null;
  losses?: number | null;
  ties?: number | null;
  last_game_date?: string | null;
  first_name: string;
  last_name: string;
  photo_url: string;

  // NFL average stats
  passing_attempts_avg?: number;
  passing_completions_avg?: number;
  passing_yards_avg?: number;
  passing_tds_avg?: number;
  passing_ints_avg?: number;
  passing_sacks_avg?: number;
  rushing_attempts_avg?: number;
  rushing_yards_avg?: number;
  rushing_tds_avg?: number;
  receiving_targets_avg?: number;
  receptions_avg?: number;
  receiving_yards_avg?: number;
  receiving_tds_avg?: number;

  // NBA average stats
  points_avg?: number;
  field_goal_attempts_avg?: number;
  field_goals_made_avg?: number;
  three_pt_attempts_avg?: number;
  three_pt_made_avg?: number;
  free_throw_attempts_avg?: number;
  free_throws_made_avg?: number;
  rebounds_total_avg?: number;
  rebounds_offensive_avg?: number;
  rebounds_defensive_avg?: number;
  assists_avg?: number;
  steals_avg?: number;
  blocks_avg?: number;
  turnovers_avg?: number;
}

export interface FullTeamPlayersAverages {
  team_name: string;
  team_id: number;
  opponent_name: string;
  opponent_id: number;
  league: string;
  all_players: PlayerAverages[];
}