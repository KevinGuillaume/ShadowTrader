// components/DisplayCard.tsx
import React from 'react';

interface DisplayCardProps {
  market: any;
  titleOverride?: string;
  extractTitle?: (question: string) => string;
  showVolume?: boolean;
  showLiquidity?: boolean;
}

const DisplayCard: React.FC<DisplayCardProps> = ({
  market,
  titleOverride,
  extractTitle,
  showVolume = true,
  showLiquidity = true,
}) => {
  // Title logic
  let title = titleOverride || market.question || market.title || 'Unknown Market';
  if (!titleOverride && extractTitle && (market.question || market.title)) {
    title = extractTitle(market.question || market.title);
  }

  // Helper to safely parse stringified JSON arrays
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

  // Determine probability to display
  let yesProb = 0;
  let hasPrice = false;
  let outcomeLabel = 'Yes'; // default for classic Yes/No markets

  if (outcomePrices.length > 0 && !isNaN(outcomePrices[0])) {
    yesProb = outcomePrices[0] * 100;
    hasPrice = true;

    if (outcomes.length > 0) {
      outcomeLabel = outcomes[0];
    }
  }

  // Volume & Liquidity
  const volumeRaw = parseFloat(market.volumeNum || market.volume || '0');
  const formattedVolume =
    volumeRaw >= 1000
      ? `$${(volumeRaw / 1000).toFixed(1)}k`
      : `$${volumeRaw.toFixed(0)}`;

  const liquidityRaw = parseFloat(market.liquidityNum || market.liquidity || '0');
  const formattedLiquidity = liquidityRaw > 0 ? `$${liquidityRaw.toFixed(0)}` : null;

  const imageUrl = market.image || market.icon || null;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300">
      {/* Image Section */}
      {imageUrl ? (
        <div className="relative h-48 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : (
        <div className="h-48 w-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <div className="text-5xl font-bold text-gray-600">
            {title.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 line-clamp-3 min-h-[4.5rem]">
          {title}
        </h3>

        {/* Probability Section */}
        <div className="mb-5">
          <div className={`text-4xl font-bold ${hasPrice ? 'text-blue-400' : 'text-gray-500'}`}>
            {hasPrice ? `${yesProb.toFixed(0)}%` : '—'}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {hasPrice
              ? `${outcomeLabel} Implied Probability`
              : 'No trades yet'}
          </p>
        </div>

        {/* Volume */}
        {showVolume && (
          <div className="text-sm text-gray-300 mb-2">
            <span className="font-medium">Volume:</span> {formattedVolume}
          </div>
        )}

        {/* Liquidity */}
        {showLiquidity && formattedLiquidity && (
          <div className="text-sm text-gray-300 mb-2">
            <span className="font-medium">Liquidity:</span> {formattedLiquidity}
          </div>
        )}

        {/* Status indicators */}
        {!market.active && (
          <div className="mt-4 inline-flex text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
            Not Active Yet
          </div>
        )}

        {market.closed && (
          <div className="mt-4 inline-flex text-xs bg-red-900 text-red-200 px-3 py-1 rounded-full">
            Market Closed
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayCard;