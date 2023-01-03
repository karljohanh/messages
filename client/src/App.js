import { Route, Routes, Navigate } from 'react-router-dom';
import Main from './components/Main';
import Signup from './components/Signup';
import Login from './components/Login';
import { useState } from 'react';

function App() {
  // const user = localStorage.getItem('token');
  const [user, setUSer] = useState(localStorage.getItem('token'))
  const [ userName, setUserName ] = useState("")
  
  function updateStorage(data) {
    localStorage.setItem('token', data)
    setUSer({"token": data})
  }

  return (
    <Routes>
      {user && userName && <Route path="/" exact element={<Main userName={userName}/>} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login setUserName={setUserName} updateStorage={updateStorage}/>} />
      <Route path="/" exact element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
