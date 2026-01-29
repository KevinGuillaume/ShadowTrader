from datetime import date, datetime
from pydantic import BaseModel, Field

class Venues(BaseModel):
    """
    Pydantic model representing the Venues table.
    """
    id: int = Field(..., description="Auto-incrementing primary key")
    name: str = Field(None, description="Name of the venue")
    city: str = Field(None, description="Name of the city for the venue")
    state: str = Field(..., description="State of the venue")
    is_indoor: bool = Field(None, description="Indoor or outdoor boolean")
    surface_type: str = Field(None, description="Type of material for the venue")
    # Metadata
    created_at: datetime = Field(..., description="When this record was created")