import { io } from "socket.io-client";

const socket = new io(import.meta.env.VITE_APP_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
