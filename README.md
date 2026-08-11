# Coding Contest Tracker

A full-stack app that aggregates upcoming programming contests from Codeforces, CodeChef, AtCoder, and LeetCode.

## Overview

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Express + TypeScript + Upstash Redis cache
- **Purpose:** Display upcoming contests, durations, and countdowns in a clean table with platform filtering.
- **Data sources:** public APIs and web-scraped contest listings for each supported platform.

## Features

- Automatic contest refresh from backend data caching
- Filter contests by platform
- Countdown timer for contest start times
- Direct contest links for Codeforces, CodeChef, AtCoder, and LeetCode
- Error toast notifications for failed requests

## Repository Structure

- `frontend/` — user interface and Vite app
- `backend/` — Express server, data fetchers, and Redis-backed cache
- `frontend/public/` — static assets, including the generated SVG icon

## Local Setup

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with values for:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `ORIGIN` (frontend origin for CORS)

4. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   - `VITE_BACKEND_URL=http://localhost:3000`

4. Start the frontend:
   ```bash
   npm run dev
   ```

## Deployment Notes

- The backend uses Redis caching via Upstash and refreshes contest data on demand.
- The frontend is a static Vite app and can be hosted on Vercel, Netlify, or any static hosting provider.
- Ensure `VITE_BACKEND_URL` points to the deployed backend.

## API

- `GET /all` — returns cached contest data for all supported platforms.

## Notes

- The app currently refreshes contest data twice per day in the backend.
- The frontend uses the backend URL from `import.meta.env.VITE_BACKEND_URL`.

## Credits

Made by `bruzz-bruzz`.
