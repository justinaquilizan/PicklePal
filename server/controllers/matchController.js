const Match = require("../models/Match");

// @desc    Get all matches for a user
// @route   GET /api/matches
// @access  Private
const getMatches = async (req, res) => {
  try {
    const matches = await Match.find({ user: req.user.id }).sort({ date: -1 });
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new match
// @route   POST /api/matches
// @access  Private
const createMatch = async (req, res) => {
  try {
    const { opponentName, playerScore, opponentScore } = req.body;

    // Validate input
    if (
      !opponentName ||
      playerScore === undefined ||
      opponentScore === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Determine result
    const result = playerScore > opponentScore ? "win" : "loss";

    const match = new Match({
      user: req.user.id,
      opponentName,
      playerScore,
      opponentScore,
      result,
    });

    const createdMatch = await match.save();
    res.status(201).json(createdMatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a match
// @route   DELETE /api/matches/:id
// @access  Private
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Check if match belongs to user
    if (match.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await match.deleteOne();
    res.json({ message: "Match removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getMatches,
  createMatch,
  deleteMatch,
};
