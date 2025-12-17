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
  let title = titleOverride || market.question || 'Unknown Market';
  if (!titleOverride && extractTitle && market.question) {
    title = extractTitle(market.question);
  }

  // Yes probability (index 0 = Yes)
  let yesProb = 0;
  let hasPrice = false;
  if (market.outcomePrices && Array.isArray(market.outcomePrices)) {
    const price = parseFloat(market.outcomePrices[0]);
    if (!isNaN(price)) {
      yesProb = price * 100;
      hasPrice = true;
    }
  }

  const volume = parseFloat(market.volumeNum || market.volume || '0');
  const formattedVolume = volume >= 1000 
    ? `$${(volume / 1000).toFixed(1)}k`
    : `$${volume.toFixed(0)}`;

  const liquidity = parseFloat(market.liquidityNum || market.liquidity || '0');
  const formattedLiquidity = liquidity > 0 ? `$${liquidity.toFixed(0)}` : null;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
      <h3 className="text-xl font-semibold text-white mb-4 line-clamp-3">
        {title}
      </h3>

      <div className="mb-5">
        <div className={`text-4xl font-bold ${hasPrice ? 'text-blue-400' : 'text-gray-500'}`}>
          {hasPrice ? `${yesProb.toFixed(0)}%` : '—'}
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {hasPrice ? 'Implied Probability' : 'No trades yet'}
        </p>
      </div>

      {showVolume && (
        <div className="text-sm text-gray-300 mb-2">
          <span className="font-medium">Volume:</span> {formattedVolume}
        </div>
      )}

      {showLiquidity && formattedLiquidity && (
        <div className="text-sm text-gray-300">
          <span className="font-medium">Liquidity:</span> {formattedLiquidity}
        </div>
      )}

      {!market.active && (
        <div className="mt-4 inline-flex text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
          Not Active Yet
        </div>
      )}
    </div>
  );
};

export default DisplayCard;