const { StatusCodes } = require("http-status-codes");
const redisClient = require("../redis");

const rateLimiter =
  (secondsLimit = 60, limitAmount = 10) =>
  async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const [response] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsLimit)
      .exec();

    if (response[1] > limitAmount) {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        loggedIn: false,
        status: "Slow down!! Try again in a minute!",
      });
    } else {
      next();
    }
  };

module.exports = rateLimiter;
