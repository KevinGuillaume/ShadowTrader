// src/pages/MarketPage/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketData } from '../hooks/useMarketData';
import MarketHeader from '../components/MarketPageComponents/MarketHeader';
import MarketOutcomes from '../components/MarketPageComponents/MarketOutcomes';
import MarketDates from '../components/MarketPageComponents/MarketDates';
import MarketRosters from '../components/MarketPageComponents/MarketRosters';
import MarketFooter from '../components/MarketPageComponents/MarketFooter';

const MarketPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    market,
    loadingMarket,
    teamRosterA,
    teamRosterB,
    loadingRosters,
    playerStats,
    error,
    league,
  } = useMarketData();

  if (loadingMarket) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center py-32">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-8"></div>
          <p className="text-2xl text-gray-400">Loading market details...</p>
        </div>
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

  if (!market) return null;

  const [teamAName, teamBName] = market.question
    ? market.question.split(" vs. ").map((t: string) => t.trim())
    : ['Team A', 'Team B'];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <MarketHeader
        title={market.question || market.title || 'Market Details'}
        onBack={() => navigate("/app")}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        {market.image && (
          <div className="mb-10">
            <img
              src={market.image}
              alt="Market illustration"
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
            />
          </div>
        )}

        {market.description && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-300 leading-relaxed">{market.description}</p>
          </section>
        )}

        <MarketOutcomes
          outcomes={parseJsonArray(market.outcomes)}
          outcomePrices={parseJsonArray(market.outcomePrices)}
        />

        <MarketDates
          endDate={market.endDate}
          startDate={market.startDate}
        />

        <MarketRosters
          league={league}
          teamAName={teamAName}
          teamBName={teamBName}
          teamRosterA={teamRosterA}
          teamRosterB={teamRosterB}
          loadingRosters={loadingRosters}
          error={error}
          playerStats={playerStats}
        />

        <MarketFooter market={market} />
      </main>
    </div>
  );
};

// Simple JSON array parser (unchanged)
const parseJsonArray = (field: string | undefined | null): any[] => {
  if (!field || typeof field !== 'string') return [];
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default MarketPage;