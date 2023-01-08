import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { List, Stack, TextField } from '@mui/material';

import Message from "./Message"
import useSocket from "./useSocket"


// const socket = io("http://localhost:5005/").connect();

const MessageList = ({messages}) => {
    console.log("messages: ", messages)
    return (
        <List sx={{flexGrow:"1", overflowY:"scroll"}}>
            {messages.map((message, i) => {
                return (
                    <Message msg={message} key={message.createdTime + message.message + i}/>
                )
            })}
        </List>
    )
}

const SendMessage = ({room, sendMessage}) => {
    const [ message, setMessage ] = useState("")

    function send(e) {
        if (message) {
        //   const createdTime = Date.now()
        //   socket.emit('send_message', { userName, room, message, createdTime });
            sendMessage(message)
          setMessage('');
        }
      }
        
      return (
          <TextField
            sx={{
              width: "100%",
            }}
            id="outlined-basic" 
            multiline 
            onChange={(e) => {setMessage(e.target.value)}}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                send()
              }
            }}
            placeholder={`Skicka meddelande till #${room}`}
            value={message}
            variant="outlined" 
          />
      )
}

const Main = () => {
    const [rooms, notifications, setNotifications, sendMessage, currentRoom, setCurrentRoom] = useSocket();

    console.log("i main rooms[currentRoom]: ", rooms[currentRoom])

    const handleChangeRoom = room => {
        setCurrentRoom(room);
        setNotifications(notifications => {
          const newNotifications = { ...notifications };
          delete newNotifications[room];
          return newNotifications;
        });
      };

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
        <SendMessage room={currentRoom} sendMessage={sendMessage}/>
      </Stack>
      <Stack flex="1">
      </Stack>
    </Stack>
  );
};

export default Main;
