import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Stack } from '@mui/material';

import MessageList from './MessageList';
import SendMessage from './SendMessage';
import Rooms from './Rooms';
import Users from './Users';
import { UserContext } from '../../App';

let socket;

const Main = () => {
  const userContext = useContext(UserContext);
  const [rooms, setRooms] = useState({});
  const [notifications, setNotifications] = useState({});
  const [currentRoom, setCurrentRoom] = useState('');

  const navigate = useNavigate();

  function handleChangeRoom(room) {
    setCurrentRoom(room);
    setNotifications((notifications) => ({
      ...notifications,
      [room]: 0,
    }));
  }

  const handleLogout = async (event) => {
    event.preventDefault();

    await fetch('/api/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    navigate(0);
  };

  // Just nu går man med i alla rum här
  useEffect(() => {
    socket = io('http://localhost:5005/').connect();
    socket.emit('join_room');
    socket.on('list_chatRooms', (allRooms) => {
      let tempRooms = {};
      allRooms.forEach((room) => {
        tempRooms[room] = [];
      });
      setRooms(tempRooms);
    });
    localStorage.setItem('userName', userContext.username);
    console.log(socket.id);
    socket.emit('newUser', {
      username: userContext.username,
      socketID: socket.id,
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on('receive_message', ({ room, ...message }) => {
      console.log('receive_message: ', message);
      setRooms((rooms) => {
        const messages = [...(rooms[room] || []), message];
        return { ...rooms, [room]: messages };
      });
      if (room !== currentRoom) {
        setNotifications((notifications) => ({
          ...notifications,
          [room]: (notifications[room] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off('receive_message');
    };
    // eslint-disable-next-line
  }, [currentRoom]);

  return (
    <Stack
      sx={{
        mt: '1rem',
        mb: '1rem',
        flexDirection: 'row',
        width: '90vw',
      }}
    >
      <Stack flex="1">
        <Rooms
          rooms={rooms}
          handleChangeRoom={handleChangeRoom}
          notifications={notifications}
          handleLogout={handleLogout}
        />
      </Stack>
      <Stack flex="3">
        <MessageList messages={rooms[currentRoom] || []} />
        <SendMessage room={currentRoom} socket={socket} />
      </Stack>
      <Stack flex="1">
        <Users />
      </Stack>
    </Stack>
  );
};

export default Main;
