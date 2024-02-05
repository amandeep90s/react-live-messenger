// Require necessary modules
require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Import Express.js
const cors = require("cors"); // Import CORS middleware
const helmet = require("helmet"); // Import Helmet security middleware
const http = require("http"); // Import HTTP module
const { Server } = require("socket.io"); // Import Socket.IO
const session = require("express-session"); // Import Express session middleware
const Redis = require("ioredis"); // Import Redis client library
const RedisStore = require("connect-redis").default; // Import Redis session store
const authRouter = require("./routes/authRouter"); // Import authentication routes

// Create Express app and server
const app = express();
const server = http.createServer(app);

// Create Socket.IO instance
const io = new Server(server, {
  cors: {
    // Configure CORS for Socket.IO
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Apply middleware
app.use(helmet()); // Apply Helmet security headers
app.use(
  cors({
    // Configure CORS for Express
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json()); // Parse incoming JSON data

// Configure session store using Redis
const redisClient = new Redis();
const redisStore = new RedisStore({ client: redisClient });
app.use(
  session({
    secret: process.env.COOKIE_SECRET, // Use secret from environment variable
    credentials: true, // Enable session cookies to be sent with credentials
    name: "sid", // Set session cookie name
    store: redisStore, // Use RedisStore for session persistence
    resave: false, // Don't resave session on every request
    saveUninitialized: false, // Don't create session until data is stored
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set secure cookie flag in production
      httpOnly: true, // Prevent client-side JavaScript access to session cookie
      expires: 1000 * 60 * 60 * 24 * 7, // Set session cookie expiration to 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set SameSite attribute for security
    },
  })
);

// Define routes
app.get("/", (req, res) => res.json("Hello World")); // Basic route for testing
app.use("/api/auth", authRouter); // Mount authentication routes

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  res.status(statusCode).json({ status: false, statusCode, message });
});

// Socket.IO connection event listener (empty for now)
io.on("connect", (socket) => {});

// Start the server
const PORT = process.env.SERVER_PORT || 5000; // Get port from environment variable or default to 5000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
