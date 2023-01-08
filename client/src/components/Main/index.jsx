import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { List, Stack, TextField } from '@mui/material';

import Message from "./Message"


const socket = io("http://localhost:5005/").connect();

const MessageList = ({messages}) => {
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

const SendMessage = ({userName, room}) => {
    const [ message, setMessage ] = useState("")

    function send(e) {
        if (message) {
          const createdTime = Date.now()
          socket.emit('send_message', { userName, room, message, createdTime });
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

    useEffect(() => {
    //   socket.on("list_chatRooms", (allRooms) => {
    //     let tempRooms = {}
    //     allRooms.forEach(room => {
    //         tempRooms[room] = []
    //     });
    //     setRooms(tempRooms)
    //   })
    }, [])
    
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
            console.log("here, cr: ", currentRoom)
            if (currentRoom) {

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
                
            }

      }, [currentRoom]);

    // useEffect(() => {
    //         setNotifications(notifications => ({
    //           ...notifications,
    //           [currentRoom]: 0
    //         }));
    // }, [currentRoom])
    

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
        <SendMessage userName={userName} room={currentRoom}/>
      </Stack>
      <Stack flex="1">
      </Stack>
    </Stack>
  );
};

export default Main;
