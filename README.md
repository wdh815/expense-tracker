# 지출 관리(가계부) API + 개인 소개 페이지

클라우드컴퓨팅실습 개인과제 — 개인 소개 페이지 제작 및 프론트엔드·백엔드 연동.

## 프로젝트 소개

FastAPI로 만든 가계부(지출 관리) CRUD API와, 이를 호출해 거래를 등록·조회·삭제하는 정적 프론트엔드로 구성됩니다. 개인 소개 페이지에서 API 연동 실습 페이지로 이동할 수 있습니다.

## 주요 구성

| 폴더 | 내용 | 배포 |
|---|---|---|
| [expense-api/](expense-api/) | FastAPI 백엔드 (`/`, `/health`, `/transactions` CRUD) | Render |
| [expense-frontend/](expense-frontend/) | 개인 소개(`index.html`) + API 연동 데모(`demo.html`) | Vercel |

### 백엔드 엔드포인트

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/` | 환영 메시지 |
| GET | `/health` | 상태 확인 |
| GET | `/transactions` | 거래 목록 조회 (`skip`, `limit` 쿼리) |
| POST | `/transactions` | 거래 등록 |
| GET | `/transactions/{id}` | 거래 단건 조회 |
| DELETE | `/transactions/{id}` | 거래 삭제 |

## 로컬 실행

### 백엔드
```
cd expense-api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
`http://127.0.0.1:8000/docs` 에서 Swagger UI 확인.

### 프론트엔드
`expense-frontend/script.js` 상단의 `API_BASE` 를 로컬 백엔드 주소로 맞춘 뒤, `expense-frontend` 폴더를 정적 서버로 열면 됩니다.

## 배포 방법

### 백엔드 (Render)
- Root Directory: `expense-api`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- 환경변수 `ALLOWED_ORIGINS` 에 Vercel 배포 주소 입력 (예: `https://<프로젝트>.vercel.app`, 끝에 `/` 없이)

### 프론트엔드 (Vercel)
- Root Directory: `expense-frontend`
- Framework Preset: Other (정적 사이트)
- 배포 후 `expense-frontend/script.js` 의 `API_BASE` 를 Render 배포 주소로 교체하고 다시 push

## 배포 주소

- Vercel: (배포 후 작성)
- Render (Swagger UI): https://expense-api-mp1j.onrender.com/docs
