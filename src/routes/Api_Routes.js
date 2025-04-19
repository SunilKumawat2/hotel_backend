const express = require("express");
const router = express.Router();
const {registerUser,verifyUserOtp, loginUser } = require("../controllers/userController");

// <---------- router methods -------------->
router.post("/register", registerUser);
router.post("/otp_verify", verifyUserOtp);
router.post("/login", loginUser);

module.exports = router;
