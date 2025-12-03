from typing import Union
import requests
from fastapi import FastAPI

app = FastAPI()


@app.get("/ping")
def health():
    return {"Hello": "World"}

# Gets all events related to a league
def get_events_by_league(league: str):
    """Returns all active polymarket events"""
    url = "/events?closed=false&limit=500"
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


@app.get("/league/{league}")
def get_leage_info(league: str):
    """Returns all teams associated with a given league"""
    url = "/teams"

    querystring = {
        "league":league
    }
    all_events = get_events_by_league(league)
    response = requests.get(url, params=querystring)

    pre_parsed_data = response.json()


    return 
