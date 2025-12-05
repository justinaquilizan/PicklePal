# Feature Context & Implementation Logs

## Active Feature

_(Currently Empty - To be filled when development starts)_

## Completed Features

**Feature:** Story 1.1: Project Initialization & Tailwind Setup
**Date Completed:** 12/01/2025
**Key Files Created/Modified:**

- `server/server.js` (Implicitly, as a server needs to be set up)
- `server/config/db.js` (For MongoDB connection)
  **Implementation Notes:**
- Initialized monorepo structure with client/server directories.
- Set up Express server to run on port 5000.
- Connected to Local MongoDB instance at 127.0.0.1.

**Feature:** Story 1.2: User Model & Local Auth API
**Date Completed:** 12/01/2025
**Key Files Created/Modified:**

- `/models/User.js` (User Schema)
- `/controllers/authController.js` (Registration and Login logic)
- `/routes/authRoutes.js` (API endpoints for auth)
  **Implementation Notes:**
- Created User schema with username, email, password, and googleId fields.
- Implemented register controller to handle duplicate checks, password hashing with Bcrypt, and user saving.
- Implemented login controller to find user, compare hashed passwords, sign and return a JWT token, and return user data.

**Feature:** Story 1.3: Auth UI (Login/Register Pages)
**Date Completed:** 12/01/2025
**Key Files Created/Modified:**

- `/src/pages/Login.jsx` (Login form)
- `/src/pages/Register.jsx` (Registration form)
- `/src/context/AuthContext.jsx` (Global user state management)
  **Implementation Notes:**
- Created clean, centered forms using Tailwind CSS grid/flex classes for Login and Register pages.
- Styled a distinctive "Sign in with Google" button (UI only).
- Implemented form submission handling to call the authentication API.
- Set up AuthContext to manage user state globally, storing the JWT token in localStorage and redirecting to `/dashboard` upon successful authentication.

---

**Feature:** Story 1.4: Google OAuth Integration
**Date Completed:** 12/01/2025
**Key Files Created/Modified:**

- `server/config/passport.js` (Google OAuth Strategy setup)
- `server/routes/authRoutes.js` (Google OAuth endpoints)
- `server/server.js` (Passport middleware integration)
- `server/.env` (Google API credentials)
- `client/src/pages/Login.jsx` (Google login button)
- `client/src/pages/Register.jsx` (Google register button)
  **Implementation Notes:**
- Installed `passport` and `passport-google-oauth20` in the server.
- Configured GoogleStrategy to check for existing users by `googleId` or create new ones, setting `password: null` for Google-authenticated users.
- Added `GET /api/auth/google` to initiate the OAuth flow and `GET /api/auth/google/callback` to handle the redirect and authentication success/failure.
- Integrated `passport.initialize()` and `passport.session()` middleware in `server.js` (along with `express-session`).
- Updated `Login.jsx` and `Register.jsx` to provide functional "Sign in with Google" buttons that redirect to the backend OAuth endpoint.

---

### Template for Future Entries:

**Feature:** [Name]
**Date Completed:** [Date]
**Key Files Created/Modified:**

- `file_path.js`
  **Implementation Notes:**
- [Specific logic used]
- [Environment variables added]
