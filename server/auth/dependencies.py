from fastapi import Depends, Security
from fastapi.security import APIKeyHeader
from configparser import ConfigParser

from .exceptions import AuthenticationError

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

_valid_api_key: str = None


def init_api_key():
    """Load API key from config"""
    global _valid_api_key
    config = ConfigParser()
    config.read("config.ini")
    _valid_api_key = config.get("SERVER", "api_key")


async def verify_token(
    api_key: str = Security(api_key_header)
) -> str:
    """
    Verify API key from X-API-Key header.
    This is the main auth dependency to use in routes.
    """
    if _valid_api_key is None:
        init_api_key()

    if api_key is None:
        raise AuthenticationError("X-API-Key header missing")

    if api_key != _valid_api_key:
        raise AuthenticationError("Invalid API key")

    return api_key
