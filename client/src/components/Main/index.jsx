import Chat from '../Chat';
import { io } from 'socket.io-client';

const Main = () => {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  function joinRoom() {
    if (userName && room) {
      socket.emit('join_room', room);
    }
  }

  function leaveRoom() {
    socket.emit('leave_room', { userName, room });
  }

  function handleNameChange(e) {
    setUserName(e.target.value);
  }
  function handleRoomChange(e) {
    if (userName) setRoom(e.target.value);
  }

  socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);
  });

  const server = 'http://localhost:5005/';
  const socket = io.connect(server);

  return (
    <div>
      <h1>Inloggad</h1>
      <Chat socket={socket} userName={userName} room={room} />
      <input type="text" placeholder="Name" onChange={handleNameChange} />
      <input type="text" placeholder="Room-id" onChange={handleRoomChange} />
      <button onClick={joinRoom}>Join room</button>
      <button onClick={leaveRoom}>Leave room</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Main;
