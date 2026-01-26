import React from 'react';
import PlayerVsOpponentStats from './PlayerVsOpponentStats';
import type { TeamRosterProps } from '../../types/types';

const TeamRoster: React.FC<TeamRosterProps> = ({
  league,
  teamName,
  players,
  isLoading = false,
  opponentName,
  playerStats,
}) => {
  const normLeague = league.toLowerCase();
  // Sort players: those with games first (by primary stat desc), then those with 0 games
  const sortedPlayers = React.useMemo(() => {
    return [...players].sort((a, b) => {
      const statsA = playerStats[a.id];
      const statsB = playerStats[b.id];

      const hasGamesA = typeof statsA === 'object' && (statsA.games_played ?? 0) > 0;
      const hasGamesB = typeof statsB === 'object' && (statsB.games_played ?? 0) > 0;

      // Use primary stat for sorting within "has games" group
      const primaryA = normLeague === 'nfl' ? statsA?.avgPassingYards ?? 0 : statsA?.avg_points ?? 0;
      const primaryB = normLeague === 'nfl' ? statsB?.avgPassingYards ?? 0 : statsB?.avg_points ?? 0;

      if (hasGamesA && !hasGamesB) return -1;
      if (!hasGamesA && hasGamesB) return 1;

      if (hasGamesA && hasGamesB) {
        return primaryB - primaryA;
      }

      // Alphabetical fallback for no games
      return a.last_name.localeCompare(b.last_name);
    });
  }, [players, playerStats, league]);

  

  return (
    <div className="bg-gray-800 rounded-xl p-5 shadow-md border border-gray-700">
      {/* Team Header */}
      <h3 className="text-xl font-bold text-white mb-5 pb-3 border-b border-gray-700 flex items-center justify-between">
        <div>
          {teamName}
          <span className="ml-3 text-gray-400 text-base font-normal">
            ({players.length} players)
          </span>
        </div>
      </h3>

      {isLoading ? (
        <div className="text-gray-400 text-center py-10">Loading roster...</div>
      ) : players.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No players available</div>
      ) : (
        <div className="space-y-3">
          {sortedPlayers.map((player) => {
            const rawStats = playerStats[player.id];
            const isLoadingStats = rawStats === 'loading';
            const isErrorStats = rawStats === 'error';
            const statsObj = typeof rawStats === 'object' ? rawStats : null;

            return (
              <div
                key={player.id}
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700/70 transition-colors flex items-center gap-4 relative"
              >
                {/* Headshot */}
                <div className="flex-shrink-0">
                  {player?.photo_url ? (
                    <img
                      src={player?.photo_url}
                      alt={player.first_name + " " + player.last_name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-gray-600"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs font-medium">
                      No Photo
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3">
                    {player.jersey && (
                      <span className="text-xl font-bold text-gray-300 min-w-[3ch] text-right">
                        #{player.jersey}
                      </span>
                    )}
                    <span className="text-lg font-semibold text-white truncate">
                      {player.first_name + " " + player.last_name}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-gray-400">
                    {player?.position  || 'Unknown Position'}
                  </div>

                  {/* Dynamic Stats */}
                  <div className="mt-3">
                    <PlayerVsOpponentStats
                      stats={statsObj}
                      league={normLeague}
                      opponentName={opponentName}
                      isLoading={isLoadingStats}
                      isError={isErrorStats}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamRoster;