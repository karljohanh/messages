const express = require('express');
const http = require('http');

const { Server } = require('socket.io');
require('dotenv').config();
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5005;

const CHAT_BOT = "ChatBot"
let chatRoom = ""
let allUsers = []

module.exports = () => {
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
    socket.on('join_room', (data) => {
      const {userName, room} = data
      socket.join(room);

      let createdTime = Date.now()

      // Send all users in room
      socket.to(room).emit("receive_message", {
        message: `${userName} har gått med i rummet.`,
        userName: CHAT_BOT,
        createdTime
      })

      // Send new user only
      socket.emit("receive_message", {
        message: `Välkommen ${userName}`,
        userName: CHAT_BOT,
        createdTime
      })

      // Track users in room
      chatRoom = room;
      allUsers.push({id: socket.id, userName, room})
      chatRoomUsers = allUsers.filter((user) => user.room === room);
      socket.to(room).emit('chatroom_users', chatRoomUsers);
      socket.emit('chatroom_users', chatRoomUsers);
    });

    // Sending messages
    socket.on('send_message', (data) => {
      io.in(data.room).emit('receive_message', data);
    });

    socket.on('leave_room', (data) => {
      const { userName, room } = data;
      socket.leave(room);
      console.log(`User ${userName} left the room`);
    });

    socket.on('disconnect', (reason, user) => {
      if (
        reason === 'io server disconnect' ||
        reason === 'client namespace disconnect'
      ) {
        console.log('User disconnected');
      }
    });
  });

  server.listen(port, () => console.log(`Server is running on port ${port}`));
};

//https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/
// Denna guiden var väldigt bra att läsa igenom för att förstå bättre!
