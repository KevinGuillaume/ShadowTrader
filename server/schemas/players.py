from datetime import date, datetime
from pydantic import BaseModel, Field

class Players(BaseModel):
    """
    Pydantic model representing the Players table.
    """
    id: int = Field(..., description="Auto-incrementing primary key")
    team_id: int = Field(..., description="Foreign key to teams.id")
    first_name: str = Field(..., description="first name of the player")
    last_name: str = Field(None, description="last name of the player")
    photo_url: str = Field(None, description="photo url to display for the player on the frontend")
    position: str = Field(None, description="Position of a player")
    status: str = Field(None, description="If a player is Active/Injured")
    # Metadata
    created_at: datetime = Field(..., description="When this record was created")
