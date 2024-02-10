const redisClient = require("../redis");

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const [username, userid] = friend.split(".");
    const friendConnected = await redisClient.hget(
      `userid:${username}`,
      "connected"
    );
    newFriendList.push({
      username,
      userid,
      connected: friendConnected,
    });
  }
  return newFriendList;
};

// Initialize the user
const initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  const { username, userid } = socket.user;
  // Join Room
  socket.join(userid);

  await redisClient.hset(
    `userid:${username}`,
    "userid",
    userid,
    "connected",
    true
  );

  // Send the friends list
  const friendList = await redisClient.lrange(`friends:${username}`, 0, -1);
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);

  if (friendRooms.length > 0)
    socket.to(friendRooms).emit("connected", true, username);

  socket.emit("friends", parsedFriendList);
};

// Add friend method
const addFriend = async (socket, friendName, cb) => {
  const { username } = socket.user;

  if (friendName === username) {
    cb({ done: false, errorMsg: "Cannot add self!" });
    return;
  }
  const friend = await redisClient.hgetall(`userid:${friendName}`);
  const currentFriendList = await redisClient.lrange(
    `friends:${username}`,
    0,
    -1
  );
  if (!friend) {
    cb({ done: false, errorMsg: "User doesn't exist!" });
    return;
  }
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

// Disconnect
const onDisconnect = async (socket) => {
  const { username } = socket.user;

  await redisClient.hset(`userid:${username}`, "connected", false);
  const friendList = await redisClient.lrange(`friends:${username}`, 0, -1);
  const friendRooms = await parseFriendList(friendList).then((friends) =>
    friends.map((friend) => friend.userid)
  );
  socket.to(friendRooms).emit("connected", false, username);
};

module.exports = {
  initializeUser,
  addFriend,
  onDisconnect,
};
