const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    phone: { type: Number, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    confirm_password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "hotel", "admin"],
      default: "user",
    },
    is_otp_verify: { type: Boolean, default: false },
    is_user_login: { type: Boolean, default: false },
    otp: { type: String },
    type: { type: String },
    otp_expiry: { type: Date },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
