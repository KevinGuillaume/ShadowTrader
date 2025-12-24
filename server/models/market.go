package models

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
