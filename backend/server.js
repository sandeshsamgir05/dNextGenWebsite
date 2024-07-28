require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Contact form submission endpoint
app.post('/send', (req, res) => {
    const { name, email, phone, project, subject, message } = req.body;

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Sender email address from .env file
            pass: process.env.EMAIL_PASS  // Sender email password from .env file
        }
    });

    // Email options
    const mailOptions = {
        from: email, // User's email address from the form
        to: process.env.EMAIL_USER, // Your receiving email address from .env file
        subject: `New Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject: ${project}\nMessage: ${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ message: 'Error sending email: ' + error.message });
        }
        res.status(200).send({ message: 'Email sent successfully!' });
    });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
