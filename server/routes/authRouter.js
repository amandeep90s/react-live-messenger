const express = require("express");
const {
  attemptLogin,
  attemptRegister,
  handleLogin,
} = require("../controllers/authController");
const validateData = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", validateData, attemptLogin);
router.post("/signup", validateData, attemptRegister);
router.get("/isLoggedIn", handleLogin);

module.exports = router;
