import React, { useState } from "react";
import axios from "axios";

const MatchForm = ({ onMatchAdded }) => {
  const [formData, setFormData] = useState({
    opponentName: "",
    playerScore: "",
    opponentScore: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { opponentName, playerScore, opponentScore } = formData;

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

      const { data } = await axios.post(
        "http://localhost:5001/api/matches",
        {
          opponentName,
          playerScore: parseInt(playerScore),
          opponentScore: parseInt(opponentScore),
        },
        config
      );

      // Reset form
      setFormData({
        opponentName: "",
        playerScore: "",
        opponentScore: "",
      });

      // Notify parent component
      if (onMatchAdded) {
        onMatchAdded(data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while adding the match"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add New Match
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Opponent Name
            </label>
            <input
              type="text"
              name="opponentName"
              value={opponentName}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter opponent name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Score
            </label>
            <input
              type="number"
              name="playerScore"
              value={playerScore}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Your score"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Opponent Score
            </label>
            <input
              type="number"
              name="opponentScore"
              value={opponentScore}
              onChange={onChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Opponent score"
              min="0"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Adding..." : "Add Match"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MatchForm;
