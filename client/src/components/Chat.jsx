import Messages from './Messages';
import SendMessage from "./SendMessage "


function Chat({ socket, userName, room }) {
  return (
    <div>
        <Messages socket={socket}/>
        <SendMessage socket={socket} userName={userName} room={room} />
    </div>
  )
}

export default Chat