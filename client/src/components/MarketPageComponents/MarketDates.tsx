import { format } from 'date-fns';

interface MarketDatesProps {
  endDate?: string;
  startDate?: string;
}

const MarketDates: React.FC<MarketDatesProps> = ({ endDate, startDate }) => (
  <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
    {startDate && (
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-gray-400 mb-2">Market Starts</h3>
        <p className="text-xl font-medium">{format(new Date(startDate), 'MMMM d, yyyy')}</p>
      </div>
    )}
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <h3 className="text-gray-400 mb-2">Market Ends</h3>
      <p className="text-xl font-medium">{endDate ? format(new Date(endDate), 'MMMM d, yyyy h:mm a') : 'TBD'}</p>
    </div>
  </section>
);

export default MarketDates;