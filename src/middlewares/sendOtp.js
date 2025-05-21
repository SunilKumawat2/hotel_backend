const nodemailer = require("nodemailer");
const User = require("../models/users");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to user's email for either registration or forgot password.
 * 
 * @param {string} email - User's email
 * @param {string} first_name - User's first name
 * @param {string} type - 'register' or 'forgotpassword'
 */
const sendOtp = async (email, first_name, type) => {
  const otp = generateOTP();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // or try 587
    secure: true, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Hello ${first_name},\n\nYour OTP code is: ${otp}\n\nThis code is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP ${otp} sent to ${email}`);

  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Update the user record with OTP and type (either 'register' or 'forgotpassword')
  await User.findOneAndUpdate(
    { email },
    {
      otp: otp,
      type: type,  // type could be 'register' or 'forgotpassword'
      otp_expiry: expiry,
    }
  );

  return otp;
};

module.exports = sendOtp;
