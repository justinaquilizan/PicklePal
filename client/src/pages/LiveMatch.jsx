import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import io from "socket.io-client";
import axios from "axios";

const LiveMatch = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [matchData, setMatchData] = useState({
    opponentName: "",
    playerScore: 0,
    opponentScore: 0,
    isServing: true,
  });

  const [matchCode, setMatchCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [matchStarted, setMatchStarted] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [matchJoined, setMatchJoined] = useState(false);
  const [isPlayer1, setIsPlayer1] = useState(true); // Track if current user is player 1

  // Generate a random 6-character match code
  const generateMatchCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  useEffect(() => {
    if (!auth.token) {
      navigate("/login");
      return;
    }

    // Initialize socket connection
    socketRef.current = io("http://localhost:5001", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
      setMatchJoined(false);
    });

    // Listen for successful match join
    socketRef.current.on("match_joined", (data) => {
      console.log("Successfully joined match:", data);
      setMatchJoined(true);
      setIsPlayer1(data.isPlayer1);
      setError("");

      // Initialize scores from server
      if (data.scores) {
        setMatchData((prev) => ({
          ...prev,
          playerScore: data.isPlayer1
            ? data.scores.player1
            : data.scores.player2,
          opponentScore: data.isPlayer1
            ? data.scores.player2
            : data.scores.player1,
        }));
      }
    });

    // Listen for server errors
    socketRef.current.on("error", (data) => {
      console.error("Server error:", data);
      setError(data.message || "An error occurred");
      setMatchJoined(false);
    });

    // Listen for score updates from other clients
    socketRef.current.on("score_updated", (data) => {
      console.log("Received score update:", data);
      setMatchData((prev) => {
        // Map server scores to client perspective based on player role
        const myScore = isPlayer1 ? data.scores.player1 : data.scores.player2;
        const opponentScore = isPlayer1
          ? data.scores.player2
          : data.scores.player1;

        return {
          ...prev,
          playerScore: myScore,
          opponentScore: opponentScore,
        };
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [auth.token, navigate, isPlayer1]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "joinCode") {
      setJoinCode(value.toUpperCase());
    } else {
      setMatchData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const createNewMatch = () => {
    const newCode = generateMatchCode();
    setMatchCode(newCode);
    setMatchJoined(false);

    // Join the match room with the generated code
    if (socketRef.current && connected) {
      socketRef.current.emit("join_match", {
        matchId: newCode,
        userId: auth.user?.id || "unknown",
      });
    }
  };

  const joinExistingMatch = async () => {
    if (!joinCode.trim()) {
      setError("Please enter a match code");
      return;
    }

    setCheckingCode(true);
    setError("");

    try {
      // Check if match exists on server
      const response = await fetch(
        `http://localhost:5001/api/matches/check/${joinCode}`
      );
      const data = await response.json();

      if (!data.exists) {
        setError("Match code not found. Please check the code and try again.");
        setCheckingCode(false);
        return;
      }

      // Match exists, join it
      setMatchCode(joinCode);
      setMatchJoined(false);

      if (socketRef.current && connected) {
        socketRef.current.emit("join_match", {
          matchId: joinCode,
          userId: auth.user?.id || "unknown",
        });
      }
    } catch (err) {
      console.error("Error checking match code:", err);
      setError("Failed to validate match code. Please try again.");
    } finally {
      setCheckingCode(false);
    }
  };

  const startMatch = () => {
    if (!matchData.opponentName.trim()) {
      setError("Please enter opponent name");
      return;
    }

    if (!matchJoined) {
      setError("Please wait for the match to be properly connected");
      return;
    }

    setMatchStarted(true);
    setError("");
  };

  const updateScore = (player, increment) => {
    if (!matchCode) {
      setError("No match code available");
      return;
    }

    // Determine which player score to update based on current user's role
    const serverPlayer = isPlayer1
      ? player === "player"
        ? "player1"
        : "player2"
      : player === "player"
      ? "player2"
      : "player1";

    const currentScore =
      player === "player" ? matchData.playerScore : matchData.opponentScore;
    const newScore = Math.max(0, currentScore + increment);

    // Update local state optimistically
    const newMatchData = { ...matchData };
    if (player === "player") {
      newMatchData.playerScore = newScore;
    } else {
      newMatchData.opponentScore = newScore;
    }
    setMatchData(newMatchData);

    // Emit score update to server
    if (socketRef.current && connected) {
      socketRef.current.emit("update_score", {
        matchId: matchCode,
        player: serverPlayer,
        score: newScore,
      });
    }
  };

  const resetMatch = () => {
    if (!matchCode) {
      setError("No match code available");
      return;
    }

    const newMatchData = {
      ...matchData,
      playerScore: 0,
      opponentScore: 0,
    };
    setMatchData(newMatchData);

    if (socketRef.current && connected) {
      // Reset both scores on server
      socketRef.current.emit("update_score", {
        matchId: matchCode,
        player: isPlayer1 ? "player1" : "player2",
        score: 0,
      });

      // Also reset opponent score if match has 2 players
      if (matchJoined) {
        socketRef.current.emit("update_score", {
          matchId: matchCode,
          player: isPlayer1 ? "player2" : "player1",
          score: 0,
        });
      }
    }
  };

  const saveMatch = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        "http://localhost:5001/api/matches",
        {
          opponentName: matchData.opponentName,
          playerScore: matchData.playerScore,
          opponentScore: matchData.opponentScore,
        },
        config
      );

      alert("Match saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save match");
      console.error("Error saving match:", err);
    }
  };

  const determineWinner = () => {
    if (matchData.playerScore >= 11 || matchData.opponentScore >= 11) {
      if (matchData.playerScore > matchData.opponentScore) {
        return "You Win! 🎉";
      } else if (matchData.opponentScore > matchData.playerScore) {
        return "Opponent Wins";
      } else {
        return "Tied Game";
      }
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Live Match Scoreboard
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}></div>
            <span className="text-sm text-gray-600">
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!matchStarted ? (
          /* Match Code Setup */
          <div className="space-y-6">
            {!matchCode ? (
              /* Create or Join Match */
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Start or Join a Live Match
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Create New Match */}
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Create New Match
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Generate a code to share with your opponent
                    </p>
                    <button
                      onClick={createNewMatch}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline">
                      Create Match
                    </button>
                  </div>

                  {/* Join Existing Match */}
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Join Existing Match
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Enter the code from your opponent
                    </p>
                    <input
                      type="text"
                      name="joinCode"
                      value={joinCode}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 text-center text-lg font-mono"
                      placeholder="Enter match code"
                      maxLength={6}
                    />
                    <button
                      onClick={joinExistingMatch}
                      disabled={checkingCode}
                      className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline disabled:cursor-not-allowed">
                      {checkingCode ? "Checking..." : "Join Match"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Match Setup with Code */
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                  <div className="inline-block bg-green-100 border-2 border-green-300 rounded-lg px-6 py-3">
                    <p className="text-sm text-green-600 font-medium">
                      Match Code
                    </p>
                    <p className="text-2xl font-bold text-green-800 font-mono">
                      {matchCode}
                    </p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          matchJoined ? "bg-green-500" : "bg-yellow-500"
                        }`}></div>
                      <span className="text-sm text-gray-600">
                        {matchJoined
                          ? "Connected to match"
                          : "Connecting to match..."}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Share this code with your opponent
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Opponent Name
                  </label>
                  <input
                    type="text"
                    name="opponentName"
                    value={matchData.opponentName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter opponent name"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={startMatch}
                    disabled={!matchJoined}
                    className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:cursor-not-allowed">
                    {matchJoined ? "Start Match" : "Connecting..."}
                  </button>
                  <button
                    onClick={() => {
                      setMatchCode("");
                      setJoinCode("");
                      setMatchJoined(false);
                      setIsPlayer1(true); // Reset to default
                    }}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Live Scoreboard */
          <div className="space-y-6">
            {/* Match Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="mb-4">
                  <div className="inline-block bg-blue-100 border border-blue-300 rounded-lg px-4 py-2">
                    <p className="text-xs text-blue-600 font-medium">
                      Match Code
                    </p>
                    <p className="text-lg font-bold text-blue-800 font-mono">
                      {matchCode}
                    </p>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {matchData.opponentName || "Opponent"}
                </h2>
                <p className="text-gray-600">vs You</p>
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid grid-cols-2 gap-8 text-center">
                {/* Player Score */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    You
                  </h3>
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {matchData.playerScore}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateScore("player", 1)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      +1 Point
                    </button>
                    <button
                      onClick={() => updateScore("player", -1)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      -1 Point
                    </button>
                  </div>
                </div>

                {/* Opponent Score */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    {matchData.opponentName || "Opponent"}
                  </h3>
                  <div className="text-6xl font-bold text-red-600 mb-4">
                    {matchData.opponentScore}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateScore("opponent", 1)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      +1 Point
                    </button>
                    <button
                      onClick={() => updateScore("opponent", -1)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      -1 Point
                    </button>
                  </div>
                </div>
              </div>

              {/* Winner Display */}
              {(matchData.playerScore >= 11 ||
                matchData.opponentScore >= 11) && (
                <div className="mt-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    {determineWinner()}
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={resetMatch}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Reset Match
                </button>
                <button
                  onClick={saveMatch}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Save Match
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                📱 Live Scoring Instructions
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • Create a new match to generate a unique 6-character code
                </li>
                <li>• Share the match code with your opponent</li>
                <li>
                  • Your opponent joins using the same code (validated before
                  joining)
                </li>
                <li>
                  • Wait for the connection status to show "Connected to match"
                </li>
                <li>• Click the +1/-1 buttons to update scores</li>
                <li>
                  • Changes sync instantly between devices with the same code
                </li>
                <li>• First to 11 points wins (must win by 2)</li>
                <li>
                  • Save the match when finished to add it to your history
                </li>
              </ul>
              <div className="mt-3 p-3 bg-yellow-100 rounded text-sm text-yellow-800">
                <strong>💡 Tip:</strong> Match codes are validated before
                joining. Only existing matches can be joined!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatch;
