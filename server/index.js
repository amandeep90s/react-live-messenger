// Require necessary modules
require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Import Express.js
const cors = require("cors"); // Import CORS middleware
const helmet = require("helmet"); // Import Helmet security middleware
const http = require("http"); // Import HTTP module
const { Server } = require("socket.io"); // Import Socket.IO
const authRouter = require("./routes/authRouter"); // Import authentication routes
const {
  corsConfig,
  sessionMiddleware,
  wrap,
} = require("./middleware/sessionMiddleware");
const { authorizeUser } = require("./middleware/socketMiddleware");

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

app.use(sessionMiddleware); // Apply session middleware

// Define routes
app.get("/", (req, res) => res.json("Hello World")); // Basic route for testing
app.use("/api/auth", authRouter); // Mount authentication routes

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  res.status(statusCode).json({ status: false, statusCode, message });
});

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
// Socket.IO connection event listener (empty for now)
io.on("connect", (socket) => {
  console.log("Connected to the socket");
});

// Start the server
const PORT = process.env.SERVER_PORT || 5000; // Get port from environment variable or default to 5000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
