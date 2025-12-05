const mongoose = require("mongoose");

const matchSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    opponentName: {
      type: String,
      required: true,
    },
    playerScore: {
      type: Number,
      required: true,
      min: 0,
    },
    opponentScore: {
      type: Number,
      required: true,
      min: 0,
    },
    result: {
      type: String,
      required: true,
      enum: ["win", "loss", "tie"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
