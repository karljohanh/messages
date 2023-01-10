import { useState, useEffect, createContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation/Navigation';
import Routes from './Routes';
import { Container } from '@mui/system';

export const UserContext = createContext({});

function App() {
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState(true);

  useEffect(() => {
    const fetchUserAuth = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/isAuth');
        if (!res.ok) return setLoading(false);

        setUserSession(await res.json());
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('There was an error fetch auth', error);
        console.log('There was an error fetch auth');
        return;
      }
    };
    fetchUserAuth();
  }, []);

  return (
    <UserContext.Provider value={userSession}>
      <CssBaseline />
      <Navigation />
      <Container
        maxWidth={false}
        sx={{
          height: '95vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {loading ? <>loading...</> : <Routes />}
      </Container>
    </UserContext.Provider>
  );
}

export default App;
