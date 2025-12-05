const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
// const cors = require("cors"); // We are replacing this with manual middleware
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");

require("./config/passport");

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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
app.use("/api/matches", require("./routes/matchRoutes"));

// Check if match exists
app.get("/api/matches/check/:matchId", (req, res) => {
  const { matchId } = req.params;
  const exists = activeMatches.has(matchId);

  if (exists) {
    const match = activeMatches.get(matchId);
    res.json({
      exists: true,
      playerCount: match.players.length,
      createdAt: match.createdAt,
    });
  } else {
    res.json({ exists: false });
  }
});

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

// Store active match rooms
const activeMatches = new Map();

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a match room for live scoring
  socket.on("join_match", (matchId) => {
    console.log(
      `Client ${socket.id} attempting to join match room: ${matchId}`
    );

    // Check if match exists or create new one
    if (!activeMatches.has(matchId)) {
      activeMatches.set(matchId, {
        createdAt: new Date(),
        players: [socket.id],
      });
      console.log(`Created new match room: ${matchId}`);
    } else {
      // Add player to existing match
      const match = activeMatches.get(matchId);
      match.players.push(socket.id);
      console.log(`Added player to existing match room: ${matchId}`);
    }

    socket.join(matchId);

    // Notify client about successful join
    socket.emit("match_joined", {
      matchId,
      playerCount: activeMatches.get(matchId).players.length,
    });
  });

  // Handle score updates
  socket.on("update_score", (data) => {
    const { matchId, playerScore, opponentScore } = data;

    // Validate that match exists
    if (!activeMatches.has(matchId)) {
      socket.emit("error", { message: "Match room not found" });
      return;
    }

    console.log(
      `Score update for match ${matchId}: ${playerScore} - ${opponentScore}`
    );

    // Broadcast to all clients in the match room
    io.to(matchId).emit("score_updated", {
      playerScore,
      opponentScore,
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Remove player from all matches
    activeMatches.forEach((match, matchId) => {
      match.players = match.players.filter((id) => id !== socket.id);

      // Remove match if no players left
      if (match.players.length === 0) {
        activeMatches.delete(matchId);
        console.log(`Removed empty match room: ${matchId}`);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
