// Using CommonJS (require)
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google Public DNS

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});