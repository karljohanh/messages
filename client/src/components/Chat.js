import{ useState, useEffect } from 'react'

function Chat({socket, userName, room}) {
    const [currentMessage, setCurrentMessage ] = useState("")

    function handleMessageChange(e) {
        setCurrentMessage(e.target.value)
    }

    async function sendMessage() {
        if (currentMessage) {
            const messageData = {
                room,
                author: userName,
                message: currentMessage,
                time: `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}`
            }
            await socket.emit("send_message", messageData)
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log("från useEffect: ", data)
        })
    }, [socket])

  return (
    <div>
        <div className='chat-header'>
            <p>Live chat</p>
        </div>
        <div className='chat-body'></div>
        <div className='chat-footer'>
            <input type="text" placeholder="Hey..." onChange={handleMessageChange}/>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}


export default Chat