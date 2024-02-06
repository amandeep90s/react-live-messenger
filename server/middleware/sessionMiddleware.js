const RedisStore = require("connect-redis").default;
const session = require("express-session");
const redisClient = require("../redis");
require("dotenv").config();

// Configure session store using Redis
const redisStore = new RedisStore({ client: redisClient });

const sessionMiddleware = session({
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
});

const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

const corsConfig = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

module.exports = { corsConfig, sessionMiddleware, wrap };
