import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

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
  socket.on('join_room', (data) => {
    const { userName, room } = data
    socket.join(room);
    // console.log("datan här: ", data)
    // io.in(room).emit('receive_message', )
    console.log(`${userName} joined room ${room}`);
  });

  // Sending messages
  socket.on('send_message', (data) => {
    console.log('server got ', data);
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

//https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/
// Denna guiden var väldigt bra att läsa igenom för att förstå bättre!
