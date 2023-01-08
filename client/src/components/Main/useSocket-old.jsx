import { useEffect, useState, useMemo } from "react";
import { io } from 'socket.io-client';

const socket = io("http://localhost:5005/").connect();

export default function useSocket() {
  const [rooms, setRooms] = useState({});
  const [notifications, setNotifications] = useState({});
  const [currentRoom, setCurrentRoom] = useState(null);
  const userName = "Marcus"

  useEffect(() => {
    console.log("socket use effect 1")
    socket.emit("join_room", {userName, room: "all"})
    socket.on("list_chatRooms", (allRooms) => {
      let tempRooms = {}
      allRooms.forEach(room => {
          tempRooms[room] = []
      });
      setRooms(tempRooms)
    })
  }, [])
  

  useEffect(() => {
    console.log("socket use effect 2")
      socket.on('receive_message', ({ room, ...message }) => {
        console.log("new message: ", message, " from room: ", room)
        setRooms(rooms => {
          const messages = [...(rooms[room] || []), message];
          console.log("here are messages ", messages)
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

  function sendMessage(message) {
    const createdTime = Date.now()
    socket.emit('send_message', { userName, room: currentRoom, message, createdTime });
  }

  // const sendMessage = message => socket.emit('send_message', { room: currentRoom, message });

  return [rooms, notifications, setNotifications, sendMessage, currentRoom, setCurrentRoom];
};