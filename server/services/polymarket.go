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

func GetMarketsByLeague(league string) ([]models.Market, error) {
	league = strings.ToLower(league)

	tagID, ok := constants.LeagueTagIDs[league]
	if !ok {
		return nil, fmt.Errorf("unknown league: %s", league)
	}

	url := fmt.Sprintf(
		"https://gamma-api.polymarket.com/markets?sports_market_types=moneyline&closed=false&tag_id=%d",
		tagID,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var markets []models.Market
	if err := json.Unmarshal(body, &markets); err != nil {
		return nil, err
	}

	return markets, nil
}

func GetMarketByID(id int) (models.Market, error) {
	url := fmt.Sprintf("https://gamma-api.polymarket.com/markets/%d", id)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return models.Market{}, fmt.Errorf("failed to create request: %w", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return models.Market{}, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return models.Market{}, fmt.Errorf("unexpected status code %d: %s",
			resp.StatusCode, string(body))
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return models.Market{}, fmt.Errorf("failed to read response body: %w", err)
	}

	var market models.Market
	if err := json.Unmarshal(body, &market); err != nil {
		return models.Market{}, fmt.Errorf("failed to unmarshal JSON: %w\nBody: %s",
			err, string(body))
	}

	return market, nil
}
