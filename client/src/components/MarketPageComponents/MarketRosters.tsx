import React, { useEffect, useState } from 'react';
import { backendAPI } from '../../api';
import type { FullTeamPlayersAverages, PlayerAverages } from '../../types/types';

interface MarketRostersProps {
  teamA: string;
  teamB: string;
  league: string;
}

interface TeamRosterData {
  data: FullTeamPlayersAverages | null;
  loading: boolean;
  error: string | null;
}

const MarketRosters: React.FC<MarketRostersProps> = ({ teamA, teamB, league }) => {
  const [teamAData, setTeamAData] = useState<TeamRosterData>({
    data: null,
    loading: true,
    error: null,
  });
  const [teamBData, setTeamBData] = useState<TeamRosterData>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTeamStats = async () => {
      // Fetch Team A stats (vs Team B)
      try {
        const teamAStats = await backendAPI.getTeamsPlayerStats(teamA, league, teamB);
        setTeamAData({ data: teamAStats, loading: false, error: null });
      } catch (err) {
        setTeamAData({ data: null, loading: false, error: 'Failed to load roster' });
      }

      // Fetch Team B stats (vs Team A)
      try {
        const teamBStats = await backendAPI.getTeamsPlayerStats(teamB, league, teamA);
        setTeamBData({ data: teamBStats, loading: false, error: null });
      } catch (err) {
        setTeamBData({ data: null, loading: false, error: 'Failed to load roster' });
      }
    };

    if (teamA && teamB && league) {
      fetchTeamStats();
    }
  }, []);

  const isNBA = league.toLowerCase() === 'nba';

  const renderPlayerStats = (player: PlayerAverages) => {
    if (isNBA) {
      return (
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          <div>
            <span className="text-gray-400 text-xs block">PTS</span>
            <span className="text-white font-medium">{player.points_avg?.toFixed(1) ?? '-'}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">REB</span>
            <span className="text-white font-medium">{player.rebounds_total_avg?.toFixed(1) ?? '-'}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">AST</span>
            <span className="text-white font-medium">{player.assists_avg?.toFixed(1) ?? '-'}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">STL</span>
            <span className="text-white font-medium">{player.steals_avg?.toFixed(1) ?? '-'}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">BLK</span>
            <span className="text-white font-medium">{player.blocks_avg?.toFixed(1) ?? '-'}</span>
          </div>
        </div>
      );
    }

    // NFL stats
    return (
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div>
          <span className="text-gray-400 text-xs block">PASS</span>
          <span className="text-white font-medium">{player.passing_yards_avg?.toFixed(1) ?? '-'}</span>
        </div>
        <div>
          <span className="text-gray-400 text-xs block">RUSH</span>
          <span className="text-white font-medium">{player.rushing_yards_avg?.toFixed(1) ?? '-'}</span>
        </div>
        <div>
          <span className="text-gray-400 text-xs block">REC</span>
          <span className="text-white font-medium">{player.receptions_avg?.toFixed(1) ?? '-'}</span>
        </div>
        <div>
          <span className="text-gray-400 text-xs block">REC YDS</span>
          <span className="text-white font-medium">{player.receiving_yards_avg?.toFixed(1) ?? '-'}</span>
        </div>
      </div>
    );
  };

  const renderTeamRoster = (teamData: TeamRosterData, teamName: string) => {
    if (teamData.loading) {
      return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">{teamName}</h3>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      );
    }

    if (teamData.error || !teamData.data) {
      return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">{teamName}</h3>
          <p className="text-gray-500 text-center py-8 italic">
            {teamData.error || 'No roster data available'}
          </p>
        </div>
      );
    }

    const { all_players, opponent_name } = teamData.data;

    if (all_players.length === 0) {
      return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">{teamName}</h3>
          <p className="text-gray-500 text-center py-8 italic">No players found</p>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-400">{teamName}</h3>
          <p className="text-sm text-gray-400">Player career averages vs {opponent_name}</p>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {all_players.map((player) => (
            <div
              key={player.player_id}
              className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {player.photo_url ? (
                    <img
                      src={player.photo_url}
                      alt={`${player.first_name} ${player.last_name}`}
                      className="w-10 h-10 rounded-full object-cover bg-gray-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        {player.first_name?.[0]}{player.last_name?.[0]}
                      </span>
                    </div>
                  )}
                  <span className="text-white font-medium">
                    {player.first_name} {player.last_name}
                  </span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  {player.games} {player.games === 1 ? 'game' : 'games'}
                </span>
              </div>
              {renderPlayerStats(player)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Team Rosters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTeamRoster(teamAData, teamA)}
        {renderTeamRoster(teamBData, teamB)}
      </div>
    </section>
  );
};

export default MarketRosters;
