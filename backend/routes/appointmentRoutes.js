const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  sendAppointmentCreatedEmail,
  sendAdminNotificationEmail,
  sendStatusUpdateEmail,
  sendStylistAssignedEmail,
  sendStylistNotificationEmail
} = require("../utils/emailService");

// @desc    Get all appointments (Admin only)
// @route   GET /appointments
// @access  Private/Admin
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email phone")
      .populate("professional", "name email specialization")
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's appointments
// @route   GET /appointments/my
// @access  Private
router.get("/my", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("professional", "name email specialization")
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get professional's appointments
// @route   GET /appointments/professional
// @access  Private/Professional
router.get(
  "/professional",
  protect,
  authorizeRoles("professional", "admin"),
  async (req, res) => {
    try {
      const appointments = await Appointment.find({
        professional: req.user._id,
      })
        .populate("user", "name email phone")
        .sort({ createdAt: -1 });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @desc    Create appointment (Public or Logged in User)
// @route   POST /appointments
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, service, date, time, message, userId } = req.body;

    const appointmentData = {
      name,
      email,
      phone,
      service,
      date,
      time,
      message,
    };

    // If userId is provided, associate it
    if (userId) {
      appointmentData.user = userId;
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Trigger emails asynchronously
    sendAppointmentCreatedEmail(appointment).catch(err => {
      console.error("Failed to send client booking confirmation email:", err);
    });
    sendAdminNotificationEmail(appointment).catch(err => {
      console.error("Failed to send admin booking notification email:", err);
    });

    res.status(201).json({
      message: "Your appointment request has been received and is currently under review. We will confirm it shortly!",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update appointment status
// @route   PUT /appointments/:id/status
// @access  Private/Admin or Professional
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Professionals can only modify appointments assigned to them, Admins can modify any
    if (
      req.user.role === "professional" &&
      appointment.professional.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to update status of this appointment",
      });
    }

    appointment.status = status;
    await appointment.save();

    // Trigger status update email asynchronously
    sendStatusUpdateEmail(appointment).catch(err => {
      console.error("Failed to send status update email:", err);
    });

    res.json({ message: `Appointment status updated to ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Assign stylist to appointment (Admin only)
// @route   PUT /appointments/:id/assign
// @access  Private/Admin
router.put("/:id/assign", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { professionalId } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.professional = professionalId || null;
    await appointment.save();

    const updatedAppt = await Appointment.findById(req.params.id)
      .populate("professional", "name email specialization")
      .populate("user", "name email phone");

    // Trigger stylist assignment emails asynchronously if a stylist was assigned
    if (updatedAppt.professional) {
      sendStylistAssignedEmail(updatedAppt, updatedAppt.professional).catch(err => {
        console.error("Failed to send stylist assignment email to client:", err);
      });
      sendStylistNotificationEmail(updatedAppt, updatedAppt.professional).catch(err => {
        console.error("Failed to send job notification email to stylist:", err);
      });
    }

    res.json({ message: "Stylist assigned successfully", appointment: updatedAppt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;