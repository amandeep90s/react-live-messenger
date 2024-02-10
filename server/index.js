require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Import Express.js
const cors = require("cors"); // Import CORS middleware
const helmet = require("helmet"); // Import Helmet security middleware
const http = require("http"); // Import HTTP module
const { Server } = require("socket.io"); // Import Socket.IO
const authRouter = require("./routes/authRouter"); // Import authentication routes
const { corsConfig } = require("./controllers/serverController");
const {
  initializeUser,
  addFriend,
  onDisconnect,
  authorizeUser,
  dm,
} = require("./controllers/socketController");
const pool = require("./db");
const redisClient = require("./redis");

// Create Express app and server
const app = express();
const server = http.createServer(app);

// Create Socket.IO instance
const io = new Server(server, {
  cors: corsConfig,
});

// Apply middleware
app.use(helmet()); // Apply Helmet security headers
app.use(cors(corsConfig));
app.use(express.json()); // Parse incoming JSON data

// Define routes
app.get("/", (req, res) => res.json("Hello World")); // Basic route for testing
app.use("/api/auth", authRouter); // Mount authentication routes
app.set("trust proxy", 1);

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  res.status(statusCode).json({ status: false, statusCode, message });
});

io.use(authorizeUser);
// Socket.IO connection event listener (empty for now)
io.on("connect", (socket) => {
  // Initialize the user
  initializeUser(socket);

  // Add friend
  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });

  // DM message
  socket.on("dm", (message) => dm(socket, message));

  // On Disconnect
  socket.on("disconnecting", () => onDisconnect(socket));
});

// Start the server
const PORT = process.env.SERVER_PORT || 5000; // Get port from environment variable or default to 5000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const resetEverythingInterval = 1000 * 60 * 15; // 15 minutes

setInterval(() => {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  pool.query("DELETE FROM users u where u.username != $1", ["lester"]);
  redisClient.flushall();
}, resetEverythingInterval);
