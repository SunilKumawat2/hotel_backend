const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB Connected to Successfully")
    } catch (error) {
        console.log("MongoDB Connection Error", error.message)
        process.exit(1)
    }
};

module.exports = connectDB