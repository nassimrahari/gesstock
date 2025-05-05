// emailService.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendResetEmail = async (toEmail, token) => {
    const subject = 'Password Reset Request';
    const message = `Please use the following link to reset your password: ${process.env.DOMAIN}/reset-password?token=${token}`;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject,
            text: message,
        });
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = { sendResetEmail };