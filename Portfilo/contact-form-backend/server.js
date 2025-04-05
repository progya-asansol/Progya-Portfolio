require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
    },
});

// Test Email Configuration
transporter.verify((error) => {
    if (error) {
        console.error("Error verifying transporter:", error);
    } else {
        console.log("Server is ready to send emails");
    }
});

app.post("/send", (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All required fields must be filled." });
    }

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // Your Email
        subject: "New Contact Form Submission",
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);  // Log the error in the console
            return res.status(500).json({ error: error.message });
        }
        console.log("Email sent:", info.response); // Log success
        res.json({ success: "Email sent successfully!" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});