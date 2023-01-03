import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Stack } from '@mui/system';
import { Grid, TextField, Button, Typography } from '@mui/material';
import logo from '../../assets/chatlogo.png';

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:4000/api/auth';
      const { data: res } = await axios.post(url, data);
      localStorage.setItem('token', res.data);
      window.location = '/';
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
        <Link to="/signup">
          <Button variant="outlined" type="button">
            Sign Up
          </Button>
        </Link>
      </Box>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '75vh' }}
      >
        <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
          <img src={logo} alt="logo" />
          <Stack spacing={2} direction="row">
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="Email"
              type="email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
            />
            <TextField
              variant="outlined"
              id="outlined-basic"
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
            />
            <Button variant="contained" type="submit">
              Login
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

export default Login;
