import React, { useState, useEffect } from "react";
import axios from "axios";

const MatchForm = ({
  onMatchAdded,
  onMatchUpdated,
  editingMatch,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    opponentName: "",
    playerScore: "",
    opponentScore: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { opponentName, playerScore, opponentScore } = formData;

  // Initialize form with editing match data
  useEffect(() => {
    if (editingMatch) {
      setFormData({
        opponentName: editingMatch.opponentName,
        playerScore: editingMatch.playerScore.toString(),
        opponentScore: editingMatch.opponentScore.toString(),
      });
    } else {
      setFormData({
        opponentName: "",
        playerScore: "",
        opponentScore: "",
      });
    }
  }, [editingMatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (editingMatch) {
        // Update existing match
        response = await axios.put(
          `http://localhost:5001/api/matches/${editingMatch._id}`,
          {
            opponentName,
            playerScore: parseInt(playerScore),
            opponentScore: parseInt(opponentScore),
          },
          config
        );
      } else {
        // Create new match
        response = await axios.post(
          "http://localhost:5001/api/matches",
          {
            opponentName,
            playerScore: parseInt(playerScore),
            opponentScore: parseInt(opponentScore),
          },
          config
        );
      }

      const { data } = response;

      // Reset form
      setFormData({
        opponentName: "",
        playerScore: "",
        opponentScore: "",
      });

      // Notify parent component
      if (editingMatch && onMatchUpdated) {
        onMatchUpdated(data);
      } else if (!editingMatch && onMatchAdded) {
        onMatchAdded(data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `An error occurred while ${
            editingMatch ? "updating" : "adding"
          } the match`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Opponent Name - Full Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opponent Name
        </label>
        <input
          type="text"
          name="opponentName"
          value={opponentName}
          onChange={onChange}
          className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
          placeholder="e.g. Justin"
          required
          autoComplete="off"
          autoCapitalize="words"
        />
      </div>

      {/* Score Inputs - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            You
          </label>
          <input
            type="number"
            name="playerScore"
            value={playerScore}
            onChange={onChange}
            className="w-full h-14 text-center text-2xl font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
            placeholder="0"
            min="0"
            max="50"
            required
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Opponent
          </label>
          <input
            type="number"
            name="opponentScore"
            value={opponentScore}
            onChange={onChange}
            className="w-full h-14 text-center text-2xl font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition-all placeholder:text-gray-400"
            placeholder="0"
            min="0"
            max="50"
            required
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Submit Button - Full Width */}
      <div className="flex gap-3">
        {editingMatch && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3.5 px-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-95 text-base">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3.5 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 disabled:scale-100 disabled:cursor-not-allowed text-base">
          {loading
            ? editingMatch
              ? "Updating..."
              : "Adding..."
            : editingMatch
            ? "Update Match"
            : "Log Match"}
        </button>
      </div>
    </form>
  );
};

export default MatchForm;
