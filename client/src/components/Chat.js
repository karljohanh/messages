import{ useState, useEffect } from 'react'

function Chat({socket, userName, room, setRoom}) {
    const [ currentMessage, setCurrentMessage ] = useState("")
    const [ allMessages, setAllMessages ] = useState([])

    function handleMessageChange(e) {
        setCurrentMessage(e.target.value)
    }

    async function sendMessage() {
        if (currentMessage) {
            const messageData = {
                room,
                author: userName,
                message: currentMessage,
                time: `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)}`
            }
            await socket.emit("send_message", messageData)
            // setAllMessages([...allMessages, messageData])
            console.log(allMessages)
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log("från useEffect: ", data)
            console.log(allMessages)
            setAllMessages([data, ...allMessages])
        })
    }, [socket, allMessages])

    function leaveRoom() {
        socket.emit('leave_room', { userName, room });
        setRoom("")
    }

  return (
    <div>
        <div className='chat-header'>
        <p>Room: {room}</p>
        </div>
        <div className='chat-body'>
        {allMessages.map((messageObj) => {
               return (<div key={messageObj.author + messageObj.message + messageObj.time}>
                <p>
                    {messageObj.message}
                </p>
                <p>
                    {messageObj.author}, {messageObj.time}
                </p>
                </div>)
            })}
        </div>
        <div className='chat-footer'>
            <input type="text" placeholder="Hey..." onChange={handleMessageChange}/>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
        <button onClick={leaveRoom}>Leave room</button>
    </div>
  )
}


export default Chat