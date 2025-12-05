import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MatchForm from "../components/MatchForm";
import FloatingActionButton from "../components/FloatingActionButton";
import Modal from "../components/Modal";

const Dashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!auth.token) {
      navigate("/login");
      return;
    }
    fetchMatches();
  }, [auth.token, navigate]);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5001/api/matches",
        config
      );
      setMatches(data);
    } catch (err) {
      setError("Failed to fetch matches");
      console.error("Error fetching matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchAdded = (newMatch) => {
    setMatches([newMatch, ...matches]);
    setIsModalOpen(false);
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(
          `http://localhost:5001/api/matches/${matchId}`,
          config
        );
        setMatches(matches.filter((match) => match._id !== matchId));
      } catch (err) {
        setError("Failed to delete match");
        console.error("Error deleting match:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate statistics
  const totalMatches = matches.length;
  const wins = matches.filter((m) => m.result === "win").length;
  const losses = matches.filter((m) => m.result === "loss").length;
  const winRate =
    totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            Dashboard
          </h1>
          {auth.user && (
            <p className="text-xl text-gray-600">
              Welcome back,{" "}
              <span className="font-semibold text-gray-900">
                {auth.user.username}
              </span>
              ! 👋
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Statistics Grid */}
        {totalMatches > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🏓</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">TT</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalMatches}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Total Matches
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🏆</span>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">W</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600">{wins}</div>
              <div className="text-sm text-gray-600 font-medium">Wins</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">💔</span>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">L</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-red-600">{losses}</div>
              <div className="text-sm text-gray-600 font-medium">Losses</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📊</span>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {winRate}%
              </div>
              <div className="text-sm text-gray-600 font-medium">Win Rate</div>
            </div>
          </div>
        )}

        {/* Match History */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Match History
            </h2>
            {matches.length > 0 && (
              <span className="text-sm text-gray-500 font-medium">
                {matches.length} {matches.length === 1 ? "match" : "matches"}
              </span>
            )}
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No matches yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start tracking your pickleball journey by adding your first
                match!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all">
                Add Your First Match
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match._id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    {/* Result Pill */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        match.result === "win"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      {match.result === "win" ? "Win" : "Loss"}
                    </div>

                    {/* Match Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        vs. {match.opponentName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(match.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className="text-2xl font-bold text-gray-900">
                      {match.playerScore} - {match.opponentScore}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMatch(match._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                      title="Delete match">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsModalOpen(true)}
        icon="+"
        label="Add Match"
      />

      {/* Add Match Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Match">
        <MatchForm onMatchAdded={handleMatchAdded} />
      </Modal>
    </div>
  );
};

export default Dashboard;
