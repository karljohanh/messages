import { useState } from 'react';
import { io } from 'socket.io-client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Chat from '../Chat';

const server = 'http://localhost:5005/';
const socket = io.connect(server);

const Main = () => {
  const [ userName, setUserName] = useState('Marcus');
  // const [ user, setUser ] = ({userName:"Marcus"})
  const [ allUsers, setAllUsers ] = useState([])
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

  socket.on("chatroom_users", (users) => {
    console.log("all users: ", allUsers)
    setAllUsers(users)
  })

  function User({name}) {
    return (
      <p>{name}</p>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item sm={3}>
          <p onClick={joinRoom}>JavaScript</p>
        </Grid>
        <Grid item sm={6}>
          {room && <Chat socket={socket} userName={userName} room={room}/>}
        </Grid>
        <Grid item sm={3}>
          {allUsers && allUsers.map((user) => {
            return <User key={user.id} name={user.userName} />
          })}
        </Grid>
        <button onClick={handleLogout}>Log Out</button>
      </Grid>
    </Box>
  );
};

export default Main;
