const router = require("express").Router();

// You can require and use your routes here ;)

// This is a test route to Test the Working of the Server
router.get("/test", (req, res) => {
  res.send("Hi from the Server");
});

module.exports = router;
