package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"polymarket-api/services"

	"github.com/gin-gonic/gin"
)

func GetLeagueMarkets(c *gin.Context) {
	league := strings.ToUpper(c.Param("league"))

	markets, err := services.GetMarketsByLeague(league)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, markets)
}

func GetRosterForTeam(c *gin.Context) {
	league := strings.ToLower((c.Param("league")))
	teamName := strings.ToLower((c.Param(("teamName"))))

	roster, err := services.GetTeamRostersByLeagueAndTeamID(league, teamName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, roster)

}

func GetMarketByID(c *gin.Context) {
	param := c.Param("marketID")
	marketID, err := strconv.Atoi(param)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid market ID. Must be a number.",
		})
		return
	}
	market, err := services.GetMarketByID((marketID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, market)

}

func GetPlayerStatsVsTeam(c *gin.Context) {
	athleteID := c.Param("atheleteID")
	league := c.Param("league")
	opponent := c.Param("opponent")

	if league == "" || opponent == "" {
		c.JSON(400, gin.H{"error": "league and opponent required"})
		return
	}

	averages, err := services.GetPlayerAveragesVsOpponent(league, athleteID, opponent)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, averages)
}
