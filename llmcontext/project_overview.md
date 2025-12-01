# Project Overview: PicklePal

## 1. Project Concept

**Name:** PicklePal (The Ultimate Court Companion)
**Goal:** A Full-Stack Real-Time Progressive Web Application (PWA) designed to help Pickleball players learn the game and track live scores on the court.
**Core Value:** "Learn at home, manage the game on the court."

## 2. Technical Stack

- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Local Instance)
- **Real-Time:** Socket.io (WebSockets)
- **Authentication:** JWT (Local) & Passport.js (Google OAuth 2.0)
- **PWA:** `vite-plugin-pwa` (Service Workers, Manifest, Offline Caching)

## 3. Core Features (Requirements)

1.  **Authentication:** Register/Login (Local) + Google OAuth.
2.  **Real-Time:** Live Scoreboard (changes on one device update others instantly).
3.  **CRUD:** Create, Read, and Delete Match History logs.
4.  **PWA/Offline:** Installable app; "Rulebook" page works without internet.
5.  **UI/UX:** Responsive design using Tailwind CSS.

## 4. Architecture

- **Client:** `client/` (React + Vite)
  - Runs on port `5173` (default).
  - Communicates via Axios (HTTP) and Socket.io Client (WS).
- **Server:** `server/` (Node/Express)
  - Runs on port `5000`.
  - Connects to `mongodb://127.0.0.1:27017/picklepal`.
  - Exposes REST API endpoints and Socket.io events.

## 5. Directory Structure (Monorepo)

```text
/root
  /client (React + Tailwind)
  /server (Express + Mongoose)
  /config (Shared configs/DB connection)
  README.md
```
