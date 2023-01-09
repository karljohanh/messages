import React from 'react'
import { Stack } from '@mui/material';

const Rooms = ({rooms, handleChangeRoom, notifications, handleLogout}) => {
  return (
    <>
      {Object.keys(rooms).map((room) => {
        return (
          <React.Fragment key={room}>
          <button  onClick={() => handleChangeRoom(room)}>{room}</button>
          <p>{notifications[room] || ""}</p>
          </React.Fragment>
        )
      })}
      <button onClick={handleLogout}>Log Out</button>
  </>
  )
}

export default Rooms