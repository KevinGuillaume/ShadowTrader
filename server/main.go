package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Market struct {
	ID                           string   `json:"id"`
	Question                     string   `json:"question,omitempty"` // Present on binary markets
	Title                        string   `json:"title,omitempty"`    // Present on multi-outcome/group markets
	ConditionID                  string   `json:"conditionId,omitempty"`
	Slug                         string   `json:"slug"`
	ResolutionSource             string   `json:"resolutionSource,omitempty"`
	EndDate                      string   `json:"endDate,omitempty"` // RFC3339-like
	EndDateIso                   string   `json:"endDateIso,omitempty"`
	Liquidity                    string   `json:"liquidity,omitempty"` // String representation of float
	LiquidityNum                 float64  `json:"liquidityNum,omitempty"`
	LiquidityClob                float64  `json:"liquidityClob,omitempty"`
	StartDate                    string   `json:"startDate,omitempty"`
	StartDateIso                 string   `json:"startDateIso,omitempty"`
	Image                        string   `json:"image,omitempty"`
	Icon                         string   `json:"icon,omitempty"`
	Description                  string   `json:"description,omitempty"`
	Outcomes                     string   `json:"outcomes,omitempty"`      // Changed to string
	OutcomePrices                string   `json:"outcomePrices,omitempty"` // Changed to string
	ClobTokenIds                 string   `json:"clobTokenIds,omitempty"`
	Volume                       string   `json:"volume,omitempty"`
	VolumeNum                    float64  `json:"volumeNum,omitempty"`
	VolumeClob                   float64  `json:"volumeClob,omitempty"`
	Volume24hr                   float64  `json:"volume24hr,omitempty"`
	Volume1wk                    float64  `json:"volume1wk,omitempty"`
	Volume1mo                    float64  `json:"volume1mo,omitempty"`
	Volume1yr                    float64  `json:"volume1yr,omitempty"`
	Volume24hrClob               float64  `json:"volume24hrClob,omitempty"`
	Volume1wkClob                float64  `json:"volume1wkClob,omitempty"`
	Volume1moClob                float64  `json:"volume1moClob,omitempty"`
	Volume1yrClob                float64  `json:"volume1yrClob,omitempty"`
	Active                       bool     `json:"active"`
	Closed                       bool     `json:"closed"`
	MarketMakerAddress           string   `json:"marketMakerAddress,omitempty"`
	CreatedAt                    string   `json:"createdAt,omitempty"` // Timestamp
	UpdatedAt                    string   `json:"updatedAt,omitempty"`
	New                          bool     `json:"new"`
	Featured                     bool     `json:"featured"`
	SubmittedBy                  string   `json:"submitted_by,omitempty"`
	Archived                     bool     `json:"archived"`
	ResolvedBy                   string   `json:"resolvedBy,omitempty"`
	Restricted                   bool     `json:"restricted"`
	GroupItemTitle               string   `json:"groupItemTitle,omitempty"`
	GroupItemThreshold           string   `json:"groupItemThreshold,omitempty"`
	QuestionID                   string   `json:"questionID,omitempty"`
	EnableOrderBook              bool     `json:"enableOrderBook"`
	OrderPriceMinTickSize        float64  `json:"orderPriceMinTickSize,omitempty"`
	OrderMinSize                 int      `json:"orderMinSize,omitempty"`
	HasReviewedDates             bool     `json:"hasReviewedDates,omitempty"`
	UMABond                      string   `json:"umaBond,omitempty"`
	UMAReward                    string   `json:"umaReward,omitempty"`
	AcceptingOrders              bool     `json:"acceptingOrders,omitempty"`
	NegRisk                      bool     `json:"negRisk"`
	Events                       []Event  `json:"events,omitempty"`
	Ready                        bool     `json:"ready,omitempty"`
	Funded                       bool     `json:"funded,omitempty"`
	AcceptingOrdersTimestamp     string   `json:"acceptingOrdersTimestamp,omitempty"`
	CYOM                         bool     `json:"cyom"`
	Competitive                  float64  `json:"competitive,omitempty"`
	PagerDutyNotificationEnabled bool     `json:"pagerDutyNotificationEnabled,omitempty"`
	Approved                     bool     `json:"approved,omitempty"`
	RewardsMinSize               float64  `json:"rewardsMinSize,omitempty"`
	RewardsMaxSpread             float64  `json:"rewardsMaxSpread,omitempty"`
	Spread                       float64  `json:"spread,omitempty"`
	OneDayPriceChange            float64  `json:"oneDayPriceChange,omitempty"`
	OneHourPriceChange           float64  `json:"oneHourPriceChange,omitempty"`
	OneWeekPriceChange           float64  `json:"oneWeekPriceChange,omitempty"`
	OneMonthPriceChange          float64  `json:"oneMonthPriceChange,omitempty"`
	LastTradePrice               float64  `json:"lastTradePrice,omitempty"`
	BestBid                      float64  `json:"bestBid,omitempty"`
	BestAsk                      float64  `json:"bestAsk,omitempty"`
	AutomaticallyActive          bool     `json:"automaticallyActive,omitempty"`
	ClearBookOnStart             bool     `json:"clearBookOnStart,omitempty"`
	ManualActivation             bool     `json:"manualActivation,omitempty"`
	NegRiskOther                 bool     `json:"negRiskOther,omitempty"`
	UMAResolutionStatuses        string   `json:"umaResolutionStatuses,omitempty"`
	PendingDeployment            bool     `json:"pendingDeployment"`
	Deploying                    bool     `json:"deploying"`
	RFQEnabled                   bool     `json:"rfqEnabled,omitempty"`
	HoldingRewardsEnabled        bool     `json:"holdingRewardsEnabled,omitempty"`
	FeesEnabled                  bool     `json:"feesEnabled,omitempty"`
	RequiresTranslation          bool     `json:"requiresTranslation,omitempty"`
	CommentCount                 int      `json:"commentCount,omitempty"`
	ShowAllOutcomes              bool     `json:"showAllOutcomes,omitempty"`
	ShowMarketImages             bool     `json:"showMarketImages,omitempty"`
	EnableNegRisk                bool     `json:"enableNegRisk,omitempty"`
	NegRiskAugmented             bool     `json:"negRiskAugmented,omitempty"`
	NegRiskMarketID              string   `json:"negRiskMarketID,omitempty"`
	Series                       []Series `json:"series,omitempty"`
}

