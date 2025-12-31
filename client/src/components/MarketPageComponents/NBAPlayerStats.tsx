const NBAPlayerStats: React.FC<{
    stats:any;
    games: number;
    opponentName?: string;
}> = ({stats, games, opponentName = ""}) => {

    return (
        <div className="space-y-2">
          <div className="flex items-baseline gap-4 text-sm flex-wrap">
            <div>
              <span className="text-2xl font-bold text-blue-400">
                {stats.avg_points?.toFixed(1) ?? '—'}
              </span>
              <span className="text-xs text-gray-500 ml-1">PPG</span>
            </div>
            <div>
              <span className="text-xl font-semibold text-white">
                {stats.avg_rebounds?.toFixed(1) ?? '—'}
              </span>
              <span className="text-xs text-gray-500 ml-1">RPG</span>
            </div>
            <div>
              <span className="text-xl font-semibold text-white">
                {stats.avg_assists?.toFixed(1) ?? '—'}
              </span>
              <span className="text-xs text-gray-500 ml-1">APG</span>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            vs <span className="text-gray-200 font-medium">{opponentName}</span> • {games} game
            {games !== 1 ? 's' : ''}
          </div>

          {stats.avg_fg_percentage > 0 && (
            <div className="inline-block px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 mt-1">
              FG% {stats.avg_fg_percentage.toFixed(1)}%
            </div>
          )}
        </div>
      );
}

export default NBAPlayerStats;