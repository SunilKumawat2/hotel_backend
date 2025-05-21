const User = require("../models/users");

const verifyOtp = async (email, otp, type) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found.");
  }

  if (
    user.otp !== otp ||
    user.type !== type ||
    !user.otp_expiry ||
    user.otp_expiry < new Date()
  ) {
    // Log the values being compared for debugging
    console.log('Comparing OTP values:', user.otp, otp);
    console.log('Comparing OTP type:', user.type, type);
    console.log('Comparing OTP expiry:', user.otp_expiry, new Date());
    throw new Error("Invalid or expired OTP.");
  }

  // Mark as verified
  if (type === "register" || type === "forgotpassword") {
    user.is_otp_verify = true;
  }

  // Clear OTP info
  user.otp = null;
  user.type = null;
  user.otp_expiry = null;

  await user.save();
  return user;
};

module.exports = verifyOtp;
