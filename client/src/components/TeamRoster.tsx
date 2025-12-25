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

interface TeamRosterProps {
  teamName: string;
  players: ESPNAthlete[];
  isLoading?: boolean;
}

const TeamRoster: React.FC<TeamRosterProps> = ({ teamName, players, isLoading = false }) => {
    console.log("Players: ", players)
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
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700/70 transition-colors flex items-center gap-4"
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamRoster;