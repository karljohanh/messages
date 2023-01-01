import { useState, useEffect } from 'react'

function Messages({socket}) {
    const [messagesRecieved, setMessagesReceived] = useState([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
          console.log(data);
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

      function formatDateFromTimestamp(timestamp) {
        console.log(timestamp)
        const date = new Date(timestamp);
        return date.toLocaleString();
      }

    return (
      <div>
        {messagesRecieved.map((msg, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span >{msg.userName}</span>
            <span >
              {formatDateFromTimestamp(msg.createdTime)}
            </span>
          </div>
          <p>{msg.message}</p>
          <br />
        </div>
      ))}
      </div>
    
  )
}

export default Messages