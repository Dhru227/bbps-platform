import os
from fastapi import Request
from fastapi.responses import JSONResponse

PLATFORM_API_KEY = os.getenv("PLATFORM_API_KEY", "POC-PLATFORM-KEY-001")

PUBLIC_PATHS = {"/health", "/docs", "/openapi.json", "/onboard/start", "/onboard/chat", "/ui/onboard.html", "/ui/dashboard.html", "/ui/index.html", "/bou/register-biller", "/billers"}

async def api_key_middleware(request: Request, call_next):
    # Allow public paths and anything starting with /ui/ (for static files)
    if request.url.path in PUBLIC_PATHS or request.url.path.startswith("/ui/") or request.url.path.startswith("/billers"):
        return await call_next(request)
        
    key = request.headers.get("X-API-Key")
    if key != PLATFORM_API_KEY:
        return JSONResponse(status_code=401, content={"detail": "Invalid or missing API key"})
    
    return await call_next(request)