// src/pages/MarketPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { backendAPI } from '../api';
import TeamRoster from '../components/TeamRoster';

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

// New type for the stats from your Go backend
interface PlayerVsStats {
  gamesPlayed: number;
  avgPoints: number;
  avgRebounds: number;
  avgAssists: number;
  avgSteals: number;
  avgBlocks: number;
  avgFGPercentage: number;
}

const MarketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();

  const passedMarket = state?.market;
  const passedLeague = state?.league;

  const [market, setMarket] = useState<any>(passedMarket || null);
  const [loadingMarket, setLoadingMarket] = useState(!passedMarket);
  const [teamRosterA, setTeamRosterA] = useState<ESPNAthlete[]>([]);
  const [teamRosterB, setTeamRosterB] = useState<ESPNAthlete[]>([]);
  const [loadingRosters, setLoadingRosters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: Store stats for each player (key = athlete ID)
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerVsStats | 'loading' | 'error'>>({});

  // Step 1: Load market data
  useEffect(() => {
    if (passedMarket) {
      setMarket(passedMarket);
      setLoadingMarket(false);
      return;
    }

    if (!id) {
      setError("No market ID provided");
      setLoadingMarket(false);
      return;
    }

    const fetchMarketById = async () => {
      setLoadingMarket(true);
      setError(null);
      try {
        const marketData = await backendAPI.getPolymarketMarketByID(id);
        setMarket(marketData);
      } catch (err) {
        console.error("Failed to fetch market by ID:", err);
        setError("Could not load market details");
      } finally {
        setLoadingMarket(false);
      }
    };

    fetchMarketById();
  }, [id, passedMarket]);

  const getLeagueFromSlug = (slug: string): string => {
    if (!slug) return 'nba';
    const prefix = slug.split('-')[0]?.toLowerCase();
    const knownLeagues = ['nba', 'nfl', 'mlb', 'nhl', 'soccer', 'ufc'];
    return knownLeagues.includes(prefix) ? prefix : 'nba';
  };

  // Step 2: Load rosters
  useEffect(() => {
    if (!market?.question) return;

    const fetchRosters = async () => {
      setLoadingRosters(true);
      setError(null);

      try {
        const teams = market.question.split(" vs. ").map((t: string) => t.trim());
        if (teams.length !== 2) throw new Error("Invalid market format");

        const [teamA, teamB] = teams;
        const league = getLeagueFromSlug(market.slug) || passedLeague || 'nba';

        const [rosterA, rosterB] = await Promise.all([
          backendAPI.getESPNRostersForTeam(league, teamA),
          backendAPI.getESPNRostersForTeam(league, teamB),
        ]);

        setTeamRosterA(rosterA || []);
        setTeamRosterB(rosterB || []);

        // Initialize all players as 'loading'
        const initialStats: Record<string, 'loading'> = {};
        [...(rosterA || []), ...(rosterB || [])].forEach(p => {
          initialStats[p.id] = 'loading';
        });
        setPlayerStats(initialStats);

        // Fetch stats for Team A players vs Team B
        for (const player of rosterA || []) {
          fetchPlayerStats(player.id, league, teamB);
        }
        // Fetch stats for Team B players vs Team A
        for (const player of rosterB || []) {
          fetchPlayerStats(player.id, league, teamA);
        }

      } catch (err) {
        console.error("Failed to load rosters:", err);
        setError("Could not load team rosters.");
      } finally {
        setLoadingRosters(false);
      }
    };

    const fetchPlayerStats = async (athleteId: string, league: string, opponent: string) => {
      try {
        const stats = await backendAPI.getPlayerAveragesVsOpponent(athleteId, league, opponent);
        setPlayerStats(prev => ({ ...prev, [athleteId]: stats }));
      } catch (err) {
        console.error(`Failed to load stats for player ${athleteId}`, err);
        setPlayerStats(prev => ({ ...prev, [athleteId]: 'error' }));
      }
    };

    fetchRosters();
  }, [market?.question, passedLeague, market?.slug]);

  // Rest of your parsing (unchanged)
  const parseJsonArray = (field: string | undefined | null): any[] => {
    if (!field || typeof field !== 'string') return [];
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const outcomes = parseJsonArray(market?.outcomes);
  const outcomePrices = parseJsonArray(market?.outcomePrices).map((p: any) =>
    typeof p === 'string' ? parseFloat(p) : Number(p)
  );

  const formattedEndDate = market?.endDate
    ? format(new Date(market.endDate), 'MMMM d, yyyy h:mm a')
    : 'TBD';

  const formattedStartDate = market?.startDate
    ? format(new Date(market.startDate), 'MMMM d, yyyy')
    : null;

  const [teamAName, teamBName] = market?.question
    ? market.question.split(" vs. ").map((t: string) => t.trim())
    : ['Team A', 'Team B'];

  if (loadingMarket) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Loading market details...
      </div>
    );
  }

  if (error && !market) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-400 text-xl mb-8 text-center">{error}</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-20 bg-gray-900 border-b border-gray-800 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/app")} className="flex items-center gap-2 text-gray-300 hover:text-white transition">
            <ArrowLeft size={20} />
            <span>Back to Markets</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold truncate max-w-[60%] text-center">
            {market.question || market.title || 'Market Details'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        {market.image && (
          <div className="mb-10">
            <img src={market.image} alt="Market illustration" className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl" />
          </div>
        )}

        {market.description && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-300 leading-relaxed">{market.description}</p>
          </section>
        )}

