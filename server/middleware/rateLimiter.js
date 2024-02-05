const redisClient = require("../redis");
const { StatusCodes } = require("http-status-codes");

const rateLimiter =
  (limitSeconds = 60, limitApiCall = 10) =>
  async (req, res, next) => {
    const ip = req.connection.remoteAddress.slice(0, 6);
    const [response] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, limitSeconds)
      .exec();

    if (response[1] > limitApiCall) {
      res
        .status(StatusCodes.TOO_MANY_REQUESTS)
        .json({
          loggedIn: false,
          status: "Slow down!! Try again in a minute!",
        });
    } else {
      next();
    }
  };

module.exports = rateLimiter;
