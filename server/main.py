from typing import Union
import requests
from fastapi import FastAPI

app = FastAPI()


@app.get("/ping")
def health():
    return {"Hello": "World"}

@app.get("/league/{league}")
def get_leage_info(league: str):
    """Returns all teams associated with a given league"""
    url = "/teams"

    querystring = {"league":"nfl"}

    response = requests.get(url, params=querystring)

    return response.json()