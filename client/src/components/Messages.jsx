import { useState, useEffect } from 'react'
import { ListItem } from '@mui/material';
import { ListItemText } from "@mui/material"
import { ListItemAvatar } from "@mui/material"

import Avatar from '@mui/material/Avatar';

// Kolla hur
import Typography from '@mui/material/Typography';

function formatDateFromTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function Message({msg}) {
  return (
      <ListItem>
        <ListItemAvatar >
          <Avatar sx={{ bgcolor: "blue" }}>{msg.userName[0]}</Avatar>
        </ListItemAvatar>
        <ListItemText 
          primary={
            <>
              <Typography sx={{ display: "inline" }}>
                {msg.userName}
              </Typography>
              <Typography sx={{ display: "inline", fontSize: "12px", marginLeft: 2 }}>
                {formatDateFromTimestamp(msg.createdTime)}
              </Typography>
            </>
          }
          secondary={
            <Typography>
              {msg.message}
            </Typography>
          }
        />
      </ListItem>
  )
} 

function Messages({socket}) {
    const [messagesRecieved, setMessagesReceived] = useState([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {

          setMessagesReceived((state) => [
            ...state,
            {
              message: data.message,
              userName: data.userName,
              createdTime: data.createdTime,
            },
          ]);
        });
    
        // Remove event listener on component unmount
        return () => socket.off('receive_message');
      }, [socket]);

    return (
      <>
        {messagesRecieved.map((msg) => (
          <Message msg={msg} key={msg.createdTime + msg.message}/>
      ))}
      </>
    
  )
}

export default Messages