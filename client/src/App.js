import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import Chat from './components/Chat';
import Roomlist from './components/Roomlist';
import './App.css';

const server = 'http://localhost:4000';
const socket = io.connect(server);

function App() {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');

  // When new room is selected -> join new room
  useEffect(() => {
    if (room) joinRoom()
  }, [room])

  function joinRoom() {
    if (userName) {
      socket.emit('join_room', { userName, room });
    }
  }

  function handleNameChange(e) {
    setUserName(e.target.value);
  }

  function handleRoomChange(e) {
    console.log(e.target.textContent)
    setRoom(e.target.textContent);
  }

  socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
  });

  return (
    <div className="App">
      <Roomlist onRoomChange={handleRoomChange} userName={userName}/>
      <input type="text" placeholder="Name" onChange={handleNameChange} />
      {room? <Chat socket={socket} userName={userName} room={room} setRoom={setRoom}/> : ""}
    </div>
  );
}

export default App;
