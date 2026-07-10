const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  getProfessionals,
  getAllUsers,
  sendOTP,
} = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public routes
router.post("/signup", registerUser);
router.post("/send-otp", sendOTP);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/professionals", getProfessionals);

// Private routes
router.get("/me", protect, getUserProfile);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

module.exports = router;
