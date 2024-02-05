const Yup = require("yup");

const authSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(6, "Username must be at least 6 characters")
    .max(28, "Username must not be nore then 28 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(28, "Password must not be nore then 28 characters"),
});

module.exports = authSchema;
