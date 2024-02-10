const { StatusCodes } = require("http-status-codes");
const { jwtVerify, getJwt } = require("../jwt/jwtAuth");
const pool = require("../../db");
require("dotenv").config();

/**
 * Handle the logged in state after successfull login
 * @param {*} req
 * @param {*} res
 */
const handleLogin = async (req, res) => {
  const token = getJwt(req);

  if (!token || ["null", "undefined"].includes(token)) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ loggedIn: false });
  }

  jwtVerify(token, process.env.JWT_SECRET)
    .then(async (decoded) => {
      const potentialUser = await pool.query(
        "SELECT username FROM users u WHERE u.username = $1",
        [decoded.username]
      );

      if (potentialUser.rowCount === 0) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ loggedIn: false, token: null });
      }

      res
        .status(StatusCodes.OK)
        .json({ loggedIn: true, token, username: decoded.username });
    })
    .catch((error) => {
      console.log(error);
      res.status(StatusCodes.UNAUTHORIZED).json({ loggedIn: false });
    });
};

module.exports = handleLogin;
