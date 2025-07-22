// controllers/admin/organizations.controller.js
const Organization = require('../../models/organizations.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let otpStore = {}; // In-memory store for OTP (replace with Redis or DB in production)

const signupUser = async (req, res) => {
  const { email, name, phone, address, website } = req.body;
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = otp;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Sign Up',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp, name, phone, address, website } = req.body;
  try {
    if (otpStore[email] === otp) {
      delete otpStore[email]; // Clear OTP after verification
      res.status(200).json({ message: 'OTP verified' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Invalid OTP', error: error.message });
  }
};

const saveOrganization = async (req, res) => {
  const { email, name, phone, address, website } = req.body;
  try {
    const existingOrg = await Organization.findOne({ where: { email } });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization with this email already exists' });
    }
    await Organization.create({
      email,
      name,
      phone,
      address,
      website,
      status: 'active',
    });
    res.status(200).json({ message: 'Organization saved successfully' });
  } catch (error) {
    console.error('Save organization error:', error);
    res.status(500).json({ message: 'Failed to save organization', error: error.message });
  }
};

module.exports = { signupUser, verifyOtp, saveOrganization };