from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.base import BaseHTTPMiddleware
from api_server.middleware.auth import api_key_middleware
from api_server.routers.billers import router as billers_router
from api_server.routers.bou import bou_router
from api_server.routers.onboarding_chat import router as chat_router
from api_server.routers.onboarding_register import router as register_router
from api_server.routers.transactions import router as transactions_router
from fastapi.staticfiles import StaticFiles



load_dotenv()

app = FastAPI(title="BBPS Platform", version="0.1.0")

# Register our custom auth middleware
app.add_middleware(BaseHTTPMiddleware, dispatch=api_key_middleware)

# Register our routers
app.include_router(billers_router)
app.include_router(bou_router)
app.include_router(chat_router)
app.include_router(register_router)
app.include_router(transactions_router)
app.mount("/ui", StaticFiles(directory="ui", html=True), name="ui")





@app.get("/health")
def health():
    return {"status": "ok", "service": "bbps-platform"}