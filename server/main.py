from typing import Union
import requests
from fastapi import FastAPI
from typing import Union
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.get("/ping")
def health():
    return {"Hello": "World"}

# Gets all events related to a league
def get_events_by_league(league: str):
    """Returns all active polymarket events"""
    url = "https://gamma-api.polymarket.com/events?closed=false&limit=500"
    response = requests.get(url)

    data = response.json()
    events = []
    for event in data:
        if league in event["title"]:
            events.append(event)

    return events


def get_markets_for_event(event):
    """Gets all markets for a given event object"""    
    markets = []
    for market in event["markets"]:
        markets.append(market)

    return markets


def parse_polymarket_markets(raw_markets):
    """
    Takes the massive raw Polymarket market objects and returns clean,
    front-end-friendly versions with only the important fields i like lol.
    """
    cleaned = []

    for market in raw_markets:
        # Safely extract nested values
        event = market.get("events", [{}])[0] if market.get("events") else {}
        image_opt = market.get("imageOptimized", {})
        icon_opt = market.get("iconOptimized", {})
        event_image_opt = event.get("imageOptimized") or event.get("featuredImageOptimized", {})

        # Volume & Liquidity as numbers
        volume = market.get("volumeNum") or 0
        liquidity = market.get("liquidityNum") or market.get("liquidityAmm", 0) or 0

        # Outcome prices 
        outcome_prices = market.get("outcomePrices", [])
        if isinstance(outcome_prices, str):
            try:
                import json
                outcome_prices = json.loads(outcome_prices)
            except:
                outcome_prices = []
        outcome_prices = [float(p) for p in outcome_prices if p]

        # Outcomes labels
        outcomes = market.get("outcomes", [])
        if isinstance(outcomes, str):
            try:
                import json
                outcomes = json.loads(outcomes)
            except:
                outcomes = []
        if isinstance(outcomes, list) and len(outcomes) == 0 and len(outcome_prices) > 1:
            outcomes = ["Yes", "No"]  # fallback for binary markets

        # Build clean object
        clean_market = {
            "id": market.get("id"),
            "question": market.get("question") or event.get("title"),
            "slug": market.get("slug"),
            "description": market.get("description", "")[:280],  # truncate long ones

            # Images
            "image": image_opt.get("imageUrlOptimized") or market.get("image"),
            "icon": icon_opt.get("imageUrlOptimized") or market.get("icon"),
            "eventImage": event_image_opt.get("imageUrlOptimized") or event.get("image"),

            # Outcomes & Prices
            "outcomes": outcomes,
            "outcomePrices": outcome_prices,
            "probabilities": [round(p * 100, 1) for p in outcome_prices],  # e.g., [62.3, 37.7]

            # Money & Activity
            "volume": volume,
            "volumeFormatted": format_money(volume),
            "liquidity": liquidity,
            "liquidityFormatted": format_money(liquidity),
            "volume24hr": market.get("volume24hr", 0),

            # Dates & Status
            "endDate": market.get("endDate") or market.get("endDateIso"),
            "closed": market.get("closed", False),
            "active": market.get("active", True),

            # Price changes
            "change24h": market.get("oneDayPriceChange"),
            "change1w": market.get("oneWeekPriceChange"),

            # Order book
            "hasOrderBook": market.get("enableOrderBook", False) or bool(market.get("clobTokenIds")),
            "bestBid": market.get("bestBid"),
            "bestAsk": market.get("bestAsk"),

            # Tags & Category
            "tags": [t.get("label") for t in (market.get("tags") or []) if t.get("label")],
            "category": market.get("category") or event.get("category"),

            # Extra stuff
            "ticker": event.get("ticker"),
            "isNew": market.get("new", False),
            "isFeatured": market.get("featured", False),
            "negRisk": event.get("negRisk", False),
            "tweetCount": event.get("tweetCount", 0),

            # Sports
            "gameStartTime": market.get("gameStartTime") or event.get("startTime"),
            "live": event.get("live", False),
        }

        cleaned.append(clean_market)

    return cleaned


def format_money(amount: float) -> str:
    """Convert numbers to abbreviations like: 1234567 -> $1.23M, 1234 -> $1.23K, etc."""
    if amount >= 1_000_000:
        return f"${amount / 1_000_000:.2f}M".rstrip("0").rstrip(".")
    elif amount >= 1_000:
        return f"${amount / 1_000:.2f}K".rstrip("0").rstrip(".")
    else:
        return f"${amount:,.0f}"


@app.get("/league/{league}")
def get_leage_info(league: str):
    """Returns all teams associated with a given league"""
    url = "https://gamma-api.polymarket.com/teams"

    querystring = {
        "league":league
    }
    all_events = get_events_by_league(league)
    
    events_and_markets_map = {}
    temp = None
    # Use all events 
    for event in all_events:
        # get the markets then clean them
        all_markets_for_this_event = get_markets_for_event(event)
        # going to return this one
        cleaned_markets_to_return = parse_polymarket_markets(all_markets_for_this_event)
        temp = cleaned_markets_to_return



    response = requests.get(url, params=querystring)

    pre_parsed_data = response.json()

    print(temp)

    return temp
