import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import transactions

app = FastAPI(title="지출 관리 API")

# 배포 시 Vercel 주소를 ALLOWED_ORIGINS 환경변수로 넣는다 (콤마로 여러 개 구분 가능)
allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "지출 관리 API에 오신 것을 환영합니다"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(transactions.router)