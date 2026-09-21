import { io } from "socket.io-client";
import { config } from "../config";

// Replace with your Socket.IO server URL
export let socket_connected = false;
const SOCKET_URL = config.SOCKET.URL;
const socket = io(SOCKET_URL, {
  auth: {
    token: config.SOCKET.TOKEN,
  },
  transports: ["websocket", "polling"],
  reconnection: true,
});

socket.on("connect", () => {
  console.log(`Connected to server with id: ${socket.id}`);
  socket_connected = true;
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected: ${reason}`);
  socket_connected = false;
});

export const emitHandler = async (emiterName: string, data: any) => {
  socket?.emit(emiterName, data);
};
