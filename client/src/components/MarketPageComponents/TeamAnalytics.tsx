import React, { useEffect, useState } from 'react';
import { backendAPI } from '../../api';
import type {
  TeamLocationSplitsResponse,
  TeamRecentFormResponse,
  LocationSplitData,
  RecentFormData
} from '../../types/types';
import { LocationPinIcon } from '../Icons/LocationPinIcon';
import { TrophyIcon } from 'lucide-react';
import { HomeIcon } from '../Icons/HomeIcon';
import { AirplaneIcon } from '../Icons/AirplaneIcon';

interface TeamAnalyticsProps {
  teamA: string;
  teamB: string;
  league: string;
}

interface AnalyticsData<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const TeamAnalytics: React.FC<TeamAnalyticsProps> = ({ teamA, teamB, league }) => {
  const [teamALocationSplits, setTeamALocationSplits] = useState<AnalyticsData<TeamLocationSplitsResponse>>({
    data: null, loading: true, error: null
  });
  const [teamBLocationSplits, setTeamBLocationSplits] = useState<AnalyticsData<TeamLocationSplitsResponse>>({
    data: null, loading: true, error: null
  });
  const [teamARecentForm, setTeamARecentForm] = useState<AnalyticsData<TeamRecentFormResponse>>({
    data: null, loading: true, error: null
  });
  const [teamBRecentForm, setTeamBRecentForm] = useState<AnalyticsData<TeamRecentFormResponse>>({
    data: null, loading: true, error: null
  });

