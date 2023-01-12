import {
  List,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  ListItemButton,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../App';

const Users = ({ socket, setCurrentRoom }) => {
  const [users, setUsers] = useState([]);
  const userContext = useContext(UserContext);

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket, users]);

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      {users.map((user) => (
        <ListItemButton
          key={user.socketID}
          sx={{
            px: '3.8rem',
          }}
          onClick={() => {
            setCurrentRoom(user.username + '/' + userContext.username);
            socket.emit('private_message', {
              toID: user.socketID,
              toUsername: user.username,
              fromUsername: userContext.username,
            });
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: '#393939' }}>{user.username[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Typography sx={{ display: 'inline' }}>
                  {user.username}
                </Typography>
              </>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );
};

export default Users;
