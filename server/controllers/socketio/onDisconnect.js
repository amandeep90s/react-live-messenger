const redisClient = require("../../redis");
const parseFriendList = require("./parseFriendList");

const onDisconnect = async (socket) => {
  const { username } = socket.user;

  await redisClient.hset(`userid:${username}`, "connected", false);

  const friendList = await redisClient.lrange(`friends:${username}`, 0, -1);

  const friendRooms = await parseFriendList(friendList).then((friends) =>
    friends.map((friend) => friend.userid)
  );

  socket.to(friendRooms).emit("connected", false, username);
};

module.exports = onDisconnect;
