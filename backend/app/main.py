from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.explain import router as explain_router
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(explain_router, prefix="/api")
