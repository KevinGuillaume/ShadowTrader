package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"strings"
	"sync"
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

// Caching so that we can store info for events - prob wont want this if we are tracking live events
var (
	cacheMu      sync.RWMutex
	cachedEvents []Event
	cacheTime    time.Time
	cacheTTL     = 5 * time.Minute
)

func formatMoney(amount float64) string {
	if amount >= 1_000_000 {
		return fmt.Sprintf("$%.2fM", amount/1_000_000)
	} else if amount >= 1_000 {
		return fmt.Sprintf("$%.2fK", amount/1_000)
	}
	return fmt.Sprintf("$%.0f", amount)
}

func getEvents() ([]Event, error) {
	// Try to use cached data first
	cacheMu.RLock()
	if time.Since(cacheTime) < cacheTTL && cachedEvents != nil {
		defer cacheMu.RUnlock()
		return cachedEvents, nil
	}
	cacheMu.RUnlock()

	// If cache is old or empty → fetch fresh data
	resp, err := http.Get("https://gamma-api.polymarket.com/events?closed=false&limit=500")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var events []Event
	if err := json.NewDecoder(resp.Body).Decode(&events); err != nil {
		return nil, err
	}

	// Save to cache
	cacheMu.Lock()
	cachedEvents = events
	cacheTime = time.Now()
	cacheMu.Unlock()

	return events, nil
}

func parseMarkets(rawMarkets []Market) []CleanMarket {
	var cleaned []CleanMarket
	for _, m := range rawMarkets {
		eventRaw := m["events"].([]interface{})
		var event map[string]interface{}
		if len(eventRaw) > 0 {
			event = eventRaw[0].(map[string]interface{})
		}

		// Extract volumes
		volume := getFloat(m["volumeNum"])
		liquidity := getFloat(m["liquidityNum"])
		if liquidity == 0 {
			liquidity = getFloat(m["liquidityAmm"])
		}

		// Outcome prices
		var outcomePrices []float64
		if prices, ok := m["outcomePrices"].([]interface{}); ok {
			for _, p := range prices {
				if f, ok := p.(float64); ok {
					outcomePrices = append(outcomePrices, f)
				}
			}
		}

		// Outcomes
		var outcomes []string
		if outs, ok := m["outcomes"].([]interface{}); ok {
			for _, o := range outs {
				if s, ok := o.(string); ok {
					outcomes = append(outcomes, s)
				}
			}
		}
		if len(outcomes) == 0 && len(outcomePrices) == 2 {
			outcomes = []string{"Yes", "No"}
		}

		// Probabilities
		var probs []float64
		for _, p := range outcomePrices {
			probs = append(probs, math.Round(p*100*10)/10) // 1 decimal
		}

		cleaned = append(cleaned, CleanMarket{
			ID:          getString(m["id"]),
			Question:    getString(m["question"], getString(event["title"])),
			Slug:        getString(m["slug"]),
			Description: strings.TrimSpace(getString(m["description"]))[:280],
			// Images (simplified - add optimized logic if needed)
			Image:              getString(m["image"]),
			Icon:               getString(m["icon"]),
			EventImage:         getString(event["image"]),
			Outcomes:           outcomes,
			OutcomePrices:      outcomePrices,
			Probabilities:      probs,
			Volume:             volume,
			VolumeFormatted:    formatMoney(volume),
			Liquidity:          liquidity,
			LiquidityFormatted: formatMoney(liquidity),
			Volume24hr:         getFloat(m["volume24hr"]),
			EndDate:            getString(m["endDate"], m["endDateIso"]),
			Closed:             getBool(m["closed"]),
			Active:             getBool(m["active"], true),
			// Add other fields similarly...
		})
	}
	return cleaned
}

// Helper funcs for safe extraction
func getString(vals ...interface{}) string {
	for _, v := range vals {
		if s, ok := v.(string); ok && s != "" {
			return s
		}
	}
	return ""
}
func getFloat(v interface{}) float64 {
	if f, ok := v.(float64); ok {
		return f
	}
	return 0
}
func getBool(v interface{}, def ...bool) bool {
	if b, ok := v.(bool); ok {
		return b
	}
	if len(def) > 0 {
		return def[0]
	}
	return false
}
func getStringSlice(v interface{}) []string {
	if slice, ok := v.([]string); ok {
		return slice
	}
	return nil
}
func extractTags(tagsRaw interface{}) []string {
	var tags []string
	if tagList, ok := tagsRaw.([]interface{}); ok {
		for _, t := range tagList {
			if tagMap, ok := t.(map[string]interface{}); ok {
				if label := getString(tagMap["label"]); label != "" {
					tags = append(tags, label)
				}
			}
		}
	}
	return tags
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

		events, err := getEvents()
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch data from Polymarket"})
			return
		}

		var allMarkets []CleanMarket
		for _, event := range events {
			if strings.Contains(strings.ToUpper(event.Title), league) {
				allMarkets = append(allMarkets, parseMarkets(event.Markets)...)
			}
		}

		c.JSON(200, gin.H{
			"league":       league,
			"market_count": len(allMarkets),
			"markets":      allMarkets,
		})
	})

	r.Run(":8000") //prob wanna put this in a config file
}
