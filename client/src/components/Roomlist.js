import { useState } from 'react'

function Roomlist({onRoomChange, userName}) {
  // TODO get list of rooms from backend 
  const [rooms, setRooms ] = useState(["Rum 1", "Rum 2"])
  
  return (
    <div>
      {rooms.map((room) => {
        return <p onClick={onRoomChange}>{room}</p>
      })}
    </div>
  )
}

export default Roomlist