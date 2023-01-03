import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/system';
import {
  Typography,
  CssBaseline,
  Button,
  Grid,
  TextField,
  Stack,
} from '@mui/material';

const Signup = () => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:4000/api/users';
      const { data: res } = await axios.post(url, data);
      navigate('/login');
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '1rem 1rem 0rem 1rem',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '2rem' }}>
          messages
        </Typography>
        <Link to="/login">
          <Button variant="outlined" type="button">
            Log in
          </Button>
        </Link>
      </Box>

      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ marginTop: '10rem', maxHeight: '90vh' }}
      >
        <Typography variant="h3">Create Account</Typography>
        <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
          <Stack
            spacing={2}
            direction="column"
            sx={{ width: '20rem', marginTop: '2rem' }}
          >
            <TextField
              variant="outlined"
              id="outlined-basic"
              type="text"
              label="First Name"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              required
            />
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="Email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
            />
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="Password"
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
            />

            <Button variant="contained" type="submit">
              Sign Up
            </Button>
          </Stack>
          {error && (
            <Stack alignItems="center">
              <p>{error}</p>
            </Stack>
          )}
        </Box>
      </Grid>
    </>
  );
};

export default Signup;
