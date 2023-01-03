import Messages from './Messages';
import SendMessage from "./SendMessage "


function Chat({ socket, userName, room }) {
  return (
    <>
        <Messages socket={socket}/>
        <SendMessage socket={socket} userName={userName} room={room} />
    </>
  )
}

export default Chat