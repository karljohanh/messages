import { useState } from "react"
import io from "socket.io-client";

import Chat from "./components/Chat"
import './App.css';

const server = "http://localhost:4000";
const socket = io.connect(server)

function App() {
  const [userName, setUserName] = useState("")
  const [room, setRoom] = useState("")

  function joinRoom() {
    if (userName && room) {
      socket.emit("join_room", room)
    }
  }

  function handleNameChange(e) {
    setUserName(e.target.value)
  }
  function handleRoomChange(e) {
    if (userName)
    setRoom(e.target.value)
  }

  socket.on('connection', () => {
      console.log(`I'm connected with the back-end`);
});

  return (
    <div className="App">
      <h1>Join room</h1>
      <input type="text" placeholder="Name" onChange={handleNameChange}/>
      <input type="text" placeholder="Room-id" onChange={handleRoomChange}/>
      <button onClick={joinRoom}>Join room</button>
      <Chat socket={socket} userName={userName} room={room}/>
    </div>
  );
}



export default App;
