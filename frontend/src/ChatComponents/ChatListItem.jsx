import * as React from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import AvatarWithStatus from './AvatarWithStatus';
import { toggleMessagesPane } from '../../utils';
import { useAuth } from '../components/Auth';
import { db } from '../components/firebase';
import { doc , updateDoc } from 'firebase/firestore';


export default function ChatListItem({chat, setSelectedChat ,selectedChat,allChats}) {
  const {changeChat,userData} = useAuth()

  console.log(chat)
  console.log(allChats)

  const handleSelect=async(chat)=>{
    try {
      const userChats = allChats.map((item)=>{
        const {user , ...rest } = item;
        return rest
      }
    )

      const chatIndex = userChats.findIndex(item=>item.chatId === chat.chatId);

      userChats[chatIndex].isSeen=true;

      const userChatsRef = doc(db, "userchats" , userData.id);

      await updateDoc(userChatsRef,{
        chats:userChats,
      })
      changeChat(chat.chatId , chat.user)


    } catch (error) {
     console.log(error) 
    }
  }

  const handleClick=()=>{
    handleSelect(chat); 
    setSelectedChat(chat.chatId); 
  }

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={handleClick}
          color="neutral"
          sx={{
            flexDirection: 'column',
            alignItems: 'initial',
            gap: 1,
          }}
>
          <Stack direction="row" spacing={1.5}>
            <AvatarWithStatus  userImg = {chat?.user.avatar} />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{chat?.user.name}</Typography>
              <Typography level="body-sm">{chat?.user.email}</Typography>
            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: 'right',
              }}
            >
             {!chat?.isSeen && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                display={{ xs: 'none', md: 'block' }}
                noWrap
              >
                5 mins ago
              </Typography>
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginLeft:"45px"
            }}
          >
          {chat?.lastMessage}   
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}
