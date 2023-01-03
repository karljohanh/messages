import { ListItem } from '@mui/material';
import { ListItemText } from "@mui/material"
import { ListItemAvatar } from "@mui/material"
import { Avatar } from '@mui/material';
import { Typography } from '@mui/material';

function User({ user }) {
  return (
    <ListItem>
      <ListItemAvatar >
        <Avatar sx={{ bgcolor: "blue" }}>{user.userName[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText 
        primary={
          <>
            <Typography sx={{ display: "inline" }}>
              {user.userName}
            </Typography>
          </>
        }
      />
    </ListItem>
  )
}

function UserList({ allUsers }) {
  return (
    <>
      {allUsers.map((user) => {
        return <User key={user.id} user={user}/>
      })}
    </>
  )
}

export default UserList