import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Container } from '@mui/system';
import { useContext } from 'react';
import { UserContext } from '../../App';

const Navigation = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    await fetch('/api/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    navigate(0);
  };

  return (
    <Paper elevation={1} square>
      <Container
        maxWidth={false}
        sx={{
          height: '5vh',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginTop: '-5px', fontWeight: 'light' }}
        >
          messages
        </Typography>
        <Button
          id="profile-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {userContext.username && userContext.username}
          {!userContext.username && <p>Welcome</p>}
        </Button>
        {userContext.username && (
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'profile-button',
            }}
          >
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </Menu>
        )}
      </Container>
    </Paper>
  );
};

export default Navigation;
