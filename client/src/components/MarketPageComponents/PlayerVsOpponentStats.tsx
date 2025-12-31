import NBAPlayerStats from "./NBAPlayerStats";
import NFLPlayerStats from "./NFLPlayerStats";

const PlayerVsOpponentStats: React.FC<{
    stats: any;
    league: string;
    opponentName: string;
    isLoading?: boolean;
    isError?: boolean;
  }> = ({ stats, league, opponentName, isLoading = false, isError = false }) => {
    const normLeague = league.toLowerCase();

    if (isLoading) {
      return <div className="text-gray-500 text-xs animate-pulse">Loading vs {opponentName}...</div>;
    }
  
    if (isError) {
      return <span className="text-red-400 text-xs">Stats unavailable</span>;
    }
  
    if (!stats || typeof stats !== 'object') {
      return null;
    }
  
    const games = stats.games_played ?? 0;
  
    if (games === 0) {
      return <div className="text-gray-500 text-xs italic">No prior games vs {opponentName}</div>;
    }
  
    switch (normLeague) {
      case 'nba':
        return (
          <NBAPlayerStats 
              stats={stats}
              games={games}
              opponentName={opponentName}
          />
        );
  
      case 'nfl':
        return (
          <NFLPlayerStats
              stats={stats}
              games={games}
              opponentName={opponentName}
          />
            
        );
  
      default:
        return (
          <div className="text-gray-500 text-xs">
            Stats display not yet supported for {normLeague.toUpperCase()}
          </div>
        );
    }
  };


  export default PlayerVsOpponentStats;