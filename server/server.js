const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
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
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));

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
  console.error("Server Error:", err);
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
  socket.on("join_match", (data) => {
    const { matchId, userId } = data;
    console.log(
      `Client ${socket.id} (user ${userId}) attempting to join match room: ${matchId}`
    );

    // Check if match exists or create new one
    if (!activeMatches.has(matchId)) {
      activeMatches.set(matchId, {
        createdAt: new Date(),
        players: [{ socketId: socket.id, userId, isPlayer1: true }],
        scores: { player1: 0, player2: 0 },
      });
      console.log(`Created new match room: ${matchId}`);
    } else {
      // Add player to existing match
      const match = activeMatches.get(matchId);
      if (match.players.length < 2) {
        match.players.push({ socketId: socket.id, userId, isPlayer1: false });
        console.log(`Added player 2 to existing match room: ${matchId}`);
      } else {
        socket.emit("error", { message: "Match room is full" });
        return;
      }
    }

    socket.join(matchId);

    // Notify client about successful join with player role
    const match = activeMatches.get(matchId);
    const currentPlayer = match.players.find((p) => p.socketId === socket.id);
    socket.emit("match_joined", {
      matchId,
      playerCount: match.players.length,
      isPlayer1: currentPlayer.isPlayer1,
      scores: match.scores,
    });
  });

  // Handle score updates
  socket.on("update_score", (data) => {
    const { matchId, player, score } = data;

    // Validate that match exists
    if (!activeMatches.has(matchId)) {
      socket.emit("error", { message: "Match room not found" });
      return;
    }

    const match = activeMatches.get(matchId);
    const currentPlayer = match.players.find((p) => p.socketId === socket.id);

    if (!currentPlayer) {
      socket.emit("error", { message: "You are not in this match" });
      return;
    }

    // Update the correct score based on which player is updating
    if (currentPlayer.isPlayer1) {
      if (player === "player1") {
        match.scores.player1 = Math.max(0, score);
      } else if (player === "player2" && match.players.length === 2) {
        match.scores.player2 = Math.max(0, score);
      }
    } else {
      if (player === "player2") {
        match.scores.player2 = Math.max(0, score);
      } else if (player === "player1" && match.players.length === 2) {
        match.scores.player1 = Math.max(0, score);
      }
    }

    console.log(
      `Score update for match ${matchId}: Player 1: ${match.scores.player1}, Player 2: ${match.scores.player2}`
    );

    // Broadcast to all clients in the match room with role information
    io.to(matchId).emit("score_updated", {
      scores: match.scores,
      isPlayer1: currentPlayer.isPlayer1,
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    // Remove player from all matches
    activeMatches.forEach((match, matchId) => {
      match.players = match.players.filter((p) => p.socketId !== socket.id);

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
