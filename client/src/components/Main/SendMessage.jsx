import { useState, useContext } from 'react';
import { TextField } from '@mui/material';

import { UserContext } from '../../App';

const SendMessage = ({ room, socket }) => {
  const [message, setMessage] = useState('');
  const userContext = useContext(UserContext);

  function send(e) {
    if (message) {
      const createdTime = Date.now();
      socket.emit('send_message', {
        userName: userContext.username,
        room,
        message,
        createdTime,
      });
      setMessage('');
    }
  }

  return (
    <TextField
      sx={{
        width: '90%',
        alignSelf: 'center',
        mb: '1rem',
      }}
      id="outlined-basic"
      multiline
      onChange={(e) => {
        setMessage(e.target.value);
      }}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          send();
        }
      }}
      placeholder={`Skicka meddelande till #${room}`}
      value={message}
      variant="outlined"
    />
  );
};
export default SendMessage;
