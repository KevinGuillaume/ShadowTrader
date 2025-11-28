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

    pre_parsed_data = response.json()

    # For each team get meta data
    for d in pre_parsed_data:
        #Then going to have to make a call to get meta deta


        #After getting meta data gonna want to grab tags


        #After getting tags then will want to use that to query markets 




    return 