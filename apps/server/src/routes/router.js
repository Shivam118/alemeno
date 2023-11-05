const router = require("express").Router();

// const User = require("../models/User");

// You can require and use your routes here ;)
router.get("/test", (req, res) => {
  res.send("Hi from the Server");
});

module.exports = router;
