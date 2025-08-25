import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

import { URL } from "./constants.js";

const dataArray = new Map(); 

const app = express();

// CORS setup
app.use(
  cors({
    origin: URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.send("Backend server is running.");
});

// Socket.io
io.on("connection", (socket) => {
  console.log(` New user connected: ${socket.id}`);

  // Viewer joins a sharer's room
  socket.on("req-location", ({ id }) => { 
    let viewers = dataArray.get(id) || []; 
    if (!viewers.includes(socket.id)) {
      viewers.push(socket.id);
    }
    dataArray.set(id, viewers); 

    console.log(`Viewer ${socket.id} subscribed to ${id}`);
    console.log("Updated dataArray:", dataArray);
  });

  // Sharer updates location
  socket.on("update-location", (data) => {
    const { id: sharerId, coords } = data;
    console.log(`Location update from sharer ${sharerId}:`, coords);

    const viewers = dataArray.get(sharerId);
    if (viewers && viewers.length > 0) {
      
      io.to(viewers).emit("get-location", data); 
      console.log("Emitted update to viewers:", viewers);
    } else {
      console.log("!!No viewers found for sharer:", sharerId);
    }
  });

  // Handle disconnect (remove socket from all viewer lists)
  socket.on("disconnect", () => {
    for (const [sharerId, viewers] of dataArray.entries()) {
      const updated = viewers.filter((id) => id !== socket.id);
      if (updated.length === 0) {
        dataArray.delete(sharerId);
      } else {
        dataArray.set(sharerId, updated);
      }
    }
    console.log(`!!!User disconnected: ${socket.id}`);
  });
});


server.listen(PORT, () => {
  console.log(`!!Server running on port ${PORT}`);
});