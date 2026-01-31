import type {
    FullTeamPlayersAverages,
    TeamLocationSplitsResponse,
    MatchupLocationContextResponse,
    TeamRecentFormResponse,
    MatchupMomentumResponse
} from "../types/types"

export class API {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    async getPolymarketEventsData(league: string) {
        try {
            console.log("Getting backend data for: ", league)
            const response = await fetch(this.baseURL + `/league/${league}`)
            const data = await response.json()
            return data
          } catch (err) {
            console.error('Error getting event details', err);
        }
    }

    async getESPNRostersForTeam(league: string, team: string) {
        try {
            console.log("Getting espn roster backend data for: ", league + ": " + team)
            const response = await fetch(this.baseURL + `/league/${league}/${team}`)
            const data = await response.json()
            return data
          } catch (err) {
            console.error('Error getting event details', err);
        }
    }

    async getPolymarketMarketByID(id: string) {
        try {
            console.log("Getting market backend data for id: ", id)
            const response = await fetch(this.baseURL + `/market/${id}`)
            const data = await response.json()
            return data
          } catch (err) {
            console.error('Error getting event details', err);
        }
    }
    async getTeamsPlayerStats(team: string, league: string, opponent: string): Promise<FullTeamPlayersAverages> {
        try {
            console.log("Getting teams player stats...")
            const response = await fetch(this.baseURL + `/player/${league}/${team}/stats-vs/${opponent}`)
            const data: FullTeamPlayersAverages = await response.json()
            return data
          } catch (err) {
            console.error('Error getting event details', err);
            throw new Error('Unknown error fetching team player stats');
        }
    }

    // Team Location Splits (Home/Away Performance)
    async getTeamLocationSplits(league: string, teamName: string, season?: string): Promise<TeamLocationSplitsResponse> {
        try {
            console.log(`Getting location splits for ${teamName}...`)
            const url = new URL(this.baseURL + `/team/${league}/${teamName}/location-splits`)
            if (season) url.searchParams.append('season', season)

            const response = await fetch(url.toString())
            const data: TeamLocationSplitsResponse = await response.json()
            return data
        } catch (err) {
            console.error('Error getting team location splits', err)
            throw new Error('Unknown error fetching team location splits')
        }
    }

    async getMatchupLocationContext(homeTeamId: number, awayTeamId: number, season?: string): Promise<MatchupLocationContextResponse> {
        try {
            console.log(`Getting location context for matchup: home=${homeTeamId} vs away=${awayTeamId}`)
            const url = new URL(this.baseURL + `/team/matchup/location-context`)
            url.searchParams.append('home_team_id', homeTeamId.toString())
            url.searchParams.append('away_team_id', awayTeamId.toString())
            if (season) url.searchParams.append('season', season)

            const response = await fetch(url.toString())
            const data: MatchupLocationContextResponse = await response.json()
            return data
        } catch (err) {
            console.error('Error getting matchup location context', err)
            throw new Error('Unknown error fetching matchup location context')
        }
    }

    // Team Recent Form (Momentum)
    async getTeamRecentForm(league: string, teamName: string, season?: string, gamesBack: number = 10): Promise<TeamRecentFormResponse> {
        try {
            console.log(`Getting recent form for ${teamName}...`)
            const url = new URL(this.baseURL + `/team/${league}/${teamName}/recent-form`)
            if (season) url.searchParams.append('season', season)
            url.searchParams.append('games_back', gamesBack.toString())

            const response = await fetch(url.toString())
            const data: TeamRecentFormResponse = await response.json()
            return data
        } catch (err) {
            console.error('Error getting team recent form', err)
            throw new Error('Unknown error fetching team recent form')
        }
    }

    async getMatchupMomentum(team1Id: number, team2Id: number, season?: string, gamesBack: number = 10): Promise<MatchupMomentumResponse> {
        try {
            console.log(`Getting momentum for matchup: ${team1Id} vs ${team2Id}`)
            const url = new URL(this.baseURL + `/team/matchup/momentum`)
            url.searchParams.append('team1_id', team1Id.toString())
            url.searchParams.append('team2_id', team2Id.toString())
            if (season) url.searchParams.append('season', season)
            url.searchParams.append('games_back', gamesBack.toString())

            const response = await fetch(url.toString())
            const data: MatchupMomentumResponse = await response.json()
            return data
        } catch (err) {
            console.error('Error getting matchup momentum', err)
            throw new Error('Unknown error fetching matchup momentum')
        }
    }
}