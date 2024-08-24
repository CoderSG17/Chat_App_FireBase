import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Box, Chip, IconButton, Input } from '@mui/joy';
import List from '@mui/joy/List';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatListItem from './ChatListItem';
import { toggleMessagesPane } from '../../utils';
import { useAuth } from '../Context/Auth';
import { db } from '../components/firebase';
import { doc, onSnapshot , getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';


export default function ChatsPane() {
  const { user } = useAuth();
  const [chats, setChats] = useState(); 
  const [selectedChat, setSelectedChat] = React.useState();
  const [search, setSearch] = React.useState();
  const [filteredChats, setFilteredChats] = useState(chats); 
  
console.log(chats)

useEffect(() => {
  if (!user?.uid) return;

  const unsub = onSnapshot(doc(db, 'userchats', user.uid), async(res) => {
    if (res.exists()) {
      const items = res.data().chats

      const promise = items.map(async(item)=>{
        const userDocRef =doc(db ,"users" , item.recieverId )
        const userDocSnap =await getDoc(userDocRef)

        const user = userDocSnap.data()

        return {...item , user}
      })

      const chatData = await Promise.all(promise)
      setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt))

    } else {
      console.log("No such document!");
      setChats([]); 
    }
  });

  return () => unsub();
}, [user?.uid]);


useEffect(() => {
  setFilteredChats(chats);
}, [chats]);  


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const newFilteredChats = chats.filter((elem) =>
      elem.user.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredChats(newFilteredChats);
  };



  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: 'calc(100dvh - var(--Header-height))',
        overflowY: 'auto',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        pb={1.5}
      >
        <Typography
          fontSize={{ xs: 'md', md: 'lg' }}
          component="h1"
          fontWeight="lg"
          endDecorator={
            <Chip
              variant="soft"
              color="primary"
              size="md"
              slotProps={{ root: { component: 'span' } }}
            >
              4
            </Chip>
          }
          sx={{ mr: 'auto' }}
        >
          Messages
        </Typography>
        {/* <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          sx={{ display: { xs: 'none', sm: 'unset' } }}
        >
          <EditNoteRoundedIcon />
        </IconButton> */}
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: 'none' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
          onChange={handleSearch}
          value={search}
          name='search'
        />
      </Box>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
        }}
      >
        {filteredChats?.length>0 ?filteredChats?.map((chat) => (
          <ChatListItem chat={chat} allChats={chats} setSelectedChat={setSelectedChat} selectedChat={selectedChat}
          />
        )):<div className='nouser'><h5>No user found</h5></div>}
      </List> 
    </Sheet>
  );
}
