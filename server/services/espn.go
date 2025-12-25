package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"polymarket-api/constants"
	"polymarket-api/models"
)

func GetTeamRostersByLeagueAndTeamID(
	league string,
	teamName string,
) ([]models.ESPNAthlete, error) {
	league = strings.ToLower(league)
	teamName = strings.ToLower(teamName)

	sportPath, ok := constants.LeagueToSport[league]
	if !ok {
		return nil, fmt.Errorf("unsupported league: %s", league)
	}
	var teamID int

	if league == "nba" {
		teamID, ok = constants.NBATeamIDs[teamName]
	} else if league == "nfl" {
		teamID, ok = constants.NFLTeamIDs[teamName]
	} else {
		return nil, fmt.Errorf("unsupported league: %s", league)
	}
	fmt.Print(league)
	if !ok {
		return nil, fmt.Errorf("unknown team: %s", teamName)
	}

	url := fmt.Sprintf(
		"https://site.web.api.espn.com/apis/site/v2/sports/%s/teams/%d/roster",
		sportPath,
		teamID,
	)
	// fmt.Println("Fetching:", url) // keep for debugging

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("espn request failed: %w", err)
	}

	fmt.Println(url)
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("espn returned %d: %s", resp.StatusCode, string(body))
	}

	var rosterResp models.ESPNTeamRosterResponse
	if err := json.NewDecoder(resp.Body).Decode(&rosterResp); err != nil {
		return nil, fmt.Errorf("json decode failed: %w", err)
	}

	// Optional: filter active players only, or add more logic here
	var activePlayers []models.ESPNAthlete
	for _, p := range rosterResp.Athletes {
		if p.Status.Abbreviation == "Active" { // or just take all
			activePlayers = append(activePlayers, p)
		}
	}

	// For debugging
	// fmt.Printf("Found %d players\n", len(rosterResp.Athletes))

	return rosterResp.Athletes, nil // or return activePlayers
}
