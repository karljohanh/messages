import React, { useState } from 'react';
import {
  List,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemButton,
} from '@mui/material';

const Rooms = ({ rooms, handleChangeRoom, notifications }) => {
  const [selectedIndex, setSelectedIndex] = useState('JavaScript');

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
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
            <ListItemButton
              key={room}
              selected={selectedIndex === room}
              onClick={(event) => {
                handleChangeRoom(room);
                handleListItemClick(event, room);
              }}
              sx={{
                px: '2.7rem',
              }}
            >
              <ListItemAvatar>
                <Avatar>{room.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={room}
                secondary={notifications[room] || ''}
              />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );
};

export default Rooms;
