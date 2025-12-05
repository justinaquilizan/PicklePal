const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
// const cors = require("cors"); // We are replacing this with manual middleware
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");

require("./config/passport");

connectDB();

const app = express();

// ==========================================
// FIX: MANUAL CORS MIDDLEWARE
// ==========================================
// This bypasses the 'cors' package and 'path-to-regexp' issues entirely.
app.use((req, res, next) => {
  // 1. Allow your frontend origin
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");

  // 2. Allow credentials (cookies/sessions)
  res.header("Access-Control-Allow-Credentials", "true");

  // 3. Allow specific HTTP methods
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  // 4. Allow specific headers (including your custom x-auth-token)
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );

  // 5. Handle the "Preflight" (OPTIONS) request immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Send OK immediately for preflight
  }

  next(); // Continue to other routes for GET/POST/etc.
});

console.log("Manual CORS middleware configured for: http://localhost:5173");

app.use(express.json());

// Passport middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using https
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err); // Log the error to terminal
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
