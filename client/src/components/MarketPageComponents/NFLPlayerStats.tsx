const NFLPlayerStats: React.FC<{
    stats:any;
    games: number;
    opponentName?: string;
}> = ({stats, games, opponentName = ""}) => {

    return (
        <div className="space-y-2">
  <div className="flex flex-wrap gap-4 text-sm">
    {/* Passing Yards – big number for QBs */}
    {stats.avg_passing_yards !== null && (
      <div>
        <span className="text-2xl font-bold text-blue-400">
          {stats.avg_passing_yards.toFixed(0)}
        </span>
        <span className="text-xs text-gray-500 ml-1">Pass Yds</span>
      </div>
    )}

    {/* Passing TDs */}
    {stats.avg_passing_tds !== null && stats.avg_passing_tds > 0 && (
      <div>
        <span className="text-xl font-semibold text-white">
          {stats.avg_passing_tds.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500 ml-1">Pass TD</span>
      </div>
    )}

    {/* Interceptions */}
    {stats.avg_interceptions !== null && stats.avg_interceptions > 0 && (
      <div>
        <span className="text-xl font-semibold text-white">
          {stats.avg_interceptions.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500 ml-1">INT</span>
      </div>
    )}

    {/* Rushing Yards – for RBs/QBs */}
    {stats.avg_rushing_yards !== null && (
      <div>
        <span className="text-2xl font-bold text-blue-400">
          {stats.avg_rushing_yards.toFixed(0)}
        </span>
        <span className="text-xs text-gray-500 ml-1">Rush Yds</span>
      </div>
    )}

    {/* Receiving Yards – for WRs/TEs/RBs */}
    {stats.avg_receiving_yards !== null && (
      <div>
        <span className="text-xl font-semibold text-white">
          {stats.avg_receiving_yards.toFixed(0)}
        </span>
        <span className="text-xs text-gray-500 ml-1">Rec Yds</span>
      </div>
    )}

    {/* Receptions */}
    {stats.avg_receptions !== null && stats.avg_receptions > 0 && (
      <div>
        <span className="text-xl font-semibold text-white">
          {stats.avg_receptions.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500 ml-1">Rec</span>
      </div>
    )}
  </div>

  {/* Context line */}
  <div className="text-xs text-gray-400">
    vs <span className="text-gray-200 font-medium">{opponentName}</span> •{' '}
    {games} game{games !== 1 ? 's' : ''}
  </div>
</div>
      );
}

export default NFLPlayerStats;