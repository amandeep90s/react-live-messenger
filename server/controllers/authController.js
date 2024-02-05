const validateForm = require("../validations/authForm");

const login = (req, res, next) => {
  validateForm(req, res);
};

const signup = (req, res, next) => {
  validateForm(req, res);
};

module.exports = {
  login,
  signup,
};
