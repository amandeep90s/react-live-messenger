const pool = require("../db");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const potentialLogin = await pool.query(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      [username]
    );

    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        password,
        potentialLogin.rows[0].passhash
      );

      if (isSamePass) {
        req.session.user = { username, id: potentialLogin.rows[0].id };
        res.json({ loggedIn: true, username });
      } else {
        res
          .status(401)
          .json({ loggedIn: false, status: "Username or Password is wrong" });
      }
    } else {
      res
        .status(401)
        .json({ loggedIn: false, status: "Username or Password is wrong" });
    }
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await pool.query(
      "SELECT username FROM users WHERE username=$1",
      [username]
    );

    if (existingUser.rowCount === 0) {
      const hashedPass = await bcrypt.hash(password, 10);
      const newUserQuery = await pool.query(
        "INSERT INTO users(username, passhash) VALUES($1,$2) RETURNING id, username",
        [username, hashedPass]
      );

      req.session.user = { username, id: newUserQuery.rows[0].id };
      res.status(200).json({ loggedIn: true, username });
    } else {
      res
        .status(409)
        .json({ loggedIn: false, status: "Username already taken" });
    }
  } catch (error) {
    next(error);
  }
};

const isLoggedIn = async (req, res) => {
  const {
    session: { user },
  } = req;

  if (user?.username) {
    res.status(200).json({ loggedIn: true, username: user.username });
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

module.exports = {
  login,
  signup,
  isLoggedIn,
};
