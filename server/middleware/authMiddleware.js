const { StatusCodes } = require("http-status-codes");
const authSchema = require("../validations/authSchema");

const validateData = async (req, res, next) => {
  try {
    await authSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.errors }); // Send error response
  }
};

module.exports = validateData;
