import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../components/firebase';
import { useAuth } from '../Context/Auth';
import Entry from '../Pages/Entry';

export default function MessagesPane({ selectedChat }) {
  
  const { chatId ,userData} = useAuth()
  const [chatMessages, setChatMessages] = React.useState([]);

  console.log(chatMessages)

  React.useEffect(() => {
    if (!chatId) return;

    const chatRef = doc(db, "chats", chatId);

    const unSub = onSnapshot(chatRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setChatMessages(docSnapshot.data());
      } else {
        console.log('No such document!');
      }
    }, (error) => {
      console.log('Error fetching document:', error);
    });

    return () => {
      unSub();
    };
  }, [chatId, selectedChat]);




  return (
    <>

    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      {chatMessages.length === 0 ? "" : <MessagesPaneHeader />}
      {chatMessages.length === 0 ? <Entry></Entry> : <><Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end"
        >
          {chatMessages.messages ? chatMessages.messages.map((elem, idx) => {
            const isSent = elem.senderId===userData.id ? true : false;

            const timestampInSeconds = elem.createdAt.seconds;
            const date = new Date(timestampInSeconds * 1000); // Convert seconds to milliseconds

            let hours = date.getHours(); 
            const minutes = date.getMinutes(); 

            const timeLine = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12; // Convert to 12-hour format
            hours = hours ? hours : 12; // Hour '0' should be '12'

            // Format minutes to always be two digits
            const formattedMinutes = minutes.toString().padStart(2, '0');

            // Format as hour:min AM/PM
            const formattedTime = `${hours}:${formattedMinutes} ${timeLine}`;

            return (
              <Stack
                key={idx}
                direction="row"
                spacing={2}
                flexDirection={isSent?'row-reverse':'reverse'}
              >
                {/* {messages?.sender !== 'You' && (
                  <AvatarWithStatus
                    online={messages?.sender.online}
                    src={messages?.sender.avatar || error}
                  />
                )} */}
                <ChatBubble elem={elem} createdAt={formattedTime} idx={idx}></ChatBubble>
              </Stack>
            );
          }) : ""}
        </Stack>
      </Box>
      <MessageInput></MessageInput>
      </>}
    </Sheet>
    </>
  );
}
