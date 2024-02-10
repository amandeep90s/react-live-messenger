const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { jwtSign } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();

/**
 * Handle the login for a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const attemptLogin = async (req, res) => {
  const { username, password } = req.body;

  const potentialLogin = await pool.query(
    "SELECT id, username, passhash, userid FROM users u WHERE u.username=$1",
    [username]
  );

  if (potentialLogin.rowCount > 0) {
    const isSamePass = await bcrypt.compare(
      password,
      potentialLogin.rows[0].passhash
    );

    if (isSamePass) {
      jwtSign(
        {
          username,
          id: potentialLogin.rows[0].id,
          userid: potentialLogin.rows[0].userid,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )
        .then((token) =>
          res.status(StatusCodes.OK).json({ loggedIn: true, token })
        )
        .catch((error) => {
          console.log(error);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ loggedIn: false, status: "Try again later" });
        });
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ loggedIn: false, status: "Wrong username or password!" });
    }
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ loggedIn: false, status: "Wrong username or password!" });
  }
};

module.exports = attemptLogin;
