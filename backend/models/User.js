const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Not required for Google OAuth users
  },
  role: {
    type: String,
    enum: ["user", "professional", "admin"],
    default: "user",
  },
  // Google OAuth fields
  googleId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: "",
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  // Extra fields for professional role
  specialization: {
    type: String,
    default: "",
  },
  experience: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
