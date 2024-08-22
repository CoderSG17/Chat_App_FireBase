import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import { IconButton, Stack } from '@mui/joy';
import upload from '../components/upload';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import EmojiPicker from "emoji-picker-react"
import { useAuth } from '../components/Auth';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../components/firebase';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

export default function MessageInput() {
  const { chatId, userData, funUser } = useAuth();
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

  const handleSend = async () => {
    console.log(chatId)

    if (text === "") return;

    try {

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: userData.id,
          text,
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
          console.log(chatIdx)

          userChatData.chats[chatIdx].lastMessage = text;
          userChatData.chats[chatIdx].isSeen = id === userData.id ? true : false;
          userChatData.chats[chatIdx].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatData.chats
          })

          setText("")


        }
      })


    } catch (error) {
      console.log(error)
      setText("")

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

      setShowCaptionModal(true); // Show the caption input modal
      setSelectedImage(file);
    }
  };


  const handleSendImage = async () => {
    setShowCaptionModal(false)
    try {
      let imgUrl = null;
      if (selectedImage) {
        imgUrl = await upload(selectedImage); // Your upload function
        console.log(imgUrl);
      }

      // Store image and caption in the chat
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: userData.id,
          createdAt: new Date(),
          img: imgUrl ? imgUrl : "",
          caption: caption ? caption : "",
        }),
      });

      // Update the user chats as you did before
      const userIds = [userData.id, funUser.id];
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatRef);

        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data();

          const chatIdx = userChatData.chats.findIndex(c => c.chatId === chatId);

          if (chatIdx !== -1) {
            userChatData.chats[chatIdx].lastMessage = caption ? "📷 " + caption : "Image 📷";
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

      setCaption(""); // Clear the caption input
      setShowCaptionModal(false); // Hide the modal
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
      <FormControl>
        <Textarea
          placeholder="Type something here…"
          aria-label="Message"
          onChange={(e) => {
            setText(e.target.value);
          }}

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
                      <EmojiPicker onEmojiClick={handleEmoji} />
                    </div>
                  )}
                  <span ref={buttonRef}>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      onClick={() => setToggleEmoji(!toggleEmoji)}
                    >
                      <EmojiEmotionsIcon />
                    </IconButton>
                  </span>
                </span>
                <IconButton size="sm" variant="plain" color="neutral">
                  <label htmlFor="file">
                    <CameraAltIcon />
                  </label>
                  <input type="file" id='file' accept="image/*" style={{ display: "none" }} onChange={handleImage} />
                </IconButton>
                {showCaptionModal && (
                  <div className="caption-modal">
                    <div className="modal-content">
                    <img src={image?.url} alt="" className='image' /><br /><br />
                      <input
                        type="text"
                        placeholder="Enter caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                      />
                      <button onClick={handleSendImage}>Send</button>
                      <button onClick={handleSendImage}>Cancel</button>
                    </div>
                  </div>
                )}
                <IconButton size="sm" variant="plain" color="neutral">
                  <KeyboardVoiceIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatBoldRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatItalicRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <StrikethroughSRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatListBulletedRoundedIcon />
                </IconButton>
              </div>
              <Button
                size="sm"
                color="primary"
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleSend}
              >
                Send
              </Button>
            </Stack>
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleSend();
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
}
