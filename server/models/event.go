package models

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
