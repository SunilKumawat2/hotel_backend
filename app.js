const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Routes section
const userRoutes = require("./src/routes/Api_Routes");
app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is Running....");
});

module.exports = app;
