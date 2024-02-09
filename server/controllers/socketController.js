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

  if (friendRooms.length) {
    socket.to(friendRooms).emit("connected", true, username);
  }

  socket.emit("friends", parsedFriendList);

  console.log("Connected to the socket");
};

// Add friend method
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

  const friend = await redisClient.hgetall(`userid:${friendName}`);
  if (!friend) {
    cb({ done: false, errorMsg: "User does not exist!" });
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
