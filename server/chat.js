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
let chatRoom = '';
let allUsers = [];
const chatRooms = [
    {
        roomName: 'JavaScript',
        users: []
    },
    {
        roomName: 'React',
        users: []
    },
    {
        roomName: 'VueS',
        users: []
    },
    {
        roomName: 'Angular',
        users: []
    }
];

module.exports = () => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    let users = [];

    io.on('connection', (socket) => {
        console.log(`User connected ${socket.id}`);

        socket.on('newUser', (data) => {
            users.push(data);
            console.log(users);
            io.emit('newUserResponse', users);
        });

        // Write socket event listeners in here...
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

        // private dm
        socket.on('private_message', (data) => {
            // socket.emit('private_room', data);
            // console.log('privatemsg: ', data, 'my id: ', socket.id);
            const myID = socket.id;
            const room = data.toUsername + '/' + data.fromUsername;
            socket.join(room);
            socket.to(data.toID).emit('private_room', {
                fromUsername: data.fromUsername,
                myID,
                room
            });
        });

        // Sending messages
        socket.on('send_message', (data) => {
            console.log(data);
            io.in(data.room).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            users = users.filter((user) => user.socketID !== socket.id);
            io.emit('newUserResponse', users);
            socket.disconnect();
            console.log('disconnect: ', socket.id);
        });
    });

    server.listen(port, () => console.log(`Server is running on port ${port}`));
};

//https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/
// Denna guiden var väldigt bra att läsa igenom för att förstå bättre!
