const express = require('express');
const http = require('http');

const { Server } = require('socket.io');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors);
const server = http.createServer(app);

const port = process.env.PORT || 5005;

const CHAT_BOT = 'ChatBot';
const chatRooms = [
  {
    roomName: 'JavaScript',
    users: [],
  },
  {
    roomName: 'React',
    users: [],
  },
  {
    roomName: 'VueS',
    users: [],
  },
  {
    roomName: 'Angular',
    users: [],
  },
];

module.exports = () => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  let users = [];

  io.on('connection', (socket) => {
    // Socket event listeners
    console.log(`User connected: ${socket.id}`);

    // Online users
    socket.on('newUser', (data) => {
      users.push(data);
      console.log(users);
      io.emit('newUserResponse', users);
    });

    // Join pre-determined rooms
    socket.on('join_room', (room) => {
      if (room) {
        socket.join(room);
      } else {
        socket.emit(
          'list_chatRooms',
          chatRooms.map((chatRoomObj) => chatRoomObj.roomName)
        );
        chatRooms.forEach((room) => {
          socket.join(room.roomName);
        });
      }
    });

    // DM
    socket.on('private_message', (data) => {
      const myID = socket.id;
      const room = data.toUsername + '/' + data.fromUsername;
      socket.join(room);
      socket.to(data.toID).emit('private_room', {
        fromUsername: data.fromUsername,
        myID,
        room,
      });
    });

    // Sending messages
    socket.on('send_message', (data) => {
      io.in(data.room).emit('receive_message', data);
    });

    // On disconnect
    socket.on('disconnect', () => {
      users = users.filter((user) => user.socketID !== socket.id);
      io.emit('newUserResponse', users);
      socket.disconnect();
      console.log('User disconnected: ', socket.id);
    });
  });

  server.listen(port, () => console.log(`Chat is listening on port ${port}.`));
};
