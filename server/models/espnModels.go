package models

import "encoding/json"

// ESPNTeamRosterResponse represents the actual structure from
// https://site.web.api.espn.com/apis/site/v2/sports/{sport}/{league}/teams/{id}/roster
type ESPNTeamRosterResponse struct {
	Timestamp string          `json:"timestamp"`
	Status    string          `json:"status"`
	Season    ESPNSeason      `json:"season"`
	Athletes  ESPNAthleteList `json:"athletes"`
	Coach     []ESPNCoach     `json:"coach,omitempty"`
	Team      ESPNRosterTeam  `json:"team,omitempty"`
}

type ESPNSeason struct {
	Year        int    `json:"year"`
	DisplayName string `json:"displayName"`
	Type        int    `json:"type"`
	Name        string `json:"name"`
}

type ESPNAthlete struct {
	ID            string          `json:"id"`
	UID           string          `json:"uid,omitempty"`
	GUID          string          `json:"guid,omitempty"`
	FirstName     string          `json:"firstName"`
	LastName      string          `json:"lastName"`
	FullName      string          `json:"fullName"`
	DisplayName   string          `json:"displayName"`
	ShortName     string          `json:"shortName"`
	Jersey        string          `json:"jersey"`
	Position      ESPNPosition    `json:"position"`
	Weight        float64         `json:"weight,omitempty"`
	DisplayWeight string          `json:"displayWeight,omitempty"`
	Height        float64         `json:"height,omitempty"`
	DisplayHeight string          `json:"displayHeight,omitempty"`
	Age           int             `json:"age,omitempty"`
	DateOfBirth   string          `json:"dateOfBirth,omitempty"`
	Headshot      *ESPNHeadshot   `json:"headshot,omitempty"`
	Status        ESPNStatus      `json:"status,omitempty"`
	Experience    *ESPNExperience `json:"experience,omitempty"`
}

//
// ---------- ATHLETE LIST NORMALIZATION ----------
//

type ESPNAthleteList []ESPNAthlete

func (l *ESPNAthleteList) UnmarshalJSON(data []byte) error {
	if len(data) == 0 {
		return nil
	}

	// Case 1 & 3: athletes is an array (NBA or NFL-grouped)
	if data[0] == '[' {
		// Peek at first element to detect shape
		var probe []map[string]json.RawMessage
		if err := json.Unmarshal(data, &probe); err != nil {
			return err
		}

		if len(probe) == 0 {
			*l = []ESPNAthlete{}
			return nil
		}

		// NFL case: grouped objects contain "items"
		if _, ok := probe[0]["items"]; ok {
			var groups []struct {
				Items []ESPNAthlete `json:"items"`
			}

			if err := json.Unmarshal(data, &groups); err != nil {
				return err
			}

			var all []ESPNAthlete
			for _, g := range groups {
				all = append(all, g.Items...)
			}

			*l = all
			return nil
		}

		// NBA case: flat athlete list
		var athletes []ESPNAthlete
		if err := json.Unmarshal(data, &athletes); err != nil {
			return err
		}

		*l = athletes
		return nil
	}

	// Case 2: athletes is wrapped in { items: [] }
	var wrapped struct {
		Items []ESPNAthlete `json:"items"`
	}

	if err := json.Unmarshal(data, &wrapped); err != nil {
		return err
	}

	*l = wrapped.Items
	return nil
}

//
// ---------- POSITION NORMALIZATION ----------
//

type ESPNPosition struct {
	ID           string `json:"id,omitempty"`
	Name         string `json:"name,omitempty"`
	DisplayName  string `json:"displayName,omitempty"`
	Abbreviation string `json:"abbreviation,omitempty"`
	Leaf         bool   `json:"leaf,omitempty"`
}

// UnmarshalJSON allows ESPNPosition to accept BOTH:
// - NBA: object
// - NFL: string (e.g. "QB")
func (p *ESPNPosition) UnmarshalJSON(data []byte) error {
	// Case 1: string position (NFL)
	if len(data) > 0 && data[0] == '"' {
		var abbrev string
		if err := json.Unmarshal(data, &abbrev); err != nil {
			return err
		}

		p.Abbreviation = abbrev
		p.Name = abbrev
		p.DisplayName = abbrev
		return nil
	}

	// Case 2: object position (NBA)
	type Alias ESPNPosition
	var aux Alias
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	*p = ESPNPosition(aux)
	return nil
}

//
// ---------- SUPPORTING TYPES ----------
//

type ESPNHeadshot struct {
	Href string `json:"href"`
	Alt  string `json:"alt,omitempty"`
}

type ESPNStatus struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Type         string `json:"type"`
	Abbreviation string `json:"abbreviation"`
}

type ESPNExperience struct {
	Years int `json:"years"`
}

type ESPNCoach struct {
	ID         string `json:"id"`
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	Experience int    `json:"experience"`
}

type ESPNRosterTeam struct {
	ID           string `json:"id"`
	Abbreviation string `json:"abbreviation"`
	Location     string `json:"location"`
	Name         string `json:"name"`
	DisplayName  string `json:"displayName"`
}
