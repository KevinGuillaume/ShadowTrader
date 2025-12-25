package handlers

import (
	"net/http"
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
