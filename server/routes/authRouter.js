const express = require("express");
const {
  attemptLogin,
  attemptRegister,
  handleLogin,
} = require("../controllers/authController");
const validateData = require("../middleware/validateData");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/login", validateData, rateLimiter(60, 10), attemptLogin);
router.post("/signup", validateData, rateLimiter(30, 4), attemptRegister);
router.get("/isLoggedIn", handleLogin);

module.exports = router;
