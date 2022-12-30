import Chat from '../Chat';
import { io } from 'socket.io-client';

const Main = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const server = 'http://localhost:5005/';
  const socket = io.connect(server);

  return (
    <div>
      <h1>Inloggad</h1>
      <Chat socket={socket} userName={'chatUser'} room={'chatRoom'} />
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Main;
