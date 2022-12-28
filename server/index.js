// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const { Server } = require('socket.io');
import express from "express"
import { createServer } from "http"
import cors from "cors"
import { Server } from "socket.io"

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  // Write socket event listeners in here...

  // joining room
  socket.on("join_room", (data) => {
    socket.join(data)
    console.log(`user with id ${socket.id} joined room ${data}`)
  })

  // Sending messages
  socket.on("send_message", (data) => {
    console.log("server got ", data)
    socket.to(data.room).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
});

server.listen(port, () => console.log(`Server is running on port ${port}`));

//https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/
// Denna guiden var väldigt bra att läsa igenom för att förstå bättre!
