const https = require("https");

/**
 * Send an email using Brevo transactional email API.
 * @param {Object} options - Email options
 * @param {string|Array} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlContent - Email body in HTML format
 */
const sendEmail = async ({ to, subject, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "neerudevgan13@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Salon Appointment System";

  if (!apiKey) {
    console.error("Brevo API key is not configured in .env");
    return { success: false, error: "API key missing" };
  }

  const recipients = Array.isArray(to) 
    ? to.map(email => ({ email })) 
    : [{ email: to }];

  const data = JSON.stringify({
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: recipients,
    subject,
    htmlContent
  });

  const requestOptions = {
    hostname: "api.brevo.com",
    port: 443,
    path: "/v3/smtp/email",
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Content-Length": Buffer.byteLength(data)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(requestOptions, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ success: true, data: JSON.parse(responseBody) });
          } catch (e) {
            resolve({ success: true, data: responseBody });
          }
        } else {
          console.error("Brevo API Error Response:", responseBody);
          resolve({ success: false, statusCode: res.statusCode, error: responseBody });
        }
      });
    });

    req.on("error", (error) => {
      console.error("Request to Brevo failed:", error);
      resolve({ success: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
};

// Common Layout Wrapper for Emails
const getEmailWrapper = (content, senderEmail = "neerudevgan13@gmail.com") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salon Appointment System</title>
  <style>
    body {
      font-family: 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #333333;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f6f8;
      padding: 30px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    .header {
      background: linear-gradient(135deg, #1e1e2f 0%, #2a2a40 100%);
      padding: 35px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #d4af37; /* Warm Gold */
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.8;
      color: #ffffff;
    }
    .content {
      padding: 30px 25px;
      line-height: 1.6;
    }
    .content h2 {
      font-size: 20px;
      margin-top: 0;
      color: #1e1e2f;
    }
    .footer {
      background-color: #fcfcfd;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #888888;
      border-top: 1px solid #f0f0f2;
    }
    .footer a {
      color: #1e1e2f;
      text-decoration: none;
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background: linear-gradient(135deg, #d4af37 0%, #b8972f 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 30px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
      box-shadow: 0 4px 10px rgba(212,175,55,0.3);
    }
    .card {
      background-color: #fafbfc;
      border: 1px solid #eaedf0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .card-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      border-bottom: 1px dashed #eaedf0;
      padding-bottom: 10px;
    }
    .card-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    .label {
      font-weight: 600;
      color: #555555;
    }
    .value {
      color: #111111;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .badge-pending {
      background-color: #fef3c7;
      color: #d97706;
    }
    .badge-confirmed {
      background-color: #d1fae5;
      color: #059669;
    }
    .badge-cancelled {
      background-color: #fee2e2;
      color: #dc2626;
    }
    .badge-completed {
      background-color: #e0e7ff;
      color: #4f46e5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>✨ Salon Appointment System ✨</h1>
        <p>Premium Hair & Beauty Care</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Salon Appointment System. All rights reserved.<br>
        If you have any questions, feel free to contact us at <a href="mailto:${senderEmail}">${senderEmail}</a>.
      </div>
    </div>
  </div>
</body>
</html>
`;

// Helper: Format Date nicely
const formatDate = (dateStr) => {
  try {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateStr;
  }
};

// Send Welcome Email
const sendWelcomeEmail = async (userEmail, userName) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "neerudevgan13@gmail.com";
  const content = `
    <h2>Welcome to the Family, ${userName}!</h2>
    <p>We are absolutely thrilled to welcome you to the <strong>Salon Appointment System</strong>. Your account has been successfully created.</p>
    <p>Now you can easily browse our expert stylists, book appointments, and track your beauty schedule online anytime, anywhere.</p>
    <div style="text-align: center;">
      <a href="http://localhost:5173/login" class="btn">Access Your Dashboard</a>
    </div>
    <p>If you need any styling consultation or assistance with bookings, don't hesitate to reach out to us!</p>
  `;
  return sendEmail({
    to: userEmail,
    subject: "Welcome to Salon Appointment System! ✨",
    htmlContent: getEmailWrapper(content, senderEmail)
  });
};

// Send Appointment Creation Confirmation (Client Copy)
const sendAppointmentCreatedEmail = async (appointment) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "neerudevgan13@gmail.com";
  const badgeClass = "badge-pending";
  const content = `
    <h2>Appointment Booking Request Received!</h2>
    <p>Thank you, <strong>${appointment.name}</strong>. We have received your appointment request and it is currently pending confirmation from our team.</p>
    <div class="card">
      <div class="card-row">
        <span class="label">Service</span>
        <span class="value">${appointment.service}</span>
      </div>
      <div class="card-row">
        <span class="label">Date</span>
        <span class="value">${formatDate(appointment.date)}</span>
      </div>
      <div class="card-row">
        <span class="label">Time Slot</span>
        <span class="value">${appointment.time}</span>
      </div>
      <div class="card-row">
        <span class="label">Status</span>
        <span class="value"><span class="badge ${badgeClass}">Pending Confirmation</span></span>
      </div>
      ${appointment.message ? `
      <div class="card-row">
        <span class="label">Special Request</span>
        <span class="value">${appointment.message}</span>
      </div>` : ""}
    </div>
    <p>We will send you another email as soon as your booking is confirmed or a stylist is assigned. We look forward to pampering you!</p>
  `;
  return sendEmail({
    to: appointment.email,
    subject: "Appointment Request Received - Salon Appointment System",
    htmlContent: getEmailWrapper(content, senderEmail)
  });
};

// Send Appointment Notification (Admin Copy)
const sendAdminNotificationEmail = async (appointment) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "neerudevgan13@gmail.com";
  const content = `
    <h2>🔔 New Appointment Alert!</h2>
    <p>A new appointment has been scheduled through the portal.</p>
    <div class="card">
      <div class="card-row">
        <span class="label">Client Name</span>
        <span class="value">${appointment.name}</span>
      </div>
      <div class="card-row">
        <span class="label">Client Email</span>
        <span class="value">${appointment.email}</span>
      </div>
      <div class="card-row">
        <span class="label">Phone</span>
        <span class="value">${appointment.phone || "N/A"}</span>
      </div>
      <div class="card-row">
        <span class="label">Service</span>
        <span class="value">${appointment.service}</span>
      </div>
      <div class="card-row">
        <span class="label">Date</span>
        <span class="value">${formatDate(appointment.date)}</span>
      </div>
      <div class="card-row">
        <span class="label">Time</span>
        <span class="value">${appointment.time}</span>
      </div>
    </div>
    <div style="text-align: center;">
      <a href="http://localhost:5173/login" class="btn">Manage Appointment</a>
    </div>
  `;
  return sendEmail({
    to: senderEmail,
    subject: `New Appointment: ${appointment.service} - ${appointment.name}`,
    htmlContent: getEmailWrapper(content, senderEmail)
  });
};

// Send Status Update Email
const sendStatusUpdateEmail = async (appointment) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "neerudevgan13@gmail.com";
  let statusText = "Pending";
  let badgeClass = "badge-pending";
  let statusDescription = "Your appointment request is being reviewed.";

  if (appointment.status === "confirmed") {
    statusText = "Confirmed";
    badgeClass = "badge-confirmed";
    statusDescription = "Great news! Your salon appointment has been confirmed. Get ready to shine!";
  } else if (appointment.status === "cancelled") {
    statusText = "Cancelled";
    badgeClass = "badge-cancelled";
    statusDescription = "We regret to inform you that your appointment has been cancelled. Please reach out to us if you need to reschedule.";
  } else if (appointment.status === "completed") {
    statusText = "Completed";
    badgeClass = "badge-completed";
    statusDescription = "Thank you for choosing our salon! We hope you loved your service. We look forward to seeing you again soon!";
  }

  const content = `
    <h2>Appointment Update</h2>
    <p>Hello <strong>${appointment.name}</strong>,</p>
    <p>${statusDescription}</p>
    <div class="card">
      <div class="card-row">
        <span class="label">Service</span>
        <span class="value">${appointment.service}</span>
      </div>
      <div class="card-row">
        <span class="label">Date</span>
        <span class="value">${formatDate(appointment.date)}</span>
      </div>
      <div class="card-row">
        <span class="label">Time Slot</span>
        <span class="value">${appointment.time}</span>
      </div>
      <div class="card-row">
        <span class="label">Status</span>
        <span class="value"><span class="badge ${badgeClass}">${statusText}</span></span>
      </div>
    </div>
  `;

  return sendEmail({
    to: appointment.email,
    subject: `Appointment Status Updated: ${statusText} - Salon Appointment System`,
    htmlContent: getEmailWrapper(content, senderEmail)
  });
};

// Send Stylist Assigned Email (Client Copy)
const sendStylistAssignedEmail = async (appointment, professional) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "neerudevgan13@gmail.com";
  const content = `
    <h2>Stylist Assigned to Your Appointment!</h2>
    <p>Hello <strong>${appointment.name}</strong>, we have assigned one of our expert stylists to your appointment.</p>
    
    <div class="card" style="border-left: 4px solid #d4af37;">
      <h3>Your Stylist</h3>
      <p><strong>Name:</strong> ${professional.name}</p>
      ${professional.specialization ? `<p><strong>Specialization:</strong> ${professional.specialization}</p>` : ""}
    </div>

    <div class="card">
      <h3>Appointment Details</h3>
      <div class="card-row">
        <span class="label">Service</span>
        <span class="value">${appointment.service}</span>
      </div>
      <div class="card-row">
        <span class="label">Date</span>
        <span class="value">${formatDate(appointment.date)}</span>
      </div>
      <div class="card-row">
        <span class="label">Time Slot</span>
        <span class="value">${appointment.time}</span>
      </div>
    </div>
  `;
  return sendEmail({
    to: appointment.email,
    subject: "Stylist Assigned for Your Appointment - Salon Appointment System",
    htmlContent: getEmailWrapper(content, senderEmail)
  });
};

// Send Stylist Job Notification (Stylist Copy)
const sendStylistNotificationEmail = async (appointment, professional) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "neerudevgan13@gmail.com";
  const content = `
    <h2>📅 New Appointment Assignment</h2>
    <p>Hello <strong>${professional.name}</strong>,</p>
    <p>You have been assigned to serve a client. Here are the booking details:</p>
    <div class="card">
      <div class="card-row">
        <span class="label">Client Name</span>
        <span class="value">${appointment.name}</span>
      </div>
      <div class="card-row">
        <span class="label">Client Email</span>
        <span class="value">${appointment.email}</span>
      </div>
      <div class="card-row">
        <span class="label">Phone</span>
        <span class="value">${appointment.phone || "N/A"}</span>
      </div>
      <div class="card-row">
        <span class="label">Service</span>
        <span class="value">${appointment.service}</span>
      </div>
      <div class="card-row">
        <span class="label">Date</span>
        <span class="value">${formatDate(appointment.date)}</span>
      </div>
      <div class="card-row">
        <span class="label">Time</span>
        <span class="value">${appointment.time}</span>
      </div>
      ${appointment.message ? `
      <div class="card-row">
        <span class="label">Client Request</span>
        <span class="value">${appointment.message}</span>
      </div>` : ""}
    </div>
  `;
  return sendEmail({
    to: professional.email,
    subject: `New Assignment: ${appointment.service} on ${formatDate(appointment.date)}`,
    htmlContent: getEmailWrapper(content, senderEmail)
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendAppointmentCreatedEmail,
  sendAdminNotificationEmail,
  sendStatusUpdateEmail,
  sendStylistAssignedEmail,
  sendStylistNotificationEmail
};
