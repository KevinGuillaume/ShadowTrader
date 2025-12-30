package main

import (
	"time"

	"polymarket-api/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type"},
		MaxAge:       12 * time.Hour,
	}))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"Hello": "World"})
	})

	r.GET("/league/:league", handlers.GetLeagueMarkets)
	r.GET("/league/:league/:teamName", handlers.GetRosterForTeam)
	r.GET("/player/stats/:league/:atheleteID/:opponent", handlers.GetPlayerStatsVsTeam)
	r.GET("/market/:marketID", handlers.GetMarketByID)
	r.Run(":8000")
}
