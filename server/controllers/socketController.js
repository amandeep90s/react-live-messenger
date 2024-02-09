const redisClient = require("../redis");

const initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  const { username, userid } = socket.user;

  // Initialize the user
  await redisClient.hset(`userid:${username}`, "userid", userid);

  // Send the friends list
  const friendsList = await redisClient.lrange(`friends:${username}`, 0, -1);
  socket.emit("friends", friendsList);

  console.log("Connected to the socket");
};

const addFriend = async (socket, friendName, cb) => {
  const { username } = socket.user;

  if (friendName === username) {
    cb({ done: false, errorMsg: "Cannot add self!" });
    return;
  }
  const currentFriendList = await redisClient.lrange(
    `friends:${username}`,
    0,
    -1
  );

  const friendUserId = await redisClient.hget(`userid:${friendName}`, "userid");
  if (!friendUserId) {
    cb({ done: false, errorMsg: "User does not exist!" });
    return;
  }

  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({ done: false, errorMsg: "Friend already added!" });
    return;
  }

  await redisClient.lpush(`friends:${username}`, friendName);
  cb({ done: true });
};

module.exports = {
  initializeUser,
  addFriend,
};
