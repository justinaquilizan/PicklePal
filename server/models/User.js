const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Made optional for Google OAuth users
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to not violate unique constraint
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Google users don't have passwords, so they can't match passwords
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  // Only hash password if it's modified and exists
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Mongoose will catch this automatically
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