  useEffect(() => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchAnalytics = async () => {
      // Fetch Location Splits for both teams
      try {
        const teamASplits = await backendAPI.getTeamLocationSplits(league, teamA);
        setTeamALocationSplits({ data: teamASplits, loading: false, error: null });
      } catch {
        setTeamALocationSplits({ data: null, loading: false, error: 'Failed to load' });
      }

      await delay(50); // Small delay between requests

      try {
        const teamBSplits = await backendAPI.getTeamLocationSplits(league, teamB);
        setTeamBLocationSplits({ data: teamBSplits, loading: false, error: null });
      } catch {
        setTeamBLocationSplits({ data: null, loading: false, error: 'Failed to load' });
      }

      await delay(50);

      // Fetch Recent Form for both teams
      try {
        const teamAForm = await backendAPI.getTeamRecentForm(league, teamA);
        setTeamARecentForm({ data: teamAForm, loading: false, error: null });
      } catch {
        setTeamARecentForm({ data: null, loading: false, error: 'Failed to load' });
      }

      await delay(50);

      try {
        const teamBForm = await backendAPI.getTeamRecentForm(league, teamB);
        setTeamBRecentForm({ data: teamBForm, loading: false, error: null });
      } catch {
        setTeamBRecentForm({ data: null, loading: false, error: 'Failed to load' });
      }
    };

    if (teamA && teamB && league) {
      fetchAnalytics();
    }
  }, []);

  const formatRecord = (wins: number, losses: number) => `${wins}-${losses}`;
  const formatPct = (pct: number) => `${(pct * 100).toFixed(1)}%`;
  const formatStat = (stat: number | null | undefined) => stat?.toFixed(1) ?? '-';

  const getStreakColor = (type: string) => {
    if (type === 'W') return 'text-green-400';
    if (type === 'L') return 'text-red-400';
    return 'text-gray-400';
  };

  const getStreakBgColor = (type: string) => {
    if (type === 'W') return 'bg-green-500/20 border-green-500/30';
    if (type === 'L') return 'bg-red-500/20 border-red-500/30';
    return 'bg-gray-500/20 border-gray-500/30';
  };

  const renderLocationSplit = (split: LocationSplitData | null, location: 'home' | 'away') => {
    if (!split) {
      return <span className="text-gray-500 italic">No data</span>;
    }

    const icon = location === 'home' ? <HomeIcon size={16} className="text-blue-400" /> : <AirplaneIcon size={16} className="text-blue-400" />;
    const label = location === 'home' ? 'Home' : 'Away';

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          {icon} {label}
          </div>
          <span className="text-white font-semibold">
            {formatRecord(split.wins, split.losses)} ({formatPct(split.win_pct)})
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">PPG</span>
            <span className="text-white font-medium">{formatStat(split.points_per_game)}</span>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">OPP PPG</span>
            <span className="text-white font-medium">{formatStat(split.points_against_per_game)}</span>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">+/-</span>
            <span className={`font-medium ${split.plus_minus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {split.plus_minus >= 0 ? '+' : ''}{formatStat(split.plus_minus)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">FG%</span>
            <span className="text-white font-medium">{formatPct(split.field_goal_pct)}</span>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">3P%</span>
            <span className="text-white font-medium">{formatPct(split.three_pt_pct)}</span>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">FT%</span>
            <span className="text-white font-medium">{formatPct(split.free_throw_pct)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRecentForm = (form: RecentFormData | null, teamName: string) => {
    if (!form) {
      return (
        <div className="text-center py-4">
          <span className="text-gray-500 italic">No recent form data</span>
        </div>
      );
    }

    const streakDisplay = form.streak_type !== 'N'
      ? `${form.streak_type}${form.streak_count}`
      : '-';

    return (
      <div className="space-y-4">
        {/* Record and Streak */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-sm">Last {form.games_back} Games</span>
            <div className="text-white font-semibold text-lg">
              {formatRecord(form.wins, form.losses)} ({formatPct(form.win_pct)})
            </div>
          </div>
          <div className={`px-3 py-2 rounded-lg border ${getStreakBgColor(form.streak_type)}`}>
            <span className="text-gray-400 text-xs block text-center">Streak</span>
            <span className={`font-bold text-lg ${getStreakColor(form.streak_type)}`}>
              {streakDisplay}
            </span>
          </div>
        </div>

        {/* Win/Loss Visual */}
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-500"
            style={{ width: `${form.win_pct * 100}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-lg p-3">
            <span className="text-gray-400 text-xs block">Points/Game</span>
            <span className="text-white font-semibold text-lg">{formatStat(form.points_per_game)}</span>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <span className="text-gray-400 text-xs block">FG%</span>
            <span className="text-white font-semibold text-lg">{formatPct(form.field_goal_pct)}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">REB</span>
            <span className="text-white font-medium">{formatStat(form.rebounds_per_game)}</span>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">AST</span>
            <span className="text-white font-medium">{formatStat(form.assists_per_game)}</span>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">STL</span>
            <span className="text-white font-medium">{formatStat(form.steals_per_game)}</span>
          </div>
          <div className="bg-gray-800 rounded p-2">
            <span className="text-gray-400 block">BLK</span>
            <span className="text-white font-medium">{formatStat(form.blocks_per_game)}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          {form.first_game_date} - {form.last_game_date}
        </div>
      </div>
    );
  };

  const renderTeamCard = (
    teamName: string,
    locationData: AnalyticsData<TeamLocationSplitsResponse>,
    formData: AnalyticsData<TeamRecentFormResponse>,
    isTeamA: boolean
  ) => {
    const accentColor = isTeamA ? 'blue' : 'purple';

    return (
      <div className={`bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden`}>
        <div className={`bg-${accentColor}-600/20 border-b border-gray-800 px-4 py-3`}>
          <h3 className={`text-lg font-semibold text-${accentColor}-400`}>{teamName}</h3>
        </div>

        <div className="p-4 space-y-6">
          {/* Location Splits Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <LocationPinIcon size={16} className="text-blue-400" />
               Home/Away Performance
            </h4>
            {locationData.loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : locationData.error ? (
              <p className="text-gray-500 text-sm italic">{locationData.error}</p>
            ) : (
              <div className="space-y-4">
                {renderLocationSplit(locationData.data?.home ?? null, 'home')}
                <div className="border-t border-gray-700"></div>
                {renderLocationSplit(locationData.data?.away ?? null, 'away')}
              </div>
            )}
          </div>

          {/* Recent Form Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <TrophyIcon size={16} className="text-blue-400" /> Recent Form
            </h4>
            {formData.loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : formData.error ? (
              <p className="text-gray-500 text-sm italic">{formData.error}</p>
            ) : (
              renderRecentForm(formData.data?.recent_form ?? null, teamName)
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Team Situational Stats</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTeamCard(teamA, teamALocationSplits, teamARecentForm, true)}
        {renderTeamCard(teamB, teamBLocationSplits, teamBRecentForm, false)}
      </div>
    </section>
  );
};

export default TeamAnalytics;
