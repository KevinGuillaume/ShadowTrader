export interface ESPNAthlete {
    id: string;
    fullName: string;
    jersey?: string;
    position?: {
      name: string;
      abbreviation: string;
    };
    headshot?: {
      href: string;
    };
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