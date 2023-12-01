import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "wss://websockets-testing.onrender.com"
    : "localhost:8000";

console.log(URL);

export const socket = io(URL, {
  // autoConnect: false,
  transports: ["polling", "websocket"],
});
