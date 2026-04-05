# MO Marketplace

Full-stack marketplace app with product & variant management.

## Quick Start

### With Docker
```bash
git clone https://github.com/SandeepaLakruwan/Mo-Marketplace-Full-Stack.git
cd mo-marketplace
cp .env.example .env   # Edit your secrets
docker compose up -d
```

- Frontend: http://localhost
- API: http://localhost:3000
- Swagger: http://localhost:3000/api

### Without Docker
```bash
# Terminal 1 — Backend
cd mo-marketplace-api
npm install
cp .env.example .env
npm run start:dev

# Terminal 2 — Frontend  
cd mo-marketplace-web
npm install
npm run dev
```

## Architecture Decisions
- **NestJS** — Structured, scalable, great DI system
- **TypeORM** — Type-safe DB queries, auto-migration in dev
- **JWT** — Stateless auth, no session storage needed
- **combination_key** — Generated as `color-size-material` slug, indexed for fast duplicate detection
- **Dark theme** — CSS variables for easy theming, no UI library dependency

## API Endpoints
See full docs at http://localhost:3000/api (Swagger)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register user |
| POST | /auth/login | No | Login, get JWT |
| GET | /products | No | List products |
| POST | /products | Yes | Create product |
| GET | /products/:id | No | Get product detail |
| PATCH | /products/:id | Yes | Update product |
| DELETE | /products/:id | Yes | Delete product |
| POST | /variants | Yes | Create variant |
| GET | /variants/product/:id | No | Get variants for product |
| PATCH | /variants/:id/stock | Yes | Update stock |

## Testing
```bash
# Postman — import collection
newman run postman_collection.json

# JMeter load test
cd jmeter && ./run_tests.sh
```
