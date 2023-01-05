import { useState } from 'react';

function useToken() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  function saveToken(userToken) {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  }
  return {
    setToken: saveToken,
    token,
  };
}
export default useToken;
