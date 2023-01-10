import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const Users = ({ socket }) => {
  const [users, setUsers] = useState([]);

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
        <ListItem key={user.socketID}>
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
        </ListItem>
      ))}
    </List>
  );
};

export default Users;
