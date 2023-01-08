import { useState } from "react"
import { TextField } from '@mui/material';

const SendMessage = ({userName, room, socket}) => {
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
export default SendMessage