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