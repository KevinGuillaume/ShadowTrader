import React from 'react';

interface ESPNAthlete {
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

interface PlayerVsStats {
  gamesPlayed: number;
  avgPoints: number;
  avgFGPercentage: number;
  avgRebounds: number;
  avgAssists: number;
}

interface TeamRosterProps {
  teamName: string;
  players: ESPNAthlete[];
  isLoading?: boolean;
  opponentName: string;
  playerStats: Record<string, PlayerVsStats | 'loading' | 'error'>;
}

const TeamRoster: React.FC<TeamRosterProps> = ({
  teamName,
  players,
  isLoading = false,
  opponentName,
  playerStats,
}) => {
  console.log("Players:", players);

  // Sort players: first those with games vs opponent (by PPG desc), then those with 0 games
  const sortedPlayers = React.useMemo(() => {
    return [...players].sort((a, b) => {
      const statsA = playerStats[a.id];
      const statsB = playerStats[b.id];

      // Extract gamesPlayed and PPG safely
      const hasGamesA = typeof statsA === 'object' && statsA.gamesPlayed > 0;
      const hasGamesB = typeof statsB === 'object' && statsB.gamesPlayed > 0;

      const ppgA = hasGamesA ? statsA.avgPoints : 0;
      const ppgB = hasGamesB ? statsB.avgPoints : 0;

      // Rule 1: Players with games come first
      if (hasGamesA && !hasGamesB) return -1;
      if (!hasGamesA && hasGamesB) return 1;

      // Rule 2: Within the "has games" group → sort by PPG descending
      if (hasGamesA && hasGamesB) {
        return ppgB - ppgA;
      }

      // Rule 3: Both have 0 games or invalid stats → keep original order (or alphabetical if preferred)
      return a.fullName.localeCompare(b.fullName);
    });
  }, [players, playerStats]);

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
            const stats = playerStats[player.id];

            return (
              <div
                key={player.id}
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700/70 transition-colors flex items-center gap-4 relative"
              >
                {/* Headshot */}
                <div className="flex-shrink-0">
                  {player.headshot?.href ? (
                    <img
                      src={player.headshot.href}
                      alt={player.fullName}
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
                      {player.fullName}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-gray-400">
                    {player.position?.abbreviation || player.position?.name || 'Unknown Position'}
                  </div>

                  {/* Stats Section */}
                  <div className="mt-3">
                    {stats === 'loading' ? (
                      <div className="text-gray-500 text-xs animate-pulse">Loading vs {opponentName}...</div>
                    ) : stats === 'error' ? (
                      <span className="text-red-400 text-xs">Stats unavailable</span>
                    ) : stats && typeof stats === 'object' ? (
                      stats.gamesPlayed > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-4 text-sm">
                            <div>
                              <span className="text-2xl font-bold text-blue-400">
                                {stats.avgPoints.toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">PPG</span>
                            </div>

                            {'avgRebounds' in stats && (
                              <div>
                                <span className="text-xl font-semibold text-white">
                                  {stats.avgRebounds.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500 ml-1">RPG</span>
                              </div>
                            )}

                            {'avgAssists' in stats && (
                              <div>
                                <span className="text-xl font-semibold text-white">
                                  {stats.avgAssists.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500 ml-1">APG</span>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-gray-400">
                            vs <span className="text-gray-200 font-medium">{opponentName}</span> •{' '}
                            {stats.gamesPlayed} game{stats.gamesPlayed !== 1 ? 's' : ''}
                          </div>

                          {'avgFGPercentage' in stats && stats.avgFGPercentage > 0 && (
                            <div className="inline-block px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 mt-1">
                              FG% {stats.avgFGPercentage.toFixed(1)}%
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs italic">
                          No prior games vs {opponentName}
                        </div>
                      )
                    ) : null}
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