type Event struct {
	ID                  string  `json:"id"`
	Ticker              string  `json:"ticker,omitempty"`
	Slug                string  `json:"slug"`
	Title               string  `json:"title"`
	Description         string  `json:"description,omitempty"`
	ResolutionSource    string  `json:"resolutionSource,omitempty"`
	StartDate           string  `json:"startDate,omitempty"`
	CreationDate        string  `json:"creationDate,omitempty"`
	EndDate             string  `json:"endDate,omitempty"`
	Image               string  `json:"image,omitempty"`
	Icon                string  `json:"icon,omitempty"`
	Active              bool    `json:"active"`
	Closed              bool    `json:"closed"`
	Archived            bool    `json:"archived"`
	New                 bool    `json:"new"`
	Featured            bool    `json:"featured"`
	Restricted          bool    `json:"restricted"`
	Liquidity           float64 `json:"liquidity,omitempty"`
	Volume              float64 `json:"volume,omitempty"`
	OpenInterest        float64 `json:"openInterest,omitempty"`
	CreatedAt           string  `json:"createdAt,omitempty"`
	UpdatedAt           string  `json:"updatedAt,omitempty"`
	Competitive         float64 `json:"competitive,omitempty"`
	Volume24hr          float64 `json:"volume24hr,omitempty"`
	Volume1wk           float64 `json:"volume1wk,omitempty"`
	Volume1mo           float64 `json:"volume1mo,omitempty"`
	Volume1yr           float64 `json:"volume1yr,omitempty"`
	EnableOrderBook     bool    `json:"enableOrderBook"`
	LiquidityClob       float64 `json:"liquidityClob,omitempty"`
	CommentCount        int     `json:"commentCount,omitempty"`
	CYOM                bool    `json:"cyom"`
	ShowAllOutcomes     bool    `json:"showAllOutcomes"`
	ShowMarketImages    bool    `json:"showMarketImages"`
	EnableNegRisk       bool    `json:"enableNegRisk"`
	AutomaticallyActive bool    `json:"automaticallyActive"`
	NegRiskAugmented    bool    `json:"negRiskAugmented,omitempty"`
	PendingDeployment   bool    `json:"pendingDeployment"`
	Deploying           bool    `json:"deploying"`
	RequiresTranslation bool    `json:"requiresTranslation"`
}

type Series struct {
	ID                  string  `json:"id"`
	Ticker              string  `json:"ticker,omitempty"`
	Slug                string  `json:"slug,omitempty"`
	Title               string  `json:"title"`
	SeriesType          string  `json:"seriesType,omitempty"`
	Recurrence          string  `json:"recurrence,omitempty"`
	Image               string  `json:"image,omitempty"`
	Icon                string  `json:"icon,omitempty"`
	Active              bool    `json:"active"`
	Closed              bool    `json:"closed"`
	Archived            bool    `json:"archived"`
	Featured            bool    `json:"featured"`
	Restricted          bool    `json:"restricted"`
	CreatedAt           string  `json:"createdAt,omitempty"`
	UpdatedAt           string  `json:"updatedAt,omitempty"`
	Volume              float64 `json:"volume,omitempty"`
	Liquidity           float64 `json:"liquidity,omitempty"`
	CommentCount        int     `json:"commentCount,omitempty"`
	RequiresTranslation bool    `json:"requiresTranslation,omitempty"`
}

type Sport struct {
	Sport      string `json:"sport"`
	Image      string `json:"image"`
	Resolution string `json:"resolution"`
	Ordering   string `json:"ordering"`
	Tags       string `json:"tags"`
	Series     string `json:"series"`
}

var leagueTagIDs = map[string]int{
	"nba": 745,
	"nfl": 450,
}

func getMarketsByLeague(league string) ([]Market, error) {
	league = strings.ToLower(league)

	tagID, ok := leagueTagIDs[league]
	if !ok {
		return nil, fmt.Errorf("unknown league: %s (supported: nba, nfl)", league)
	}
	url := fmt.Sprintf(
		"https://gamma-api.polymarket.com/markets?sports_market_types=moneyline&closed=false&tag_id=%d",
		tagID,
	)
	fmt.Println((url))
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API returned %d: %s", resp.StatusCode, string(bodyBytes))
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var markets []Market
	err = json.Unmarshal(bodyBytes, &markets)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}

	return markets, nil
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"Hello": "World"})
	})

	r.GET("/league/:league", func(c *gin.Context) {
		league := strings.ToUpper(c.Param("league"))
		markets, err := getMarketsByLeague(league)
		if err != nil {
			// Return 500 with error message if something went wrong
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		// If no markets found, return empty
		if len(markets) == 0 {
			c.JSON(http.StatusOK, []Market{}) // or http.StatusNotFound
			return
		}
		c.JSON(http.StatusOK, markets)
	})

	r.Run(":8000") //prob wanna put this in a config file
}
