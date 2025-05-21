const Hotel = require("../models/Hotels");

const CreateHotels = async (req, res) => {
  const {hotel_name,hotel_short_description,hotel_description,} = req.body;
  const hotel_images = req.file ? req.file.filename : null;
  try {
    const newHotel = new Hotel({
      hotel_name,
      hotel_short_description,
      hotel_description,
      hotel_images,
    });
    await newHotel.save();
    return res
      .status(201)
      .json({
        status: 201,
        message: "Successfully Add the Hotel",
        data: newHotel,
      });
  } catch (error) {
    console.log("error",error)
    return res.status(500).json({ status: 500, message: "Server side error Add the Hotel" })
  }
};

module.exports = {CreateHotels}