// src/pages/MarketPage/index.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MarketHeader from '../components/MarketPageComponents/MarketHeader';
import MarketOutcomes from '../components/MarketPageComponents/MarketOutcomes';
import MarketDates from '../components/MarketPageComponents/MarketDates';
import MarketFooter from '../components/MarketPageComponents/MarketFooter';
import MarketRosters from '../components/MarketPageComponents/MarketRosters';
import BasketballCourt3D from '../components/MarketPageComponents/BasketballCourt3D';
import TeamAnalytics from '../components/MarketPageComponents/TeamAnalytics';
import { backendAPI } from '../api';

const MarketPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [market,setMarket] = useState<any>([])
  const [loadingMarket,setLoadingMarket] = useState(true)
  const [error,setError] = useState("")
  const [league,setLeague] = useState("")
  const [percentageTeamA,setPercentageTeamA] = useState(0)
  const [percentageTeamB,setPercentageTeamB] = useState(0)

  async function init() {
    if(id) {
      try {
        const marketInfo = await backendAPI.getPolymarketMarketByID(id)
        console.log(marketInfo)
        const leagueExtracted = marketInfo?.slug.split('-')[0] 
        setLeague(leagueExtracted)
        setMarket(marketInfo)
        setLoadingMarket(false)
        

        // Calculate market outcome percentages
        
        const priceArr = parseJsonArray(marketInfo.outcomePrices)


        const price1 = priceArr[0] ?? 0;
        const price2 = priceArr[1] ?? 0;

        const percentage1 = Math.round(price1 * 100);
        const percentage2 = Math.round(price2 * 100);

        setPercentageTeamA(percentage1)
        setPercentageTeamB(percentage2)
      } catch (error) {
        setError("error fetching market")
      }
    }
  }

  useEffect(() => {
    init()
  },[id])


  




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
    <div
      className="min-h-screen text-white"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(255, 255, 255, 0.25) 0%, rgba(150, 180, 255, 0.12) 35%, #030712 65%)',
        backgroundColor: '#030712'
      }}
    >
      <MarketHeader
        title={market.question || market.title || 'Market Details'}
        onBack={() => navigate("/app")}
      />
      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8">

        <BasketballCourt3D teamA={teamAName} teamB={teamBName} percentA={percentageTeamA} percentB={percentageTeamB}/>

        {/* Information Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-white border-b border-gray-700 pb-4">
            Information
          </h2>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {market.description && (
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 text-gray-200">Description</h3>
                <p className="text-gray-400 leading-relaxed">{market.description}</p>
              </div>
            )}

            <div className="flex-1">
              <MarketOutcomes
                outcomes={parseJsonArray(market.outcomes)}
                outcomePrices={parseJsonArray(market.outcomePrices)}
              />
            </div>
          </div>

          <MarketDates
            endDate={market.endDate}
            startDate={market.startDate}
          />
        </section>

        {/* Analytics Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-white border-b border-gray-700 pb-4">
            Analytics
          </h2>

          {league && (
            <>
              <TeamAnalytics
                teamA={teamAName}
                teamB={teamBName}
                league={league}
              />

              <MarketRosters
                teamA={teamAName}
                teamB={teamBName}
                league={league}
              />
            </>
          )}
        </section>

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