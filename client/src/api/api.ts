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
    async getPlayerAveragesVsOpponent(athleteId: string, league: string, opponent: string) {
        try {
            console.log("Getting players stats...")
            const response = await fetch(this.baseURL + `/player/${league}/${athleteId}/stats-vs/${opponent}`)
            const data = await response.json()
            return data
          } catch (err) {
            console.error('Error getting event details', err);
        }
    }

    
}