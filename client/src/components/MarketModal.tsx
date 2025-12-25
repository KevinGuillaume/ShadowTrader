import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { backendAPI } from "../api";
import TeamRoster from './TeamRoster'; // Adjust path as needed

interface ESPNAthlete {
  id: string;
  fullName: string;
  jersey?: string;
  position?: {
    name: string;
    abbreviation: string;
  };
  headshot?: {
    href: string;
  };
}

interface MarketModalProps {
  market: any;
  league: string;
  onClose: () => void;
}

const MarketModal: React.FC<MarketModalProps> = ({ market, league,onClose }) => {
  const [teamRosterA, setTeamRosterA] = useState<ESPNAthlete[]>([]);
  const [teamRosterB, setTeamRosterB] = useState<ESPNAthlete[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!market?.question) return;

    const fetchRosters = async () => {
      setLoading(true);
      setError(null);

      try {
        const teams = market.question.split(" vs. ").map((t: string) => t.trim());

        if (teams.length !== 2) {
          throw new Error("Market question doesn't contain two teams in 'TeamA vs. TeamB' format");
        }

        const [teamA, teamB] = teams;

        const [rosterA, rosterB] = await Promise.all([
          backendAPI.getESPNRostersForTeam(league, teamA),
          backendAPI.getESPNRostersForTeam(league, teamB),
        ]);

        setTeamRosterA(rosterA || []);
        setTeamRosterB(rosterB || []);
      } catch (err) {
        console.error("Failed to load rosters:", err);
        setError("Could not load team rosters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRosters();
  }, [market?.question]);

  // Helper to safely parse JSON arrays from market data
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

  const [teamAName, teamBName] = market?.question
    ? market.question.split(" vs. ").map((t: string) => t.trim())
    : ['Team A', 'Team B'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-start sticky top-0 bg-gray-900 z-10">
          <h2 className="text-2xl font-bold text-white pr-10">
            {market?.question || market?.title || 'Market Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Image */}
          {market.image && (
            <div className="mb-8">
              <img
                src={market.image}
                alt="Market"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          )}
          {/* Rosters Section */}
          {loading || error ? (
            <div className="text-center py-12">
              {loading && <p className="text-gray-400 text-lg">Loading team rosters...</p>}
              {error && <p className="text-red-400 text-lg">{error}</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TeamRoster
                teamName={teamAName}
                players={teamRosterA}
                isLoading={loading}
              />
              <TeamRoster
                teamName={teamBName}
                players={teamRosterB}
                isLoading={loading}
              />
            </div>
          )}


          {/* Description */}
          {market.description && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-200 mb-3">Description</h3>
              <p className="text-gray-300 whitespace-pre-line">{market.description}</p>
            </div>
          )}

          {/* Outcomes & Prices */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Outcomes</h3>
            {outcomes.length > 0 ? (
              <div className="space-y-4">
                {outcomes.map((outcome: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-800 p-4 rounded-lg border border-gray-700"
                  >
                    <span className="text-white font-medium text-lg">{outcome}</span>
                    {outcomePrices[idx] !== undefined && (
                      <span className="text-blue-400 font-bold text-xl">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base mb-8">
            <div>
              <span className="text-gray-400 block">Ends:</span>
              <span className="text-white font-medium">{formattedEndDate}</span>
            </div>
            {formattedStartDate && (
              <div>
                <span className="text-gray-400 block">Starts:</span>
                <span className="text-white font-medium">{formattedStartDate}</span>
              </div>
            )}
          </div>

          {/* Extra Info */}
          <div className="text-sm text-gray-400 space-y-2 pt-4 border-t border-gray-700">
            <p><span className="font-medium text-gray-300">ID:</span> {market.id}</p>
            {market.slug && <p><span className="font-medium text-gray-300">Slug:</span> {market.slug}</p>}
            {market.conditionId && (
              <p><span className="font-medium text-gray-300">Condition ID:</span> {market.conditionId}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end sticky bottom-0 bg-gray-900">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketModal;