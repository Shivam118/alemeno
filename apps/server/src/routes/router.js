const router = require("express").Router();

// const User = require("../models/User");

// You can require and use your routes here ;)
router.get("/test", (req, res) => {
  res.send("Hello World");
});

module.exports = router;
