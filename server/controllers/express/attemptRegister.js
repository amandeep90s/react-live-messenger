const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const { v4: uuidV4 } = require("uuid");
const pool = require("../../db");
const { jwtSign } = require("../jwt/jwtAuth");
require("dotenv").config();

/**
 * Handle the registration of a new user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const attemptRegister = async (req, res, next) => {
  const { username, password } = req.body;

  const existingUser = await pool.query(
    "SELECT username FROM users WHERE username=$1",
    [username]
  );

  if (existingUser.rowCount === 0) {
    const hashedPass = await bcrypt.hash(password, 10);

    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passhash, userid) VALUES($1,$2,$3) RETURNING id, username, userid",
      [username, hashedPass, uuidV4()]
    );

    jwtSign(
      {
        username,
        id: newUserQuery.rows[0].id,
        userid: newUserQuery.rows[0].userid,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )
      .then((token) =>
        res
          .status(StatusCodes.CREATED)
          .json({ loggedIn: true, token, username })
      )
      .catch((error) => {
        console.log(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ loggedIn: false, status: "Try again later" });
      });
  } else {
    res
      .status(StatusCodes.CONFLICT)
      .json({ loggedIn: false, status: "Username already taken" });
  }
};

module.exports = attemptRegister;
