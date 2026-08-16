# Coding Contest Tracker

A full-stack app that aggregates upcoming programming contests from Codeforces, CodeChef, AtCoder, and LeetCode.

## Overview

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Express + TypeScript + Upstash Redis cache
- **Discord Bot** Discord.js + TypeScript
- **Purpose:** Display upcoming contests, durations, and countdowns in a clean table with platform filtering.
- **Data sources:** public APIs and web-scraped contest listings for each supported platform.

## Technologies used
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-%23CA4245.svg?style=for-the-badge&logo=react-router&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-%236DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
## Features

- Automatic contest refresh from backend data caching
- Filter contests by platform
- Countdown timer for contest start times
- Direct contest links for Codeforces, CodeChef, AtCoder, and LeetCode
- Error toast notifications for failed requests

## Discord Bot Commands
- `/contests` - Get upcoming contest data and filter them by platform.
- `/help` - Get info on the bot's commands.
- `/about` - Get info on the bot itself.


## Add discord bot to your server
![Add to your server](https://discord.com/oauth2/authorize?client_id=1375687808571805696&permissions=19456&integration_type=0&scope=bot+applications.commands)

## Repository Structure

- `frontend/` — user interface and Vite app
- `backend/` — Express server, data fetchers, and Redis-backed cache
- `frontend/public/` — static assets, including the generated SVG icon
- `discordBot/` - Code for the discord bot
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
