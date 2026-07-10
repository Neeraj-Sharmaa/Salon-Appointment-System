const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const OTP = require("../models/OTP");
const { sendWelcomeEmail, sendOtpEmail } = require("../utils/emailService");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "salon_jwt_secret_key_123",
    { expiresIn: "30d" }
  );
};

// @desc    Register a new user (User/Professional/Admin)
// @route   POST /auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, experience, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "Please enter all required fields including verification code" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Verify OTP code
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      specialization: role === "professional" ? specialization : "",
      experience: role === "professional" ? experience : 0,
    });

    if (user) {
      // Delete used OTP record
      await OTP.deleteOne({ _id: otpRecord._id });

      // Send welcome email asynchronously
      sendWelcomeEmail(user.email, user.name).catch(err => {
        console.error("Failed to send welcome email:", err);
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        experience: user.experience,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all professionals (useful for user booking & admin dashboards)
// @route   GET /auth/professionals
// @access  Public/Private
const getProfessionals = async (req, res) => {
  try {
    const professionals = await User.find({ role: "professional" }).select("-password");
    res.json(professionals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin view)
// @route   GET /auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Sign In / Sign Up
// @route   POST /auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { credential, isMock, profile, role } = req.body;

    let googleId, email, name, picture;

    if (isMock || !process.env.GOOGLE_CLIENT_ID || credential?.startsWith("mock_")) {
      // Mock flow or missing Client ID fallback
      const data = profile || {};
      email = data.email || "testgoogle@gmail.com";
      name = data.name || "Test Google User";
      googleId = data.googleId || "mock_google_123456789";
      picture = data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
    } else {
      // Real Google verification
      if (!credential) {
        return res.status(400).json({ message: "Google credential is required" });
      }

      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        googleId = payload.sub;
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
      } catch (err) {
        console.error("google-auth-library verification failed, trying fetch fallback:", err.message);
        // Fallback fetch verification
        const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!googleResponse.ok) {
          return res.status(400).json({ message: "Google token verification failed" });
        }
        const payload = await googleResponse.json();
        googleId = payload.sub;
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
      }
    }

    // Check if user already exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Google fields if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        if (picture) user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user from Google data
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture || "",
        authProvider: "google",
        role: role || "user", // Support custom role on signup
      });

      // Send welcome email asynchronously
      sendWelcomeEmail(user.email, user.name).catch(err => {
        console.error("Failed to send welcome email:", err);
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      experience: user.experience,
      avatar: user.avatar,
      authProvider: user.authProvider,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate and send OTP for email verification
// @route   POST /auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Please provide email and name" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in database (overwrite previous OTPs for this email)
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send OTP email
    const emailResult = await sendOtpEmail(email, name, otp);

    if (emailResult.success) {
      res.status(200).json({ message: "Verification OTP code sent to your email" });
    } else {
      console.error("Failed to send OTP email via Brevo:", emailResult.error);
      res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getProfessionals,
  getAllUsers,
  googleLogin,
  sendOTP,
};
