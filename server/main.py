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
    print("length: ",len(data))
    events = []
    for event in data:
        # Filter for NFL related events... NFL is hardcoded for now i'll add a map for different ones like nba soccer etc
        if league in event["title"]:
            events.append(event)

    return events

@app.get("/league/{league}")
def get_leage_info(league: str):
    """Returns all teams associated with a given league"""
    url = "/teams"

    querystring = {
        "league":league
    }
    all_event = get_events_by_league(league)
    response = requests.get(url, params=querystring)

    pre_parsed_data = response.json()





    return 