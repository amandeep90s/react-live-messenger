const { StatusCodes } = require("http-status-codes");
const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidV4 } = require("uuid");

/**
 * Handle the login for a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const attemptLogin = async (req, res, next) => {
  try {
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
        req.session.user = {
          username,
          id: potentialLogin.rows[0].id,
          userid: potentialLogin.rows[0].userid,
        };
        res.status(StatusCodes.OK).json({ loggedIn: true, username });
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ loggedIn: false, status: "Username or Password is wrong" });
      }
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ loggedIn: false, status: "Username or Password is wrong" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Handle the registration of a new user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const attemptRegister = async (req, res, next) => {
  try {
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

      req.session.user = {
        username,
        id: newUserQuery.rows[0].id,
        userid: newUserQuery.rows[0].userid,
      };
      res.status(StatusCodes.CREATED).json({ loggedIn: true, username });
    } else {
      res
        .status(StatusCodes.CONFLICT)
        .json({ loggedIn: false, status: "Username already taken" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Handle the logged in state after successfull login
 * @param {*} req
 * @param {*} res
 */
const handleLogin = async (req, res) => {
  const {
    session: { user },
  } = req;

  if (user?.username) {
    res
      .status(StatusCodes.OK)
      .json({ loggedIn: true, username: user.username });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ loggedIn: false });
  }
};

module.exports = {
  attemptLogin,
  attemptRegister,
  handleLogin,
};
