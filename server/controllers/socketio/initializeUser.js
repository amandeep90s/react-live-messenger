const redisClient = require("../../redis");
const parseFriendList = require("./parseFriendList");

const initializeUser = async (socket) => {
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

module.exports = initializeUser;
