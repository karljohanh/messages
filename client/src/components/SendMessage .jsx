import { useState} from 'react'
import TextField from '@mui/material/TextField';


function SendMessage ({ socket, userName, room }) {
  const [message, setMessage] = useState('');

  function send(e) {
    if (message) {
      const createdTime = Date.now()
      socket.emit('send_message', { userName, room, message, createdTime });
      setMessage('');
    }
  }
    
  return (
    <div>
      <form >
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
      </form>
    </div>
  )
}

export default SendMessage 