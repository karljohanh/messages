import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Stack } from '@mui/material';

import MessageList from "./MessageList"
import SendMessage from "./SendMessage"

const socket = io("http://localhost:5005/").connect();

const Main = ({userName = "Marcus"}) => {
    const [rooms, setRooms] = useState({});
    const [notifications, setNotifications] = useState({});
    const [currentRoom, setCurrentRoom] = useState("");

    function handleChangeRoom(room) {
        setCurrentRoom(room);
        setNotifications(notifications => ({
          ...notifications,
          [room]: 0
        }));
    }
    
    // Just nu går man med i alla rum här
    useEffect(() => {
      socket.emit("join_room", {userName, room: currentRoom})
      socket.on("list_chatRooms", (allRooms) => {
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
    <Stack direction="row">
      <Stack flex="1">
        {Object.keys(rooms).map((room) => {
            return (
                <>
                <button onClick={() => handleChangeRoom(room)}>{room}</button>
                <p>{notifications[room] || ""}</p>
                </>
            )
        })}
      </Stack>
      <Stack sx={{height:"100vh"}} flex="3" >
        <MessageList messages={rooms[currentRoom] || []} />
        <SendMessage userName={userName} room={currentRoom} socket={socket}/>
      </Stack>
      <Stack flex="1">
      </Stack>
    </Stack>
  );
};

export default Main;
