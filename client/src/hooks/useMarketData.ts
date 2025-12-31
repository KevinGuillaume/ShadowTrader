// src/pages/MarketPage/hooks/useMarketData.ts
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { backendAPI } from '../api';
import type { ESPNAthlete, PlayerVsStats } from '../types/types';

export const useMarketData = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();

  const [market, setMarket] = useState<any>(state?.market || null);
  const [loadingMarket, setLoadingMarket] = useState(!state?.market);
  const [teamRosterA, setTeamRosterA] = useState<ESPNAthlete[]>([]);
  const [teamRosterB, setTeamRosterB] = useState<ESPNAthlete[]>([]);
  const [loadingRosters, setLoadingRosters] = useState(true);
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerVsStats | 'loading' | 'error'>>({});
  const [error, setError] = useState<string | null>(null);

  // Utility: parse league from slug
  const getLeagueFromSlug = (slug?: string): string => {
    if (!slug) return 'nba';
    const prefix = slug.split('-')[0]?.toLowerCase();
    const known = ['nba', 'nfl'];
    return known.includes(prefix) ? prefix : 'nba';
  };

  const league = getLeagueFromSlug(market?.slug) || state?.league || 'nba';

  // Fetch market by ID
  useEffect(() => {
    if (state?.market) {
      setMarket(state.market);
      setLoadingMarket(false);
      return;
    }

    if (!id) {
      setError("No market ID provided");
      setLoadingMarket(false);
      return;
    }

    const fetchMarket = async () => {
      setLoadingMarket(true);
      setError(null);
      try {
        const data = await backendAPI.getPolymarketMarketByID(id);
        setMarket(data);
      } catch (err) {
        console.error("Failed to fetch market:", err);
        setError("Could not load market details");
      } finally {
        setLoadingMarket(false);
      }
    };

    fetchMarket();
  }, [id, state?.market]);

  // Fetch rosters + player stats
  useEffect(() => {
    if (!market?.question) return;

    const fetchRostersAndStats = async () => {
      setLoadingRosters(true);
      setError(null);

      try {
        const teams = market.question.split(" vs. ").map((t: string) => t.trim());
        if (teams.length !== 2) throw new Error("Invalid market format");

        const [teamA, teamB] = teams;

        const [rosterA, rosterB] = await Promise.all([
          backendAPI.getESPNRostersForTeam(league, teamA),
          backendAPI.getESPNRostersForTeam(league, teamB),
        ]);

        setTeamRosterA(rosterA || []);
        setTeamRosterB(rosterB || []);

        // Initialize loading state
        const initialStats: Record<string, 'loading'> = {};
        [...(rosterA || []), ...(rosterB || [])].forEach(p => {
          initialStats[p.id] = 'loading';
        });
        setPlayerStats(initialStats);

        // Fetch stats concurrently
        await Promise.all([
          ...rosterA.map((p:any) => fetchPlayerStats(p.id, league, teamB)),
          ...rosterB.map((p:any) => fetchPlayerStats(p.id, league, teamA)),
        ]);
      } catch (err) {
        console.error("Roster fetch failed:", err);
        setError("Could not load team rosters");
      } finally {
        setLoadingRosters(false);
      }
    };

    const fetchPlayerStats = async (athleteId: string, league: string, opponent: string) => {
      try {
        const stats = await backendAPI.getPlayerAveragesVsOpponent(athleteId, league, opponent);
        setPlayerStats(prev => ({ ...prev, [athleteId]: stats }));
      } catch (err) {
        console.error(`Stats failed for ${athleteId}:`, err);
        setPlayerStats(prev => ({ ...prev, [athleteId]: 'error' }));
      }
    };

    fetchRostersAndStats();
  }, [market?.question, market?.slug, league]);

  return {
    market,
    loadingMarket,
    teamRosterA,
    teamRosterB,
    loadingRosters,
    playerStats,
    error,
    league,
  };
};