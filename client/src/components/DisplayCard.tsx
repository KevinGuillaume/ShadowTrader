// components/DisplayCard.tsx
import React from 'react';
import { format, isSameDay, isAfter, isBefore, addDays }from 'date-fns'; // Install: npm install date-fns (recommended for clean date formatting)

interface DisplayCardProps {
  market: any;
  onClick?: () => void;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ market, onClick }) => {
  // Title
  const title = market.question || market.title || 'Unknown Market';


  const today = new Date(); // Current date (in browser)

  // Safely parse stringified JSON arrays (for binary/multi-outcome markets)
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

  // Probability display (focus on first outcome, usually "Yes" or Team A)
  let yesProb = 0;
  let hasPrice = false;
  let outcomeLabel = outcomes[0] || 'Yes';

  if (outcomePrices.length > 0 && !isNaN(outcomePrices[0])) {
    yesProb = outcomePrices[0] * 100;
    hasPrice = true;
  }

  // Volume & Liquidity
  const volumeRaw = parseFloat(market.volumeNum || market.volume || '0');
  const formattedVolume =
    volumeRaw >= 1000
      ? `$${(volumeRaw / 1000).toFixed(1)}k`
      : volumeRaw > 0
      ? `$${volumeRaw.toFixed(0)}`
      : '—';

  const liquidityRaw = parseFloat(market.liquidityNum || market.liquidity || '0');
  const formattedLiquidity = liquidityRaw > 0 ? `$${liquidityRaw.toFixed(0)}` : '—';

  // Dates (using date-fns for clean formatting)
  const endDate = market.endDate ? new Date(market.endDate) : null;

  const formattedEndDate = endDate
    ? format(endDate, 'MMM d, yyyy') // e.g., Dec 25, 2025 8:00 PM
    : 'TBD';



  const imageUrl = market.image || market.icon || null;

  // Badge logic
  let statusBadge: React.ReactNode = null;

  if (endDate) {
    const tomorrow = addDays(today, 1);
  
    if (isAfter(endDate, tomorrow)) {
      // Ends more than 1 day from now → Upcoming
      statusBadge = (
        <span className="inline-flex text-xs bg-green-800 text-green-200 px-3 py-1 rounded-full">
          Upcoming
        </span>
      );
    } else if (isSameDay(endDate, today)) {
      // Ends today → Today
      statusBadge = (
        <span className="inline-flex text-xs bg-blue-800 text-blue-200 px-3 py-1 rounded-full">
          Today
        </span>
      );
    } else if (isBefore(endDate, today)) {
      // Already ended → Closed
      statusBadge = (
        <span className="inline-flex text-xs bg-red-900 text-red-200 px-3 py-1 rounded-full">
          Closed
        </span>
      );
    } else {
      // Edge case: ends tomorrow exactly → treat as Upcoming
      statusBadge = (
        <span className="inline-flex text-xs bg-green-800 text-green-200 px-3 py-1 rounded-full">
          Upcoming
        </span>
      );
    }
  } else {
    // No end date available
    statusBadge = (
      <span className="inline-flex text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
        Date TBD
      </span>
    );
  }



  return (
    <div 
    className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 flex flex-col h-full max-w-md mx-auto cursor-pointer"
    onClick={onClick}
    >
      {/* Image / Placeholder */}
      {imageUrl ? (
        <div className="relative h-56 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-52 w-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <div className="text-6xl font-bold text-gray-600 opacity-50">
            {title.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-7 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        {/* Probability (prominent) */}
        <div className="mb-5">
          <div
            className={`text-5xl font-extrabold ${
              hasPrice ? 'text-blue-400' : 'text-gray-500'
            }`}
          >
            {hasPrice ? `${Math.round(yesProb)}%` : '—'}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {hasPrice ? `${outcomeLabel} Probability` : 'No trades yet'}
          </p>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-base">
          <div>
            <span className="font-semibold text-gray-300">Volume:</span>
            <p className="text-gray-100">{formattedVolume}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Liquidity:</span>
            <p className="text-gray-100">{formattedLiquidity}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="text-sm text-gray-400 mb-4">
          <div>
            <span className="font-semibold text-gray-300">Gameday:</span>{' '}
            {formattedEndDate}
          </div>
        </div>


        {/* Status Badges */}
        <div className="mt-auto flex flex-wrap gap-2">
            {statusBadge}
        </div>
      </div>
    </div>
  );
};

export default DisplayCard;