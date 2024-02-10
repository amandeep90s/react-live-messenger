const redisClient = require("../../redis");

const addFriend = async (socket, friendName, cb) => {
  const { username } = socket.user;

  if (friendName === username) {
    cb({ done: false, errorMsg: "Cannot add self!" });
    return;
  }

  const friend = await redisClient.hgetall(`userid:${friendName}`);
  if (!friend?.userid) {
    cb({ done: false, errorMsg: "User doesn't exist!" });
    return;
  }

  const currentFriendList = await redisClient.lrange(
    `friends:${username}`,
    0,
    -1
  );
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({ done: false, errorMsg: "Friend already added!" });
    return;
  }

  await redisClient.lpush(
    `friends:${username}`,
    [friendName, friend.userid].join(".")
  );

  const newFriend = {
    username: friendName,
    userid: friend.userid,
    connected: friend.connected,
  };
  cb({ done: true, newFriend });
};

module.exports = addFriend;
