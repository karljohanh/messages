import { useState, useEffect } from "react";
import { io } from 'socket.io-client';

export default function useSocket(url) {
    const [rooms, setRooms] = useState({});
    const [notifications, setNotifications] = useState({});
    const [currentRoom, setCurrentRoom] = useState(null);

    const socket = io(url).connect();
  
    useEffect(() => {
      socket.on('message', ({ room, message }) => {
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
      return () => socket.disconnect();
    }, [socket, currentRoom]);
  
    const sendMessage = message => socket.emit('message', { room: currentRoom, message });
  
    return [rooms, notifications, sendMessage, currentRoom, setCurrentRoom];
  };