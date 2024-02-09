const redisClient = require("../redis");

const authorizeUser = (socket, next) => {
  if (!socket?.request?.session?.user) {
    next(new Error("Not authorized"));
  } else {
    socket.user = { ...socket.request.session.user };
    redisClient.hset(
      `userid:${socket.user.username}`,
      "userid",
      socket.user.userid
    );
    next();
  }
};

module.exports = {
  authorizeUser,
};
