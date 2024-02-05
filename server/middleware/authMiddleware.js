const { validationResult } = require("express-validator");
const authSchema = require("../validations/authSchema");

const validateData = async (req, res, next) => {
  try {
    await authSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors }); // Send error response
  }
};

module.exports = validateData;
