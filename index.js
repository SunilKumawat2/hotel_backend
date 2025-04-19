const connectDB = require("./src/config/db");
const express = require("express");
const dotenv = require("dotenv");
const app = require("./app");

//<----------- load enviroment variables ------------>
dotenv.config();

// <-------- connect to mongoDB ---------------->
connectDB();

//<------------- Start the server ----------->
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
