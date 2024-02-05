const Yup = require("yup");

const formSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(6, "Username is too short")
    .max(28, "Username is too long"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password is too short")
    .max(28, "Password is too long"),
});

const validateForm = (req, res) => {
  formSchema
    .validate(req.body)
    .then((valid) => {
      if (valid) {
        console.log("Form is good", valid);
      }
    })
    .catch((error) => {
      console.log(error.errors);
      res.status(422).json({ error: error.errors });
    });
};

module.exports = validateForm;
