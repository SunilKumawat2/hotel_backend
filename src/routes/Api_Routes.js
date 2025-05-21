const express = require("express");
const router = express.Router();
const {registerUser,verifyUserOtp, loginUser, forgotPasswordSendOtp, changeForgotPassword } = require("../controllers/userController");
const {CreateHotels} = require("../controllers/HotelController")
const upload = require("../middlewares/Multer");

// <---------- router methods -------------->
router.post("/register", registerUser);
router.post("/otp_verify", verifyUserOtp);
router.post("/login", loginUser);
router.post("/forgot-password-send-otp", forgotPasswordSendOtp);
router.post("/forgot-password", changeForgotPassword);

// <---------------- Hotel routes methods ----------->
router.post("/create-hotels", upload.single("hotel_images"), CreateHotels);



module.exports = router;
