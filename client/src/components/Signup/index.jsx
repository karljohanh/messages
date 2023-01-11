import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Signup() {
  const [values, setValues] = useState({
    username: '',
    password: '',
    repeatPassword: '',
    showPassword: false,
    showRepeatPassword: false,
  });
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    repeatPassword: false,
    fetchError: false,
    fetchErrorMsg: '',
  });

  const handleChange = (fieldName) => (event) => {
    const currValue = event.target.value;
    //eslint-disable-next-line
    switch (fieldName) {
      case 'username':
        validator.isAlphanumeric(currValue)
          ? setErrors({ ...errors, username: false })
          : setErrors({ ...errors, username: true });
        break;

      case 'password':
        regexPassword.test(currValue)
          ? setErrors({ ...errors, password: false })
          : setErrors({ ...errors, password: true });
        break;

      case 'repeatPassword':
        currValue === values.password
          ? setErrors({ ...errors, repeatPassword: false })
          : setErrors({ ...errors, repeatPassword: true });
        break;
    }
    setValues({ ...values, [fieldName]: event.target.value });
  };

  const handleShowPassword = (showPasswordField) => {
    setValues({
      ...values,
      [showPasswordField]: !values[showPasswordField],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('/api/register', {
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
        repeatPassword: '',
        showPassword: false,
        showRepeatPassword: false,
      });
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
        maxWidth="sm"
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
            <Typography variant="h4" sx={{ my: '1rem' }}>
              REGISTER NEW ACCOUNT
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
              helperText={errors.username && 'Please insert a valid username.'}
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
                      onClick={() => handleShowPassword('showPassword')}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormHelperText error={errors.password}>
              Password must be at least 8 characters.
            </FormHelperText>

            <TextField
              variant="outlined"
              type={values.showRepeatPassword ? 'text' : 'password'}
              label="Repeat Password"
              value={values.repeatPassword}
              onChange={handleChange('repeatPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleShowPassword('showRepeatPassword')}
                      edge="end"
                    >
                      {values.showRepeatPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {values.repeatPassword.length > 8 && errors.repeatPassword && (
              <Typography
                variant="p"
                sx={{ textAlign: 'center', fontSize: '12px', color: 'red' }}
              >
                Password must be the same as above
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
                type="submit"
                sx={{
                  minWidth: '70%',
                }}
              >
                Sign me up!
              </Button>
            </Box>
            {errors.fetchError && (
              <FormHelperText error>{errors.fetchErrorMsg}</FormHelperText>
            )}
            <Divider />
            <Typography paragraph align="center">
              Already have an account?{' '}
              <Link component={RouterLink} to="/">
                Login here
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default Signup;
