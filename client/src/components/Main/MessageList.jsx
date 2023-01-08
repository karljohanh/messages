import { List } from '@mui/material';

import Message from "./Message"

const MessageList = ({messages}) => {
    return (
        <List sx={{flexGrow:"1", overflowY:"scroll"}}>
            {messages.map((message, i) => {
                return (
                    <Message msg={message} key={message.createdTime + message.message + i}/>
                )
            })}
        </List>
    )
}
export default MessageList