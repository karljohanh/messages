import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import validator from 'validator';
import { regexPassword } from '../../utils';

import {
  Paper,
  Container,
  Link,
  Stack,
  Button,
  Box,
  Divider,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// eslint-disable-next-line
function Login({}) {
  const [values, setValues] = useState({
    username: '',
    password: '',
    showPassword: false,
  });
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    fetchError: false,
    fetchErrorMsg: '',
  });
  const navigate = useNavigate();

  const handleChange = (fieldName) => (event) => {
    const currValue = event.target.value;
    let isCorrectValue =
      fieldName === 'username'
        ? validator.isAlphanumeric(currValue)
        : regexPassword.test(currValue);

    isCorrectValue
      ? setErrors({ ...errors, [fieldName]: false })
      : setErrors({ ...errors, [fieldName]: true });

    setValues({ ...values, [fieldName]: event.target.value });
  };

  const handleShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        return setErrors({
          ...errors,
          fetchError: true,
          fetchErrorMsg: error.msg,
        });
      }

      const data = await res.json();

      setErrors({
        ...errors,
        fetchError: true,
        fetchErrorMsg: data.msg,
      });
      setValues({
        username: '',
        password: '',
        showPassword: false,
      });
      navigate(0);
      return;
    } catch (error) {
      setErrors({
        ...errors,
        fetchError: true,
        fetchErrorMsg:
          'There was a problem with our server, please try again later',
      });
    }
  };

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{ justifySelf: 'center', alignSelf: 'center' }}
      >
        <Paper elevation={6}>
          <Container
            maxWidth="sm"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h3" sx={{ my: '1rem' }}>
              LOGIN
            </Typography>
          </Container>
          <Stack
            component="form"
            onSubmit={handleSubmit}
            noValidate
            spacing={6}
            sx={{ bgcolor: '#f5f5f6', padding: '40px' }}
          >
            <TextField
              variant="outlined"
              type="username"
              label="Username"
              value={values.username}
              onChange={handleChange('username')}
              error={errors.username}
            />

            <TextField
              variant="outlined"
              type={values.showPassword ? 'text' : 'password'}
              label="Password"
              value={values.password}
              onChange={handleChange('password')}
              error={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.fetchError && (
              <Typography
                variant="p"
                sx={{
                  textAlign: 'center',
                  color: 'red',
                }}
              >
                {errors.fetchErrorMsg}
              </Typography>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                size="large"
                type="button"
                disabled={errors.username || errors.password}
                onClick={handleSubmit}
                sx={{
                  minWidth: '70%',
                }}
              >
                Login
              </Button>
            </Box>

            <Divider />

            <Typography paragraph align="center">
              Don't have an account yet?{' '}
              <Link component={RouterLink} to="/signup">
                Sign up here
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default Login;
