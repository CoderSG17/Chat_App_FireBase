import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import { IconButton, Stack } from '@mui/joy';
import upload from '../components/upload';

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmojiPicker from "emoji-picker-react"
import { useAuth } from '../Context/Auth';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import VoiceMessage from '../components/VoiceMessage';
import VideoMessage from '../components/VideoMessage';
import { ImCross } from 'react-icons/im';
import SpeechToText from '../components/SpeechToText';
import Styling from '../components/Styling';
import { useTextStyle } from '../Context/StylingContext';

export default function MessageInput() {
  const { chatId, userData, funUser ,isReceiverBlocked,isCurrUserBlocked} = useAuth();
  const emojiRef = useRef(null);
  const buttonRef = useRef(null);
  const [text, setText] = useState("");
  const [caption, setCaption] = useState("");
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toggleEmoji, setToggleEmoji] = useState(false);
  const [image,setImage] = useState({
    file:null,
    url:""
  })

  const { textStyle } = useTextStyle(); 

  const handleSend = async () => {
    console.log(chatId)

    if (text === "") return;

    try {

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: userData.id,
          text,
          textStyles:{
            isBold : textStyle.isBold,
            isItalic : textStyle.isItalic,
            isStrikeThrough : textStyle.isStrikeThrough,
          },
          createdAt: new Date(),
        })
      })


      const userIds = [userData.id, funUser.id]

      userIds.forEach(async (id) => {
        console.log(id)
        const userChatRef = doc(db, "userchats", id)
        const userChatSnapshot = await getDoc(userChatRef)

        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data();
          console.log(userChatData)

          const chatIdx = userChatData.chats.findIndex(c => c.chatId === chatId)

          userChatData.chats[chatIdx].lastMessage = text;
          userChatData.chats[chatIdx].isSeen = id === userData.id ? true : false;
          userChatData.chats[chatIdx].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatData.chats
          })

          setText("")
          textStyle.isBold = false;
          textStyle.isItalic = false
          textStyle.isStrikeThrough = false

        }
      })


    } catch (error) {
      console.log(error)
      setText("")
      textStyle.isBold = false;
      textStyle.isItalic = false
      textStyle.isStrikeThrough = false

    }
  };


  const handleEmoji = (e) => {
    // console.log(e)
    setText(text + e.emoji)
    // setToggleEmoji(false)
  }

  const handleClickOutside = (e) => {
    if (
      emojiRef.current &&
      !emojiRef.current.contains(e.target) &&
      !buttonRef.current.contains(e.target)
    ) {
      setToggleEmoji(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleImage = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setImage({
        file,
        url
      });

      setShowCaptionModal(true); 
      setSelectedImage(file);
    }
  };


  const handleSendImage = async () => {
    setShowCaptionModal(false)
    try {
      let imgUrl = null;
      if (selectedImage) {
        imgUrl = await upload(selectedImage); 
        console.log(imgUrl);
      }

    
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: userData.id,
          createdAt: new Date(),
          img: imgUrl ? imgUrl : "",
          caption: caption ? caption : "",
        }),
      });

      const userIds = [userData.id, funUser.id];
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatRef);

        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data();

          const chatIdx = userChatData.chats.findIndex(c => c.chatId === chatId);

          if (chatIdx !== -1) {
            userChatData.chats[chatIdx].lastMessage = image ? (caption ? "📷 " + caption : "Image 📷") : ""

            userChatData.chats[chatIdx].isSeen = id === userData.id ? true : false;
            userChatData.chats[chatIdx].updatedAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatData.chats
            });

            setText("");
            setImage({
              file: null,
              url: "",
            });
          }
        }
      });

      setCaption(""); 
      setShowCaptionModal(false); 
    } catch (error) {
      console.log(error);
      setText("");
      setImage({
        file: null,
        url: "",
      });
      setCaption("");
      setShowCaptionModal(false);
    }
  };


  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl sx={{ cursor: isCurrUserBlocked || isReceiverBlocked ? 'not-allowed':'pointer' }} >  
        <Textarea   
          placeholder={isCurrUserBlocked || isReceiverBlocked ?"You cannot send any message":"Type something here…"}
          aria-label="Message"
          onChange={(e) => {
            setText(e.target.value);
            
          }}
          disabled={isCurrUserBlocked||isReceiverBlocked}
          value={text}
          minRows={3}
          maxRows={10}
          endDecorator={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                pr: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <div>
                <span>
                  {toggleEmoji && (
                    <div ref={emojiRef}>
                      <EmojiPicker onEmojiClick={handleEmoji}                  
                      disabled={isCurrUserBlocked||isReceiverBlocked}
                      />
                    </div>
                  )}
                  <span ref={buttonRef}>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      onClick={() => setToggleEmoji(!toggleEmoji)}
                       title='Emoji'
                    >
                      <EmojiEmotionsIcon />
                    </IconButton>
                  </span>
                </span>
                <IconButton size="sm" variant="plain" color="neutral" title='Photo'>
                  <label htmlFor="file">
                    <CameraAltIcon />
                  </label>
                  <input type="file" id='file' accept="image/*" style={{ display: "none" }} onChange={handleImage}                
                   disabled={isCurrUserBlocked||isReceiverBlocked}
                  />
                </IconButton>
                {showCaptionModal && (
                  <div className="caption-modal">
                  <button className="close-button" onClick={() => setShowCaptionModal(false)}><ImCross /></button>

                    <div className="modal-content">
                    <img src={image?.url} alt="error" className='image' /><br /><br />
                      <input
                        type="text"
                        placeholder="Enter caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        disabled={isCurrUserBlocked||isReceiverBlocked}

                      />
                      <button onClick={handleSendImage}                 disabled={isCurrUserBlocked||isReceiverBlocked}
>Send</button>
                      <button onClick={handleSendImage}                 
>Send Without Caption</button>
                    </div>
                  </div>
                )}
                <VoiceMessage></VoiceMessage>
                <VideoMessage></VideoMessage>
                <SpeechToText text={text} setText={setText}></SpeechToText>
                <Styling></Styling>
               
              </div>
              <Button
                size="sm"
                color="primary"
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleSend}
                disabled={isCurrUserBlocked||isReceiverBlocked}
              >
                Send
              </Button>
            </Stack>
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents the default Enter behavior (new line)
      handleSend();
    }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
              fontWeight: textStyle.isBold ? 'bold' : 'normal',
          fontStyle: textStyle.isItalic ? 'italic' : 'normal',
          textDecoration: textStyle.isStrikeThrough ? 'line-through' : 'none'
            },
          }}
        />
      </FormControl>
    </Box>
  );
}
