import socketClient from "socket.io-client";
import logo from './logo.svg';
import './App.css';

const server = "http://localhost:4000";
const socket = socketClient(server);

function App() {
  socket.on('connection', () => {
      console.log(`I'm connected with the back-end`);
});

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
