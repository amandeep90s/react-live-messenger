const redisClient = require("../../redis");

const parseFriendList = async (friendList) => {
  const newFriendList = [];

  for (let friend of friendList) {
    const [username, userid] = friend.split(".");
    const connected = await redisClient.hget(`userid:${username}`, "connected");
    newFriendList.push({
      username,
      userid,
      connected,
    });
  }
  return newFriendList;
};

module.exports = parseFriendList;
