import { useState} from 'react'

function SendMessage ({ socket, userName, room }) {
  const [message, setMessage] = useState('');

  function send(e) {
    e.preventDefault()
    if (message) {
      const createdTime = Date.now()
      socket.emit('send_message', { userName, room, message, createdTime });
      setMessage('');
    }
  }
    
  return (
    <div>
      <form onSubmit={send}>
      <input onChange={(e) => {setMessage(e.target.value)}} placeholder='Skriv här' value={message}/>
      <button>Skicka</button>
      </form>
    </div>
  )
}

export default SendMessage 