from fastapi import APIRouter
from resources.singletons import league_controller
from resources.singletons import supabase

market_router = APIRouter(
    prefix="/api/v1/market",
    tags=["market"]
)

@market_router.get(
    "/{market_id}",
    name="Gets a polymarket market based on the id"
)
async def get_market_by_id(
    market_id:int,
):
    """Gets a polymarket market based on the id"""
    return await league_controller.get_market_by_id(market_id)