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
  const [currentRoom, setCurrentRoom] = useState('JavaScript');

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
    //Detta är nytt
    socket.on('connect', () => {
      localStorage.setItem('userName', userContext.username);
      socket.emit('newUser', {
        username: userContext.username,
        socketID: socket.id,
      });
    });

    socket.emit('join_room');
    socket.on('list_chatRooms', (allRooms) => {
      let tempRooms = {};
      allRooms.forEach((room) => {
        tempRooms[room] = [];
      });
      setRooms(tempRooms);
    });
  }, [userContext]);

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
        flexDirection: 'row',
        width: 'inherit',
        m: '10px 0',
      }}
    >
      <Stack
        flex="1"
        sx={{
          boxShadow: 5,
          borderRadius: '5px',
          m: '0 1rem',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Rooms
          rooms={rooms}
          handleChangeRoom={handleChangeRoom}
          notifications={notifications}
          handleLogout={handleLogout}
        />
      </Stack>
      <Stack flex="6" sx={{ boxShadow: 5, borderRadius: '5px' }}>
        <MessageList messages={rooms[currentRoom] || []} room={currentRoom} />
        <SendMessage room={currentRoom} socket={socket} />
      </Stack>
      <Stack
        flex="1"
        sx={{
          boxShadow: 5,
          borderRadius: '5px',
          m: '0 1rem',
          backgroundColor: '#f5f5f5',
        }}
      >
        {socket && <Users socket={socket} />}
      </Stack>
    </Stack>
  );
};

export default Main;
