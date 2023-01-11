import { List, Typography } from '@mui/material';

import Message from './Message';

const MessageList = ({ messages, room }) => {
    return (
        <List sx={{ flexGrow: '1', padding: '0', overflowY: 'scroll' }}>
            <Typography
                variant='h3'
                sx={{ textAlign: 'center', fontWeight: 'light' }}
            >
                {/* {room.toUpperCase()} */}
            </Typography>
            {messages.map((message, i) => {
                return (
                    <Message
                        msg={message}
                        key={message.createdTime + message.message + i}
                    />
                );
            })}
        </List>
    );
};
export default MessageList;
