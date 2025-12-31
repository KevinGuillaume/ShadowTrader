// src/pages/MarketPage/components/MarketOutcomes.tsx
import React from 'react';

interface MarketOutcomesProps {
  outcomes: string[];
  outcomePrices: number[]; // raw prices (0–1 range)
}

const MarketOutcomes: React.FC<MarketOutcomesProps> = ({ outcomes, outcomePrices }) => {
  if (outcomes.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Outcomes</h2>
        <p className="text-gray-500 text-center py-8 italic">No outcomes available</p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Outcomes</h2>

      <div className="space-y-4">
        {outcomes.map((outcome: string, idx: number) => {
          const price = outcomePrices[idx] ?? 0;
          const percentage = Math.round(price * 100);
          const isDefined = outcomePrices[idx] !== undefined;

          return (
            <div
              key={idx}
              className="relative bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Dynamic gradient background bar that grows with probability */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-blue-500/10 transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />

              {/* Main content overlay */}
              <div className="relative flex items-center justify-between px-6 py-5">
                <div className="flex-1 pr-6">
                  <span className="text-lg font-medium text-white truncate">
                    {outcome}
                  </span>
                </div>

                <div className="min-w-[6ch] text-right">
                  {isDefined ? (
                    <span className="text-2xl font-bold text-blue-300 tracking-tight">
                      {percentage}%
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xl">—</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MarketOutcomes;