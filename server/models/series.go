package models

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
