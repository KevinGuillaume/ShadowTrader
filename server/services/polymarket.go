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
