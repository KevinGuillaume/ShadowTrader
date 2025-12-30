package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

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

// ─────────────────────────────────────────────────────────────────────────────
// New function: Get player averages vs a specific opponent team
// ─────────────────────────────────────────────────────────────────────────────

// PlayerAveragesVsOpponent holds the computed averages
type PlayerAveragesVsOpponent struct {
	GamesPlayed     int     `json:"gamesPlayed"`
	AvgPoints       float64 `json:"avgPoints"`
	AvgRebounds     float64 `json:"avgRebounds"`
	AvgAssists      float64 `json:"avgAssists"`
	AvgSteals       float64 `json:"avgSteals"`
	AvgBlocks       float64 `json:"avgBlocks"`
	AvgFGPercentage float64 `json:"avgFGPercentage"`
}

// SeasonType represents a season type (regular, preseason, etc.)
type SeasonType struct {
	Type       string `json:"type"` // e.g. "regular"
	Name       string `json:"name"`
	Categories []struct {
		Name   string          `json:"name"` // e.g. "November"
		Events []GameStatEntry `json:"events"`
	} `json:"categories"`
}

// GameStatEntry holds per-game player stats + event reference
type GameStatEntry struct {
	EventID string   `json:"eventId"`
	Stats   []string `json:"stats"`
}

// GameMetadata holds game context from root events
type GameMetadata struct {
	ID       string `json:"id"`
	Opponent struct {
		DisplayName string `json:"displayName"`
	} `json:"opponent"`
}

// getSportPathForLeague remains unchanged
func getSportPathForLeague(league string) string {
	league = strings.ToLower(league)
	switch league {
	case "nba":
		return "basketball"
	case "nfl":
		return "football"
	case "mlb":
		return "baseball"
	case "nhl":
		return "hockey"
	default:
		return ""
	}
}

// GetPlayerAveragesVsOpponent fetches historical game logs and computes averages
// against the specified opponent team name (partial match allowed, e.g. "Celtics", "BOS" works too)
func GetPlayerAveragesVsOpponent(
	league string,
	athleteID string,
	opponentName string,
) (PlayerAveragesVsOpponent, error) {

	sport := getSportPathForLeague(league)
	if sport == "" {
		return PlayerAveragesVsOpponent{}, fmt.Errorf("unsupported league: %s", league)
	}

	url := fmt.Sprintf(
		"https://site.web.api.espn.com/apis/common/v3/sports/%s/%s/athletes/%s/gamelog",
		sport, league, athleteID,
	)

	client := &http.Client{Timeout: 12 * time.Second}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return PlayerAveragesVsOpponent{}, err
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; PolymarketApp/1.0)")
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return PlayerAveragesVsOpponent{}, fmt.Errorf("ESPN request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return PlayerAveragesVsOpponent{}, fmt.Errorf("ESPN returned %d: %s", resp.StatusCode, string(body))
	}

	// Full root structure we care about
	var data struct {
		Labels      []string                `json:"labels"` // e.g. ["MIN", "FG", "FG%", ..., "PTS"]
		Events      map[string]GameMetadata `json:"events"` // gameId -> metadata
		SeasonTypes []SeasonType            `json:"seasonTypes"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return PlayerAveragesVsOpponent{}, fmt.Errorf("json decode failed: %w", err)
	}

	// Find indices dynamically using labels
	minIdx := indexOf(data.Labels, "MIN")
	fgIdx := indexOf(data.Labels, "FG")   // "made-attempted"
	rebIdx := indexOf(data.Labels, "REB") // total rebounds
	astIdx := indexOf(data.Labels, "AST")
	stlIdx := indexOf(data.Labels, "STL")
	blkIdx := indexOf(data.Labels, "BLK")
	ptsIdx := indexOf(data.Labels, "PTS")

	if minIdx == -1 || fgIdx == -1 || ptsIdx == -1 {
		return PlayerAveragesVsOpponent{}, fmt.Errorf("missing required stat labels in response")
	}

	normalizedOpponent := strings.ToLower(strings.TrimSpace(opponentName))

	var (
		totalPoints   int
		totalRebounds int
		totalAssists  int
		totalSteals   int
		totalBlocks   int
		totalFGMade   int
		totalFGA      int
		gameCount     int
	)

	for _, st := range data.SeasonTypes {
		for _, cat := range st.Categories {
			for _, game := range cat.Events {
				eventID := game.EventID
				meta, exists := data.Events[eventID]
				if !exists {
					continue
				}

				oppDisplay := strings.ToLower(meta.Opponent.DisplayName)
				if !strings.Contains(oppDisplay, normalizedOpponent) {
					continue
				}

				stats := game.Stats
				if len(stats) <= ptsIdx {
					continue
				}

				// Skip DNP / inactive / didn't play
				minStr := stats[minIdx]
				if minStr == "0" || minStr == "--" || minStr == "" {
					continue
				}

				// Parse FG "made-attempted"
				fgStr := stats[fgIdx]
				if fgStr == "--" {
					continue
				}
				fgParts := strings.Split(fgStr, "-")
				if len(fgParts) != 2 {
					continue
				}
				fgm, err1 := strconv.Atoi(fgParts[0])
				fga, err2 := strconv.Atoi(fgParts[1])
				if err1 != nil || err2 != nil || fga == 0 {
					continue
				}

				pts, _ := strconv.Atoi(stats[ptsIdx])
				reb, _ := strconv.Atoi(stats[rebIdx])
				ast, _ := strconv.Atoi(stats[astIdx])
				stl, _ := strconv.Atoi(stats[stlIdx])
				blk, _ := strconv.Atoi(stats[blkIdx])

				gameCount++
				totalPoints += pts
				totalRebounds += reb
				totalAssists += ast
				totalSteals += stl
				totalBlocks += blk
				totalFGMade += fgm
				totalFGA += fga
			}
		}
	}

	if gameCount == 0 {
		return PlayerAveragesVsOpponent{GamesPlayed: 0}, nil
	}

	fgPct := 0.0
	if totalFGA > 0 {
		fgPct = float64(totalFGMade) / float64(totalFGA) * 100
	}

	return PlayerAveragesVsOpponent{
		GamesPlayed:     gameCount,
		AvgPoints:       float64(totalPoints) / float64(gameCount),
		AvgRebounds:     float64(totalRebounds) / float64(gameCount),
		AvgAssists:      float64(totalAssists) / float64(gameCount),
		AvgSteals:       float64(totalSteals) / float64(gameCount),
		AvgBlocks:       float64(totalBlocks) / float64(gameCount),
		AvgFGPercentage: fgPct,
	}, nil
}

// Helper to find index of a label
func indexOf(slice []string, val string) int {
	for i, item := range slice {
		if item == val {
			return i
		}
	}
	return -1
}
