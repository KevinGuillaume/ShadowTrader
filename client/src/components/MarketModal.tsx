import React from 'react';
import { format } from 'date-fns';

interface MarketModalProps {
  market: any;
  onClose: () => void;
}

const MarketModal: React.FC<MarketModalProps> = ({ market, onClose }) => {
  const parseJsonArray = (field: string | undefined | null): any[] => {
    if (!field || typeof field !== 'string') return [];
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const outcomes = parseJsonArray(market.outcomes);
  const outcomePrices = parseJsonArray(market.outcomePrices).map((p: any) =>
    typeof p === 'string' ? parseFloat(p) : Number(p)
  );

  const formattedEndDate = market.endDate
    ? format(new Date(market.endDate), 'MMMM d, yyyy h:mm a')
    : 'TBD';

  const formattedStartDate = market.startDate
    ? format(new Date(market.startDate), 'MMMM d, yyyy')
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose} // Close on backdrop click
    >
      {/* Modal content */}
      <div
        className="bg-gray-900 
        rounded-2xl 
        shadow-2xl 
        w-full 
        max-w-xl        
        md:max-w-3xl    
        lg:max-w-4xl   
        mx-4 
        max-h-[90vh] 
        overflow-y-auto 
        border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white pr-10">
            {market.question || market.title || 'Market Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Image if available */}
          {market.image && (
            <div className="mb-6">
              <img
                src={market.image}
                alt="Market"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          )}

          {/* Description */}
          {market.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Description</h3>
              <p className="text-gray-300 whitespace-pre-line">{market.description}</p>
            </div>
          )}

          {/* Outcomes & Prices */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Outcomes</h3>
            {outcomes.length > 0 ? (
              <div className="space-y-3">
                {outcomes.map((outcome: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                  >
                    <span className="text-white font-medium">{outcome}</span>
                    {outcomePrices[idx] !== undefined && (
                      <span className="text-blue-400 font-bold">
                        {(outcomePrices[idx] * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No outcomes available</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Ends:</span>{' '}
              <span className="text-white">{formattedEndDate}</span>
            </div>
            {formattedStartDate && (
              <div>
                <span className="text-gray-400">Starts:</span>{' '}
                <span className="text-white">{formattedStartDate}</span>
              </div>
            )}
          </div>

          {/* Extra info */}
          <div className="text-sm text-gray-400 space-y-2">
            <p><span className="font-medium text-gray-300">ID:</span> {market.id}</p>
            {market.slug && <p><span className="font-medium text-gray-300">Slug:</span> {market.slug}</p>}
            {market.conditionId && <p><span className="font-medium text-gray-300">Condition ID:</span> {market.conditionId}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketModal;