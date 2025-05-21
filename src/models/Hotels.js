const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
    //   required: true,
    },
    hotel_name: {
      type: String,
      required: true,
    },
    hotel_short_description: {
      type: String,
    },
    hotel_description: {
      type: String,
    },
    hotel_images: {
      type: String,
    },
  },
  {
    Timestamp: true,
  }
);
module.exports = mongoose.model("Hotels", HotelSchema);
