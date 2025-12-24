import { useState } from 'react';
import DisplayCard from './DisplayCard';
import MarketModal from './MarketModal';
interface LeagueBodyProps {
  data: any[];     // Array of markets
  league: string;
}

const LeagueBody: React.FC<LeagueBodyProps> = ({ data, league }) => {
  const [selectedMarket, setSelectedMarket] = useState<any | null>(null);

  const handleCardClick = (market: any) => {
    setSelectedMarket(market);
  };

  const closeModal = () => {
    setSelectedMarket(null);
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
      <h1 className="text-4xl font-bold mb-10 text-center text-white">
        {league.toUpperCase()} Markets
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((market) => (
          <DisplayCard
            key={market.id}
            market={market}
            onClick={() => handleCardClick(market)} // ← New prop
          />
        ))}
      </div>

      {/* Modal */}
      {selectedMarket && (
        <MarketModal market={selectedMarket} onClose={closeModal} />
      )}
    </div>
  );
}

export default LeagueBody