import { useState } from 'react';
import { io } from 'socket.io-client';
import Stack from "@mui/material/Stack"

import Messages from './Messages';
import SendMessage from "./SendMessage"
import UserList from './UserList';
import { Typography } from '@mui/material';
import { useEffect } from 'react';

const server = 'http://localhost:5005/';
const socket = io.connect(server);

const Main = ({userName}) => {
  const [ allUsers, setAllUsers ] = useState([])
  const [ allRooms, setAllRooms ] = useState([])
  const [ room, setRoom ] = useState('');
  const [ messageLog, setMessageLog ] = useState([])

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  function joinRoom(e) {
    if (room) {
      socket.emit('leave_room', { userName, room });
      setRoom("")
    }
    setRoom(e.target.textContent)
    socket.emit('join_room', { userName, room: e.target.textContent });
  }

  socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
  });

  socket.on("list_chatRooms", (data) => {
    setAllRooms(data)

    const newL = data.map((room) =>  {
      return { room, messages: []}
    })
    setMessageLog(newL)
  })

  socket.on("chatroom_users", (users) => {
    setAllUsers(users)
  })
  
  return (
    <Stack direction="row">
      <Stack flex="1">
        {allRooms.map((room) => {
          return <Typography onClick={joinRoom}>{room}</Typography>
        })}
        <button onClick={handleLogout}>Log Out</button>
        {/* <button onClick={leaveRoom}>Leave room</button> */}
      </Stack>
      <Stack sx={{height:"100vh"}} flex="3" >
        <Messages socket={socket} messageLog={messageLog} setMessageLog={setMessageLog} currentRoom={room} />
        <SendMessage socket={socket} userName={userName} room={room} />
      </Stack>
      <Stack flex="1">
        {room && <UserList allUsers={allUsers}/>}
      </Stack>
    </Stack>
  );
};

export default Main;
