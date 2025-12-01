### 2. `user_story.md`

This file is your actionable to-do list.

```markdown
# Product Backlog & User Stories

## Phase 1: Foundation & Authentication (MVP Start)

- [ ] **Story 1.1: Project Initialization & Tailwind Setup**

  - _Task:_ Setup Monorepo (Client/Server), connect Local MongoDB, install Tailwind.
  - _Criteria:_ Server logs "MongoDB Connected"; Client renders Tailwind styles.
  - _Tech:_ `npm init`, `create vite`, `mongoose.connect('mongodb://127.0.0.1...')`.

- [ ] **Story 1.2: User Model & Local Auth API**

  - _Task:_ Create User Schema and Register/Login endpoints.
  - _Criteria:_ Passwords hashed (Bcrypt); Login returns JWT.
  - _Tech:_ `User.js` model, `authController.js`.

- [ ] **Story 1.3: Auth UI (Login/Register)**

  - _Task:_ Build Login/Register forms with Tailwind.
  - _Criteria:_ Form stores JWT in localStorage on success.
  - _Tech:_ `Login.jsx`, `Register.jsx`, `AuthContext`.

- [ ] **Story 1.4: Google OAuth Integration**
  - _Task:_ Implement "Sign in with Google".
  - _Criteria:_ Redirects to Google, returns with valid session/token.
  - _Tech:_ `passport-google-oauth20`.

## Phase 2: Core Functionality (Content & CRUD)

- [ ] **Story 2.1: The "Rulebook" (Static)**

  - _Task:_ Create a read-only page for Pickleball rules.
  - _Criteria:_ Styled text/images; accessible via Navbar.
  - _Tech:_ `Rules.jsx` (Tailwind Typography).

- [ ] **Story 2.2: Match Dashboard (Read & Delete)**

  - _Task:_ Protected route showing match history.
  - _Criteria:_ Fetch data from API; Delete button removes item.
  - _Tech:_ `Dashboard.jsx`, `GET /api/matches`.

- [ ] **Story 2.3: Create New Match**
  - _Task:_ Form to start a game or log a past result.
  - _Criteria:_ Saves to DB; Redirects to Live Match or Dashboard.
  - _Tech:_ `POST /api/matches`.

## Phase 3: Real-Time (Live Scoreboard)

- [ ] **Story 3.1: Socket.io Setup**

  - _Task:_ Configure Websocket connection.
  - _Criteria:_ Client logs "Connected"; Joins Match Room.
  - _Tech:_ `socket.io` (backend), `socket.io-client` (frontend).

- [ ] **Story 3.2: Live Scoring Logic**
  - _Task:_ Interactive buttons to update scores live.
  - _Criteria:_ Tapping "+" on Phone A updates Screen B instantly.
  - _Tech:_ `socket.emit('update_score')`, `socket.on('score_updated')`.

## Phase 4: PWA (Offline & Install)

- [ ] **Story 4.1: Manifest & Icons**

  - _Task:_ Configure `manifest.json`.
  - _Criteria:_ Chrome shows "Install" icon; Theme color is set.
  - _Tech:_ `public/manifest.json`.

- [ ] **Story 4.2: Service Worker (Caching)**
  - _Task:_ Cache assets and Rulebook page.
  - _Criteria:_ App works offline (specifically the Rules page).
  - _Tech:_ `vite-plugin-pwa`.

## Phase 5: Submission Polish

- [ ] **Story 5.1: Final UI Polish**
  - _Task:_ Ensure responsive design and green/sporty theme.
- [ ] **Story 5.2: Demo Video**
  - _Task:_ Record 5-8 min video showing all requirements.
```
