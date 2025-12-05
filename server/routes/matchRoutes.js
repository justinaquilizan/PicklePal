const express = require("express");
const router = express.Router();
const {
  getMatches,
  createMatch,
  deleteMatch,
} = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getMatches).post(protect, createMatch);
router.route("/:id").delete(protect, deleteMatch);

module.exports = router;
