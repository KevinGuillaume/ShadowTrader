from datetime import date, datetime
from pydantic import BaseModel, Field


class Leagues(BaseModel):
    """
    Pydantic model representing the Leagues table.
    """
    id: int = Field(..., description="Auto-incrementing primary key")
    name: int = Field(None, description="name of the league")
    abbreviation: int = Field(None, description="Abbreviation for the league (NBA,NFL,...)")
    sport: str = Field(..., description="first name of the player")
    # Metadata
    created_at: datetime = Field(..., description="When this record was created")