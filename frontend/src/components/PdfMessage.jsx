import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db,storage } from "./firebase";
import UploadFileIcon from '@mui/icons-material/UploadFile';import { IconButton } from "@mui/joy";
import { useRef } from "react";
import { useAuth } from "../Context/Auth";
import Loader from "./Loader";

const PdfMessage = () => {

    const {chatId,userData,funUser ,isLoading , setIsloading} = useAuth()
    const fileInputRef = useRef(null);
  
    const handleFileChange = async (event) => {
        setIsloading(true)
      const file = event.target.files[0];
      if (!file) return;
  
      const fileRef = ref(storage, `pdfs/${file.name}`);
      
      try {
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
  
        // Save the file info to Firestore
        const chatDocRef = doc(db, 'chats', chatId);
        await updateDoc(chatDocRef, {
          messages: arrayUnion({
            senderId: userData.id,
            pdfUrl: url,
            fileName: file.name,
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
              userChatData.chats[chatIdx].lastMessage = url ? "📑 " + file.name : "";
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
        console.error("Error uploading file:", error);
      }
      finally{
        setIsloading(false)
      }
    };
  
    const handleIconClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

  return (
    <>
    <input
      type="file"
      accept=".pdf"
      onChange={handleFileChange}
      ref={fileInputRef}
      style={{ display: "none" }}
    />
    <IconButton onClick={handleIconClick} 
>
      <UploadFileIcon />
    </IconButton>
    {
        isLoading?<Loader></Loader>:""
    }
      </>
  );
};

export default PdfMessage;
