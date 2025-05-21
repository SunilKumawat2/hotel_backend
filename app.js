const express = require("express");
const cors = require("cors");
const app = express();

//<------ Middleware sections ------->
app.use(express.json());
app.use(cors());
app.use("/photos",express.static("uploads/photos"))


// Routes section
const userRoutes = require("./src/routes/Api_Routes");
app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is Running....");
});

module.exports = app;
