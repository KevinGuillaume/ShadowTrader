// src/pages/MarketPage/components/MarketRosters.tsx
import React from 'react';
import TeamRoster from './TeamRoster';
import type { ESPNAthlete, PlayerVsStats } from '../../types/types';

interface MarketRostersProps {
  league: string;
  teamAName: string;
  teamBName: string;
  teamRosterA: ESPNAthlete[];
  teamRosterB: ESPNAthlete[];
  loadingRosters: boolean;
  error?: string | null;
  playerStats: Record<string, PlayerVsStats | 'loading' | 'error'>;
}

const MarketRosters: React.FC<MarketRostersProps> = ({
  league,
  teamAName,
  teamBName,
  teamRosterA,
  teamRosterB,
  loadingRosters,
  error,
  playerStats,
}) => {
  if (loadingRosters) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 text-center mb-10">
        <div className="text-center py-32">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-8"></div>
          <p className="text-2xl text-gray-400">Loading team rosters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 text-center mb-10">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-12">
      <TeamRoster
        league={league}
        teamName={teamAName}
        players={teamRosterA}
        isLoading={false}
        opponentName={teamBName}
        playerStats={playerStats}
      />
      <TeamRoster
        league={league}
        teamName={teamBName}
        players={teamRosterB}
        isLoading={false}
        opponentName={teamAName}
        playerStats={playerStats}
      />
    </div>
  );
};

export default MarketRosters;