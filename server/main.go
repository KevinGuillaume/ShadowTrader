package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Event struct {
	Title   string   `json:"title"`
	Markets []Market `json:"markets"`
}

type Market map[string]interface{}

type CleanMarket struct {
	ID                 string      `json:"id"`
	Question           string      `json:"question"`
	Slug               string      `json:"slug"`
	Description        string      `json:"description"`
	Image              string      `json:"image"`
	Icon               string      `json:"icon"`
	EventImage         string      `json:"eventImage"`
	Outcomes           []string    `json:"outcomes"`
	OutcomePrices      []float64   `json:"outcomePrices"`
	Probabilities      []float64   `json:"probabilities"`
	Volume             float64     `json:"volume"`
	VolumeFormatted    string      `json:"volumeFormatted"`
	Liquidity          float64     `json:"liquidity"`
	LiquidityFormatted string      `json:"liquidityFormatted"`
	Volume24hr         float64     `json:"volume24hr"`
	EndDate            string      `json:"endDate"`
	Closed             bool        `json:"closed"`
	Active             bool        `json:"active"`
	Change24h          interface{} `json:"change24h"`
	Change1w           interface{} `json:"change1w"`
	HasOrderBook       bool        `json:"hasOrderBook"`
	BestBid            interface{} `json:"bestBid"`
	BestAsk            interface{} `json:"bestAsk"`
	Tags               []string    `json:"tags"`
	Category           string      `json:"category"`
	Ticker             string      `json:"ticker"`
	IsNew              bool        `json:"isNew"`
	IsFeatured         bool        `json:"isFeatured"`
	NegRisk            bool        `json:"negRisk"`
	TweetCount         int         `json:"tweetCount"`
	GameStartTime      string      `json:"gameStartTime"`
	Live               bool        `json:"live"`
}

func containsWholeWord(title, word string) bool {
	titleUpper := strings.ToUpper(title)
	wordUpper := strings.ToUpper(word)

	// Look for word surrounded by spaces, punctuation, or start/end
	pattern := `(^|\s|\b)` + regexp.QuoteMeta(wordUpper) + `(\s|\b|$|\.|\?|!)`
	matched, _ := regexp.MatchString(pattern, titleUpper)
	return matched
}

func getEventsByLeague(league string) ([]Event, error) {
	resp, err := http.Get("https://gamma-api.polymarket.com/events?closed=false&limit=500")
	if err != nil {
		return nil, err // Network error (e.g., no internet, timeout)
	}
	defer resp.Body.Close()

	// Check if the request was successful (HTTP 200)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status: %d", resp.StatusCode)
	}

	// Parse the JSON response into a slice of Event (flexible maps)
	var events []Event
	if err := json.NewDecoder(resp.Body).Decode(&events); err != nil {
		return nil, err // JSON parsing error
	}

	// Filter events: keep only those where the title contains the league string
	var filtered []Event
	for _, event := range events {
		if containsWholeWord(event.Title, league) {
			filtered = append(filtered, event)
		}
	}

	return filtered, nil
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
		events, err := getEventsByLeague(league)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		// This automatically returns JSON!
		c.JSON(200, gin.H{
			"league":       league,
			"market_count": len(events),
			"events":       events, // ← your filtered slice!
		})

	})

	r.Run(":8000") //prob wanna put this in a config file
}
