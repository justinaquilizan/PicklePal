const express = require("express");
const router = express.Router();
const passport = require("passport"); // Import passport
const {
  registerUser,
  loginUser,
  generateToken,
} = require("../controllers/authController"); // Import generateToken

router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }), // Redirect to frontend login on failure
  (req, res) => {
    // Successful authentication, generate JWT and redirect to frontend
    const user = req.user;
    const token = generateToken(user._id);
    const clientRedirectUrl = `http://localhost:5173/oauth-success?token=${token}&_id=${user._id}&username=${user.username}&email=${user.email}`;
    res.redirect(clientRedirectUrl);
  }
);

module.exports = router;
