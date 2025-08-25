import { io } from "socket.io-client";
import { ServerURL } from "./constants";

export const socket = io(ServerURL, {
  autoConnect: false,
});