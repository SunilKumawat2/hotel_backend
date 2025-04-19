const nodemailer = require("nodemailer");
const User = require("../models/users");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (email, first_name) => {
  const otp = generateOTP();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
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

  await User.findOneAndUpdate(
    { email },
    {
      otp: otp,
      type: "register",
      otp_expiry: expiry,
    }
  );

  return otp;
};

module.exports = sendOtp;
