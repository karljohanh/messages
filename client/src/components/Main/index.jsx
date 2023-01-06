import { useState } from 'react';
import { io } from 'socket.io-client';
import Stack from '@mui/material/Stack';

import Messages from './Messages';
import SendMessage from './SendMessage';
import UserList from './UserList';

const server = 'http://localhost:5005/';
const socket = io.connect(server);

const Main = ({ userName }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [room, setRoom] = useState('');

  const handleLogout = async (event) => {
    event.preventDefault();

    fetch('/api/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  function joinRoom(e) {
    if (room) {
      socket.emit('leave_room', { userName, room });
      setRoom('');
    }
    setRoom(e.target.textContent);
    socket.emit('join_room', { userName, room: e.target.textContent });
  }

  socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
  });

  socket.on('chatroom_users', (users) => {
    console.log('updating users list: ', users);
    setAllUsers(users);
  });

  return (
    <Stack direction="row">
      <Stack flex="1">
        <p onClick={joinRoom}>JavaScript</p>
        <button onClick={handleLogout}>Log Out</button>
        {/* <button onClick={leaveRoom}>Leave room</button> */}
      </Stack>
      <Stack sx={{ height: '100vh' }} flex="3">
        <Messages socket={socket} />
        <SendMessage socket={socket} userName={userName} room={room} />
      </Stack>
      <Stack flex="1">{room && <UserList allUsers={allUsers} />}</Stack>
    </Stack>
  );
};

export default Main;
