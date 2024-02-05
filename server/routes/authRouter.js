const express = require("express");
const authController = require("../controllers/authController");
const validateData = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", validateData, authController.login);
router.post("/signup", validateData, authController.signup);

module.exports = router;
