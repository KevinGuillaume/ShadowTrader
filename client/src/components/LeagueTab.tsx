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
      {data.map((event: any,index) => (
        <section key={index} className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-blue-400">
            {event.question}
          </h2>

          {event ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <DisplayCard
                    key={event.id}
                    market={event}
                    extractTitle={
                      event.question.toLowerCase().includes("leader") ||
                      event.question.toLowerCase().includes("mvp") ||
                      event.question.toLowerCase().includes("rookie") ||
                      event.question.toLowerCase().includes("cy young")
                        ? extractTitle
                        : undefined
                    }
                  />
                
            </div>
          ) : (
            <p className="text-gray-500">No markets available for this event.</p>
          )}
        </section>
      ))}
    </div>
  );
}