import { Route, Routes, Navigate } from 'react-router-dom';
import Main from './components/Main';
import Signup from './components/Signup';
import Login from './components/Login';
import { useState } from 'react';

import useToken from './hooks/useToken';

function App() {
  const [ userName, setUserName ] = useState("")
  const { token, setToken } = useToken()

  return (
    <Routes>
      {token && <Route path="/" exact element={<Main userName={userName}/>} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login setUserName={setUserName} setToken={setToken}/>} />
      <Route path="/" exact element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
