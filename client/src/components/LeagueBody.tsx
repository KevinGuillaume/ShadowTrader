// src/components/LeagueBody.tsx
import { useNavigate } from 'react-router-dom';
import DisplayCard from './DisplayCard';
import { isBefore } from 'date-fns';

interface LeagueBodyProps {
  data: any[];     // Array of markets
  league: string;
}

const LeagueBody: React.FC<LeagueBodyProps> = ({ data, league }) => {
  const navigate = useNavigate();
  const today = new Date();

  const handleCardClick = (market: any) => {
    navigate(`/market/${market.id}`, {
      state: {
        market,     // pass full market object
        league,     // pass league for roster fetching
      },
    });
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
        {data.map((market) => {
            let endDate: any = market.endDate ? new Date(market.endDate) : null;



          if(!isBefore(endDate, today)){ // if its not old
            console.log()
            return <DisplayCard
              key={market.id}
              market={market}
              onClick={() => handleCardClick(market)}
            />
          }
          else{
            return <></>
          }
          
          })}
      </div>
    </div>
  );
};

export default LeagueBody;