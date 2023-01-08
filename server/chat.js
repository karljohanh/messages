const express = require('express');
const http = require('http');

const { Server } = require('socket.io');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors)
const server = http.createServer(app);

const port = process.env.PORT || 5005;

const CHAT_BOT = "ChatBot"
let chatRoom = ""
let allUsers = []
const chatRooms = [
  {
    roomName: "Native JavaScript",
    users: [],
  },
  {
    roomName: "React",
    users: [],
  },
  {
    roomName: "VueS",
    users: [],
  },
  {
    roomName: "Angular",
    users: [],
  }
]

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
    socket.emit("list_chatRooms", chatRooms.map((chatRoomObj) => chatRoomObj.roomName))

    socket.on('join_room', (data) => {
      // const { userName, room } = data
      // let createdTime = Date.now()
      // Går med i alla rum direkt
      chatRooms.forEach((room) => {
        console.log("joining room: ", room.roomName)
        socket.join(room.roomName)
      })

      

      // Skickar meddelande till alla användare i rummet
      // socket.to(room).emit("receive_message", {
      //   message: `${userName} har gått med i rummet.`,
      //   userName: CHAT_BOT,
      //   createdTime
      // })



      // Håller reda på användare i rummet
      // chatRoom = room;
      // allUsers.push({id: socket.id, userName, room})
      // chatRoomUsers = allUsers.filter((user) => user.room === room);

      // Skickar lista med alla användare i rummet
      // socket.to(room).emit('chatroom_users', chatRoomUsers);
      // socket.emit('chatroom_users', chatRoomUsers);
    });

    // Sending messages
    socket.on('send_message', (data) => {
      console.log("sendmessages data: ", data)
      io.in(data.room).emit('receive_message', data);
    });


    socket.on('leave_room', (data) => {
      const { userName, room } = data;
      const createdTime = new Date()
      allUsers = allUsers.filter((user) => user.id !== socket.id);
      
      // Skickar uppdaterad lista med alla användare
      io.in(room).emit('chatroom_users', allUsers);

      // Skickar meddelande om att användaren lämnat
      socket.to(room).emit('receive_message', {
        message: `${userName} lämnade rummet`,
        userName: CHAT_BOT,
        createdTime: createdTime
      });
    });

    socket.on('disconnect', (reason) => {
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
