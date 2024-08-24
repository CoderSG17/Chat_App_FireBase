import React from 'react'
import { IconButton } from '@mui/joy'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { useAuth } from '../Context/Auth';
import { useEffect } from 'react';

const VoiceMessage = () => {
  const { chatId, userData ,funUser} = useAuth()
  const [audioUrl, setAudioUrl] = useState('');

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  // console.log(mediaBlobUrl)
  // console.log(audioUrl)

  const storeAudioReference = async (downloadURL) => {
    console.log("store audio wala function")

    try {
      const chatDocRef = doc(db, 'chats', chatId);
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          senderId: userData.id,
          audioUrl: downloadURL,
          createdAt: new Date(),
        })
      });
      const userIds = [userData.id, funUser.id];
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatRef);

        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data();

          const chatIdx = userChatData.chats.findIndex(c => c.chatId === chatId);

          if (chatIdx !== -1) {
            userChatData.chats[chatIdx].lastMessage = downloadURL ? "🎤 " + "Audio" : "";
            userChatData.chats[chatIdx].isSeen = id === userData.id ? true : false;
            userChatData.chats[chatIdx].updatedAt = Date.now();

            await updateDoc (userChatRef, {
              chats: userChatData.chats
            });

            console.log('Audio reference stored successfully!');
          }
        }
      })
    } catch (error) {
      console.error('Error storing audio reference:', error);
    }
  };

  const handleUpload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const audioRef = ref(storage, `audio/${Date.now()}.webm`);
      await uploadBytes(audioRef, blob);
      const downloadURL = await getDownloadURL(audioRef);
      console.log('File available at', downloadURL);
      await storeAudioReference(downloadURL);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const handleStop = async () => {
    console.log('Stopping recording...');
    stopRecording();
    setTimeout(async () => {
      if (audioUrl) {
        await handleUpload(audioUrl);
      } else {
        console.error('No mediaBlobUrl available.');
      }
    }, 2000)
  };



  useEffect(() => {
    if (mediaBlobUrl) {
      setAudioUrl(mediaBlobUrl);
    }
  }, [mediaBlobUrl,audioUrl]);


  return (
    <>
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={status === "idle" || status === "stopped" ? startRecording : handleStop}
        title={status === "idle" || status === "stopped" ? "Audio Recording" : 'Stop Recording Audio'}
      >
        {status === "idle" || status === "stopped"
          ? <KeyboardVoiceIcon titleAccess='Voice Recording'/>
          : <i className="fa-solid fa-record-vinyl fa-fade icn" title='Stop Recording Audio'></i>}
      </IconButton>
    </>
  )
}

export default VoiceMessage