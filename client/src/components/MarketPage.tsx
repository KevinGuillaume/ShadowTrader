// src/pages/MarketPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { backendAPI } from '../api'; // adjust path as needed
import TeamRoster from '../components/TeamRoster'; // adjust path as needed

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

const MarketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Data that might come from navigation state (fast path)
  const passedMarket = state?.market;
  const passedLeague = state?.league;

  const [market, setMarket] = useState<any>(passedMarket || null);
  const [loadingMarket, setLoadingMarket] = useState(!passedMarket);
  const [teamRosterA, setTeamRosterA] = useState<ESPNAthlete[]>([]);
  const [teamRosterB, setTeamRosterB] = useState<ESPNAthlete[]>([]);
  const [loadingRosters, setLoadingRosters] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Load market data (either from state or fetch by ID)
  useEffect(() => {
    // Fast path: we already have the market from navigation state
    if (passedMarket) {
      setMarket(passedMarket);
      setLoadingMarket(false);
      return;
    }

    // Slow path: direct access / refresh / bookmark → fetch by ID
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
    if (!slug) return 'nba'; // ultimate fallback only if everything fails
  
    const parts = slug.split('-');
    if (parts.length < 1) return 'nba';
  
    const prefix = parts[0].toLowerCase();
  
    // Optional: validate known leagues to prevent garbage
    const knownLeagues = ['nba', 'nfl', 'mlb', 'nhl', 'soccer', 'ufc'];
    if (knownLeagues.includes(prefix)) {
      return prefix;
    }
  
    return 'nba'; // fallback only for unknown
  };

  // Step 2: Load rosters once we have market data
  useEffect(() => {
    if (!market?.question) return;

    const fetchRosters = async () => {
      setLoadingRosters(true);
      setError(null);

      try {
        const teams = market.question.split(" vs. ").map((t: string) => t.trim());

        if (teams.length !== 2) {
          throw new Error("Market question doesn't contain two teams in 'TeamA vs. TeamB' format");
        }

        const [teamA, teamB] = teams;
        const league = getLeagueFromSlug(market.slug) || passedLeague || 'nba';// flexible fallback

        const [rosterA, rosterB] = await Promise.all([
          backendAPI.getESPNRostersForTeam(league, teamA),
          backendAPI.getESPNRostersForTeam(league, teamB),
        ]);

        setTeamRosterA(rosterA || []);
        setTeamRosterB(rosterB || []);
      } catch (err) {
        console.error("Failed to load rosters:", err);
        setError("Could not load team rosters. Please try again later.");
      } finally {
        setLoadingRosters(false);
      }
    };

    fetchRosters();
  }, [market?.question, passedLeague, market?.league]);

  // Helper to safely parse JSON arrays
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

  // Loading / error states
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
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-gray-900 border-b border-gray-800 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Markets</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold truncate max-w-[60%] text-center">
            {market.question || market.title || 'Market Details'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        {/* Image */}
        {market.image && (
          <div className="mb-10">
            <img
              src={market.image}
              alt="Market illustration"
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
            />
          </div>
        )}

        {/* Rosters */}
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
            />
            <TeamRoster
              teamName={teamBName}
              players={teamRosterB}
              isLoading={false}
            />
          </div>
        )}

        {/* Description */}
        {market.description && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {market.description}
            </p>
          </section>
        )}

        {/* Outcomes */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Outcomes</h2>
          {outcomes.length > 0 ? (
            <div className="space-y-4">
              {outcomes.map((outcome: string, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800 p-5 rounded-xl border border-gray-700"
                >
                  <span className="text-lg font-medium">{outcome}</span>
                  {outcomePrices[idx] !== undefined && (
                    <span className="text-blue-400 font-bold text-2xl mt-3 sm:mt-0">
                      {(outcomePrices[idx] * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No outcomes available</p>
          )}
        </section>

        {/* Dates */}
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

        {/* Extra Info */}
        <section className="text-sm text-gray-500 border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p><span className="font-medium text-gray-300">ID:</span> {market.id}</p>
            {market.slug && <p><span className="font-medium text-gray-300">Slug:</span> {market.slug}</p>}
            {market.conditionId && (
              <p><span className="font-medium text-gray-300">Condition ID:</span> {market.conditionId}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MarketPage;