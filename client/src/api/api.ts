export class API {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    async getEventsData(league: string) {
        try {
            console.log("Getting backend data...")
            const response = await fetch(this.baseURL + `/league/${league}`)
            const data = await response.json()
            return data
          } catch (err) {
            console.error('Error getting event details', err);
        }
    }

    
}