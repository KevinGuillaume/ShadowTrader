// components/LeagueTab.tsx
import DisplayCard from "./DisplayCard";

interface LeagueTabProps {
  data: any[];              // Array of events
  league: string;           // league name for use later
}

export default function LeagueTab({ data, league }: LeagueTabProps) {
  // Generic title extractor 
  const extractTitle = (question: string): string => {
    if (question.includes("Any Other Player") || question.includes("Any Other Team")) {
      return "Any Other";
    }

    let cleaned = question.replace(/^Will\s+/, "").replace(/^Which\s+\w+\s+will\s+/, "");

    // League-specific cleanup
    switch (league) {
      case "NFL":
        cleaned = cleaned
          .replace(/ lead the NFL in passing yards.*$/i, "")
          .replace(/ lead the NFL in rushing yards.*$/i, "")
          .replace(/ lead the NFL in receiving yards.*$/i, "")
          .replace(/\s+win MVP.*$/i, "")
          .replace(/\s+this season\?$/i, "");
        break;

      case "NBA":
        cleaned = cleaned
          .replace(/ lead the NBA in points.*$/i, "")
          .replace(/ lead the NBA in rebounds.*$/i, "")
          .replace(/ lead the NBA in assists.*$/i, "")
          .replace(/\s+win MVP.*$/i, "")
          .replace(/\s+win Rookie of the Year.*$/i, "")
          .replace(/\s+this season\?$/i, "");
        break;

      case "MLB":
        cleaned = cleaned
          .replace(/ lead MLB in home runs.*$/i, "")
          .replace(/ lead MLB in batting average.*$/i, "")
          .replace(/ lead MLB in wins.*$/i, "")
          .replace(/\s+win MVP.*$/i, "")
          .replace(/\s+win Cy Young.*$/i, "")
          .replace(/\s+this season\?$/i, "");
        break;

      default:
        // Fallback: just remove common endings
        cleaned = cleaned.replace(/\s+this season\?$/i, "").replace(/\?$/i, "");
    }

    return cleaned.trim() || question;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-500">No markets available yet.</p>
      </div>
    );
  }

  return (
    <div>
      {data.map((event: any) => (
        <section key={event.title} className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-blue-400">
            {event.title}
          </h2>

          {event.markets && event.markets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {event.markets
                .sort((a: any, b: any) => {
                  const aProb = parseFloat(a.outcomePrices?.[0] || "0");
                  const bProb = parseFloat(b.outcomePrices?.[0] || "0");
                  return bProb - aProb; // Highest probability first
                })
                .map((market: any) => (
                  <DisplayCard
                    key={market.id}
                    market={market}
                    extractTitle={
                      event.title.toLowerCase().includes("leader") ||
                      event.title.toLowerCase().includes("mvp") ||
                      event.title.toLowerCase().includes("rookie") ||
                      event.title.toLowerCase().includes("cy young")
                        ? extractTitle
                        : undefined
                    }
                  />
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No markets available for this event.</p>
          )}
        </section>
      ))}
    </div>
  );
}