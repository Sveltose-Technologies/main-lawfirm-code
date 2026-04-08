import { io } from "socket.io-client";

export const socket = io("https://api.blustor.net", {
  transports: ["polling", "websocket"],
  withCredentials: true,
  autoConnect: false, 
});
