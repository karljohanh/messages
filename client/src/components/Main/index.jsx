import { useState } from 'react';
import { io } from 'socket.io-client';

import Chat from '../Chat';

const server = 'http://localhost:5005/';
const socket = io.connect(server);

const Main = () => {
  const [userName, setUserName] = useState('Marcus');
  const [room, setRoom] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  function joinRoom(e) {
    if (room) leaveRoom()
    setRoom(e.target.textContent)
    socket.emit('join_room', { userName, room: e.target.textContent });
  }

  function leaveRoom() {
    socket.emit('leave_room', { userName, room });
    setRoom("")
  }

  socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
  });

  return (
    <div>
      <h1>Inloggad</h1>
      <div>
        <p onClick={joinRoom}>JavaScript-snack</p>
      </div>
      {room ?
      <Chat socket={socket} userName={userName} room={room}/> :
      "<p>hej</p>"
      }
      {/* <input type="text" placeholder="Name" onChange={handleNameChange} /> */}
      {/* <input type="text" placeholder="Room-id" onChange={handleRoomChange} /> */}
      {/* <button onClick={joinRoom}>Join room</button> */}
      <button onClick={leaveRoom}>Leave room</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Main;
