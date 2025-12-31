// SidelineApp.tsx
import { useEffect, useState } from "react";
import { backendAPI } from "../api";
import LeagueBody from "../components/LeagueBody";

export default function SidelineApp() {
  const [data, setData] = useState<any[]>([]);
  const [leagueTab, setLeagueTab] = useState<string>("NFL");
  const [loading, setLoading] = useState<boolean>(true);

  const leagues = ["NFL", "NBA"]; // Can add more later

  async function init() {
    setLoading(true);
    try {
      const values = await backendAPI.getPolymarketEventsData(leagueTab);
      setData(values|| []);
    } catch (error) {
      console.error(`Failed to load ${leagueTab} data:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, [leagueTab]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Sideline Trader
        </h1>
        <p className="text-xl text-gray-400">
          Live Polymarket Odds • {leagueTab} Markets
        </p>
      </header>

      {/* Tab Selector */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex justify-center">
          <nav className="inline-flex rounded-xl bg-gray-800 p-1.5 shadow-xl border border-gray-700 gap-2">
            {leagues.map((league) => (
              <button
                key={league}
                onClick={() => setLeagueTab(league)}
                className={`
                  px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300
                  ${leagueTab === league
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }
                `}
              >
                {league}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-8"></div>
            <p className="text-2xl text-gray-400">Loading {leagueTab} markets...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-3xl text-gray-500">
              No active markets for {leagueTab} right now.
            </p>
            <p className="text-lg text-gray-600 mt-4">
              Check back later or try another league!
            </p>
          </div>
        ) : (
          <LeagueBody data={data} league={leagueTab} />
        )}
      </main>
    </div>
  );
}