import List from '@mui/material/List';
import Messages from './Messages';
import SendMessage from "./SendMessage "


function Chat({ socket, userName, room }) {
  return (
    <List sx={{ justifyContent: "end", display: "flex", flexDirection: "column", height: "100vh", boxSizing: "border-box"}}>
        <Messages socket={socket}/>
        <SendMessage socket={socket} userName={userName} room={room} />
    </List>
  )
}

export default Chat