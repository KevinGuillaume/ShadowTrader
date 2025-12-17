// SidelineApp.tsx
import { useEffect, useState } from "react";
import { backendAPI } from "./api";
import DisplayCard from "./components/DisplayCard"; // Adjust path as needed

export default function SidelineApp() {
  const [data, setData] = useState<any[]>([]);

  async function init() {
    const values = await backendAPI.getEventsData("NFL");
    // Assuming the response has a structure like { events: [ { title, markets: [...] }, ... ] }
    setData(values["events"] || []);
  }

  useEffect(() => {
    init();
  }, []);

  // Helper to extract player name from NFL passing leader questions
  const extractNFLPlayerName = (question: string): string => {
    if (question.includes("Any Other Player")) return "Any Other Player";
    if (question.startsWith("Will ")) {
      return question.slice(5).replace(/ lead the NFL in passing yards.*$/, "");
    }
    return question;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Sideline Trader
        </h1>
        <p className="text-xl text-gray-400">Live Polymarket Odds • NFL Markets</p>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        {data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">Loading markets...</p>
          </div>
        ) : (
          data.map((event: any) => (
            <section key={event.title} className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-blue-400">
                {event.title}
              </h2>

              {event.markets && event.markets.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {event.markets
                    .sort((a: any, b: any) => {
                      const aProb = parseFloat(a.outcomePrices?.[0] || '0');
                      const bProb = parseFloat(b.outcomePrices?.[0] || '0');
                      return bProb - aProb; // Highest probability first
                    })
                    .map((market: any) => (
                      <DisplayCard
                        key={market.id}
                        market={market}
                        extractTitle={
                          event.title.includes("Passing Yards Leader")
                            ? extractNFLPlayerName
                            : undefined
                        }
                      />
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">No markets available for this event.</p>
              )}
            </section>
          ))
        )}
      </main>
    </div>
  );
}