<section className="mb-12">
  <h2 className="text-2xl font-semibold mb-6">Outcomes</h2>

  {outcomes.length > 0 ? (
    <div className="space-y-4">
      {outcomes.map((outcome: string, idx: number) => {
        const price = outcomePrices[idx] ?? 0;
        const percentage = Math.round(price * 100);
        const isDefined = outcomePrices[idx] !== undefined;

        return (
          <div
            key={idx}
            className="relative bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Dynamic background bar that grows with probability */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-blue-500/10 transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />

            {/* Main content */}
            <div className="relative flex items-center justify-between px-6 py-5">
              <div className="flex-1 pr-6">
                <span className="text-lg font-medium text-white truncate">
                  {outcome}
                </span>
              </div>

              <div className="min-w-[6ch] text-right">
                {isDefined ? (
                  <span className="text-2xl font-bold text-blue-300 tracking-tight">
                    {percentage}%
                  </span>
                ) : (
                  <span className="text-gray-500 text-xl">—</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-500 text-center py-8 italic">
      No outcomes available
    </p>
  )}
</section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 mb-2">Market Ends</h3>
            <p className="text-xl font-medium">{formattedEndDate}</p>
          </div>
          {formattedStartDate && (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-gray-400 mb-2">Market Starts</h3>
              <p className="text-xl font-medium">{formattedStartDate}</p>
            </div>
          )}
        </section>

        {loadingRosters ? (
          <div className="bg-gray-800 rounded-2xl p-8 text-center mb-10">
            <p className="text-gray-400 text-lg">Loading team rosters...</p>
          </div>
        ) : error ? (
          <div className="bg-gray-800 rounded-2xl p-8 text-center mb-10">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-12">
            <TeamRoster
              teamName={teamAName}
              players={teamRosterA}
              isLoading={false}
              opponentName={teamBName}
              playerStats={playerStats}
            />
            <TeamRoster
              teamName={teamBName}
              players={teamRosterB}
              isLoading={false}
              opponentName={teamAName}
              playerStats={playerStats}
            />
          </div>
        )}

        <section className="text-sm text-gray-500 border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p><span className="font-medium text-gray-300">ID:</span> {market.id}</p>
            {market.slug && <p><span className="font-medium text-gray-300">Slug:</span> {market.slug}</p>}
            {market.conditionId && <p><span className="font-medium text-gray-300">Condition ID:</span> {market.conditionId}</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MarketPage;