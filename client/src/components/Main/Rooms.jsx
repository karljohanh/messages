import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';

const Rooms = ({ rooms, handleChangeRoom, notifications }) => {
  return (
    <>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'center',
        }}
      >
        {Object.keys(rooms).map((room) => {
          return (
            <ListItem
              key={room}
              onClick={() => handleChangeRoom(room)}
              sx={{
                '&:hover': { cursor: 'pointer' },
              }}
            >
              <ListItemAvatar>
                <Avatar>{room.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={room}
                secondary={notifications[room] || ''}
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default Rooms;
