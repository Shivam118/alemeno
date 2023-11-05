// Require Dependencies
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Instantiate an Express Application
const app = express();
// const { createContext } = require("./src/controllers/middleware.js");

// Configure Express App Instance
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
// app.use(createContext);

const { PORT } = process.env;

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Assign Routes
app.use("/", require("./src/routes/router.js"));
app.use("/users", require("./src/controllers/userController.js"));
app.use("/courses", require("./src/controllers/courseController.js"));

// Handle not valid route
app.use("*", (req, res) => {
  res.status(404).json({ status: false, message: "Endpoint Not Found" });
});

// Open Server on selected Port
app.listen(PORT, () => console.info("Server listening on port ", PORT));
