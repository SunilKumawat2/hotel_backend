const sendOtp = require("../middlewares/sendOtp");
const verifyOtp = require("../middlewares/OtpVerify");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const generateToken = require("../middlewares/generateToken");

// <------ user registertion controller ---------->
const registerUser = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    confirm_password,
    type,
  } = req.body;

  try {
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !password ||
      !confirm_password ||
      !type
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      confirm_password: hashedPassword,
      role: type,
      is_otp_verify: false,
      is_user_login: false,
    });

    await newUser.save();

    const otp = await sendOtp(email, first_name);

    res.status(201).json({
      message: "User registered successfully. OTP sent.",
      user: newUser,
      otp,
    });
  } catch (error) {
    console.log("Registration error", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// <--------- user otp verify --------->
const verifyUserOtp = async (req, res) => {
  const { email, otp, type } = req.body;

  if (!email || !otp || !type) {
    return res.status(400).json({ message: "Email, OTP, and type required." });
  }

  try {
    const verifiedUser = await verifyOtp(email, otp, type);

    const token = generateToken(verifiedUser._id);

    // ✅ Save token and update OTP verification status
    verifiedUser.token = token;
    verifiedUser.is_otp_verify = true;
    await verifiedUser.save();

    res.status(200).json({
      message: "OTP verified successfully.",
      user: verifiedUser,
      token,
    });
  } catch (error) {
    console.log("OTP Verification error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// <---------- user login controller --------->
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.is_otp_verify) {
      return res
        .status(403)
        .json({ message: "Please verify OTP before login." });
    }
    const token = generateToken(user._id);

    // ✅ Save token and update login status
    user.token = token;
    user.is_user_login = true;
    await user.save();

    res.status(200).json({
      message: "Login successful.",
      user,
      token,
    });
  } catch (error) {
    console.log("Login error", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// forgot password: send otp ------------>
const forgotPasswordSendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Send OTP for password reset
    const otp = await sendOtp(email, user.first_name, "forgotpassword");

    res.status(200).json({
      message: "OTP sent to email for password reset",
      otp,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// <---------- forgot password: change password after OTP verification ---------->
const changeForgotPassword = async (req, res) => {
  const { email, password, confirm_password } = req.body;

  if (!email || !password || !confirm_password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.is_otp_verify) {
      return res
        .status(403)
        .json({ message: "OTP not verified. Please verify before changing password." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.confirm_password = hashedPassword; // If you still store this (optional)
    user.is_otp_verify = false; // reset OTP verification status after password change

    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.log("Change password error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerUser, verifyUserOtp, loginUser,forgotPasswordSendOtp,changeForgotPassword };
