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

  // Messages
  const msgQuery = await redisClient.lrange(`chat:${userid}`, 0, -1);
  const messages = msgQuery?.map((message) => {
    const [to, from, content] = message.split(".");
    return { to, from, content };
  });

  if (messages?.length > 0) {
    socket.emit("messages", messages);
  }
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

const onDm = async (socket, message) => {
  message.from = socket.user.userid;
  // to.from.content
  const messageString = [message.to, message.from, message.content].join(".");

  await redisClient.lpush(`chat:${message.to}`, messageString);
  await redisClient.lpush(`chat:${message.from}`, messageString);

  socket.to(message.to).emit("dm", message);
};

module.exports = {
  initializeUser,
  addFriend,
  onDisconnect,
  onDm,
};
