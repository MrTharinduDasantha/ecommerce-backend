const nodemailer = require("nodemailer");
require('dotenv').config();

const sendConfirmationEmail = async (newEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: 'Email Change Confirmation',
      text: 'You have successfully updated your email address.',
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to', newEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendConfirmationEmail;