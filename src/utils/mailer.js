const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send confirmation email
const sendConfirmationEmail = async (newEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: "Email Change Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1D372E; margin-bottom: 5px;">Email Change Confirmation</h2>
            <p style="color: #666;">You have successfully updated your email address.</p>
          </div>
          
          <p style="color: #666; margin-bottom: 20px;">If you did not make this change, please contact support immediately.</p>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>© ${new Date().getFullYear()} Admin Panel. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to", newEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1D372E; margin-bottom: 5px;">Password Reset</h2>
            <p style="color: #666;">Use the verification code below to reset your password</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #5CAF90; margin: 0;">${otp}</h1>
          </div>
          
          <p style="color: #666; margin-bottom: 20px; text-align: center;">If you didn't request a password reset, please ignore this email.</p>
          
          <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
            <p>© ${new Date().getFullYear()} Admin Panel. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendOtpEmail,
};
