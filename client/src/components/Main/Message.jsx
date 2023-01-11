import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { ListItemAvatar } from '@mui/material';
import { Avatar } from '@mui/material';
import { Typography } from '@mui/material';

function formatDateFromTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

export default function Message({ msg }) {
  return (
    <ListItem alignItems="flex-start" sx={{ maxWidth: '60vw' }}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: '#393939' }}>{msg.userName[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography sx={{ display: 'inline' }}>{msg.userName}</Typography>
            <Typography
              sx={{ display: 'inline', fontSize: '12px', marginLeft: 2 }}
            >
              {formatDateFromTimestamp(msg.createdTime)}
            </Typography>
          </>
        }
        secondary={
          <Typography sx={{ wordWrap: 'break-word' }}>{msg.message}</Typography>
        }
      />
    </ListItem>
  );
}
