from datetime import date, datetime
from pydantic import BaseModel, Field

class Teams(BaseModel):
    """
    Pydantic model representing the Teams table.
    """
    id: int = Field(..., description="Auto-incrementing primary key")
    venue_id: int = Field(None, description="Foreign key to venues.id")
    league_id: int = Field(None, description="Foreign key to leagues.id")
    team_name: str = Field(..., description="first name of the player")
    abbreviation: str = Field(None, description="last name of the player")
    logo_url: str = Field(None, description="logo url to display for the player on the frontend")
    # Metadata
    created_at: datetime = Field(..., description="When this record was created")
