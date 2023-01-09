import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { io } from 'socket.io-client';
import { Stack } from '@mui/material';

import MessageList from "./MessageList"
import SendMessage from "./SendMessage"
import Rooms from "./Rooms"

const Main = () => {
    const socket = io("http://localhost:5005/").connect();
    const [rooms, setRooms] = useState({});
    const [notifications, setNotifications] = useState({});
    const [currentRoom, setCurrentRoom] = useState("");

    const navigate = useNavigate()

    function handleChangeRoom(room) {
      setCurrentRoom(room);
      setNotifications(notifications => ({
        ...notifications,
        [room]: 0
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
    navigate(0)
  };
    
    // Just nu går man med i alla rum här
    useEffect(() => {
      console.log("kör")
      socket.emit("join_room")
      socket.on("list_chatRooms", (allRooms) => {
        console.log(allRooms)
        let tempRooms = {}
        allRooms.forEach(room => {
            tempRooms[room] = []
        });
        setRooms(tempRooms)
      })
    }, [])
    
    useEffect(() => {
      socket.on('receive_message', ({ room, ...message }) => {
          console.log("receive_message: ", message)
        setRooms(rooms => {
          const messages = [...(rooms[room] || []), message];
          return { ...rooms, [room]: messages };
        });
        if (room !== currentRoom) {
          setNotifications(notifications => ({
            ...notifications,
            [room]: (notifications[room] || 0) + 1
          }));
        }
      });
      
      return () => {
        socket.off('receive_message');
      };
    }, [currentRoom]);

  return (
    <Stack direction="row" style={{height: "100vh"}}>
      <Stack flex="1">
        <Rooms rooms={rooms} handleChangeRoom={handleChangeRoom} notifications={notifications} handleLogout={handleLogout}/>
      </Stack>
      <Stack flex="3" sx={{height: "95%"}}>
        <MessageList messages={rooms[currentRoom] || []} />
        <SendMessage room={currentRoom} socket={socket}/>
      </Stack>
      <Stack flex="1">
      </Stack>
    </Stack>
  );
};

export default Main;