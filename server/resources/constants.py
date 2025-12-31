# constants.py
"""
Constants for leagues, sport paths, and team IDs used across the application.
These are static mappings based on ESPN's internal IDs and naming conventions.
"""

# League to ESPN sport path mapping
LEAGUE_TO_SPORT = {
    "nfl": "football/nfl",
    "nba": "basketball/nba",
}

# League tag IDs (used in some ESPN API endpoints or filters)
LEAGUE_TAG_IDS = {
    "nba": 745,
    "nfl": 450,
}

# NFL Team IDs (ESPN internal IDs) - slug to ID
NFL_TEAM_IDS = {
    "falcons": 1,
    "bills": 2,
    "bears": 3,
    "bengals": 4,
    "browns": 5,
    "cowboys": 6,
    "broncos": 7,
    "lions": 8,
    "packers": 9,
    "titans": 10,
    "colts": 11,
    "chiefs": 12,
    "raiders": 13,
    "rams": 14,
    "dolphins": 15,
    "vikings": 16,
    "patriots": 17,
    "saints": 18,
    "giants": 19,
    "jets": 20,
    "eagles": 21,
    "cardinals": 22,
    "steelers": 23,
    "chargers": 24,
    "49ers": 25,
    "seahawks": 26,
    "buccaneers": 27,
    "commanders": 28,
    "panthers": 29,
    "jaguars": 30,
    "ravens": 33,
    "texans": 34,
}

# NBA Team IDs (ESPN internal IDs) - slug to ID
NBA_TEAM_IDS = {
    "hawks": 1,
    "celtics": 2,
    "pelicans": 3,
    "bulls": 4,
    "cavaliers": 5,
    "mavericks": 6,
    "nuggets": 7,
    "pistons": 8,
    "warriors": 9,
    "rockets": 10,
    "pacers": 11,
    "clippers": 12,
    "lakers": 13,
    "heat": 14,
    "bucks": 15,
    "timberwolves": 16,
    "nets": 17,
    "knicks": 18,
    "magic": 19,
    "76ers": 20,
    "suns": 21,
    "trail blazers": 22,
    "kings": 23,
    "spurs": 24,
    "thunder": 25,
    "jazz": 26,
    "wizards": 27,
    "raptors": 28,
    "grizzlies": 29,
    "hornets": 30,
}

# Optional: Reverse mappings (ID → slug) if you ever need to look up by ID
NFL_TEAM_SLUGS = {v: k for k, v in NFL_TEAM_IDS.items()}
NBA_TEAM_SLUGS = {v: k for k, v in NBA_TEAM_IDS.items()}