from fastapi import HTTPException, status


class AuthenticationError(HTTPException):
    """Raised when JWT validation fails"""
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class TokenExpiredError(AuthenticationError):
    """Raised when JWT has expired"""
    def __init__(self):
        super().__init__(detail="Token has expired")


class InvalidTokenError(AuthenticationError):
    """Raised when JWT is malformed or invalid"""
    def __init__(self, detail: str = "Invalid token"):
        super().__init__(detail=detail)
