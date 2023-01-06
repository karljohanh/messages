import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Main from './components/Main';

import { UserContext } from './App';

function RoutesComp() {
  const userContext = useContext(UserContext);
  return (
    <>
      <Routes>
        {userContext.username && (
          <Route
            path="/"
            element={
              <>
                Welcome {userContext.username}
                <Main></Main>
              </>
            }
          />
        )}
        {!userContext.username && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default RoutesComp;
