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
import VideocamIcon from '@mui/icons-material/Videocam';
import {toast} from 'react-toastify';

const VideoMessage = () => {
  const { chatId, userData,funUser } = useAuth()
  const [videoUrl, setvideoUrl] = useState('');

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true });

  // console.log(mediaBlobUrl)
  // console.log(videoUrl)

  const storeVideoReference = async (downloadURL) => {
    console.log("store video wala function")

    try {
      const chatDocRef = doc(db, 'chats', chatId);
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          senderId: userData.id,
          videoUrl: downloadURL,
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
            userChatData.chats[chatIdx].lastMessage = downloadURL ? "🎥 " + "Video" : "";
            userChatData.chats[chatIdx].isSeen = id === userData.id ? true : false;
            userChatData.chats[chatIdx].updatedAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatData.chats
            });

            console.log('Video reference stored successfully!');
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
      const videoRef = ref(storage, `video/${Date.now()}.webm`);
      await uploadBytes(videoRef, blob);
      const downloadURL = await getDownloadURL(videoRef);
      console.log('File available at', downloadURL);
      await storeVideoReference(downloadURL);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const handleStop = async () => {
    console.log('Stopping recording...');
    stopRecording();
    setTimeout( () => {
      if (videoUrl) {
         handleUpload(videoUrl);
      } else {
        toast.error("Some error occured !! Try again")
        console.error('No mediaBlobUrl available.');
      }
    }, 2000)
  };



  useEffect(() => {
    if (mediaBlobUrl) {
      setvideoUrl(mediaBlobUrl);
    }
  }, [mediaBlobUrl ,videoUrl,status]);


  return (
    <>
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={status === "idle" || status === "stopped" ? startRecording : handleStop}
        title={status === "idle" || status === "stopped" ? "Video Recording" : 'Stop Recording Video'}
      >
        {status === "idle" || status === "stopped"
          ? <VideocamIcon />
          : <i className="fa-solid fa-video fa-fade icn"></i>}
      </IconButton>
    </>
  )
}

export default VideoMessage