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

    
}