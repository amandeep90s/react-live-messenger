require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => res.json("Hello World"));

io.on("connect", (socket) => {});

const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
