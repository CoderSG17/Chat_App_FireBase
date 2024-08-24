import React, { useEffect, useState } from 'react'
import 'regenerator-runtime'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { IconButton } from '@mui/joy';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { db  } from './firebase';
import { arrayUnion, getDoc , doc ,updateDoc} from 'firebase/firestore';
import { useAuth } from '../Context/Auth';

const SpeechToText = ({setText}) => {

    const {userData , funUser,chatId} = useAuth()
    const { transcript, browserSupportsSpeechRecognition , listening ,resetTranscript} = useSpeechRecognition()

    if (!browserSupportsSpeechRecognition) {
        return null
      }
      
    const startListening  =()=> SpeechRecognition.startListening({ continuous: true , language: 'en-IN' })


    const stopListening =async()=> {
        SpeechRecognition.stopListening()
        setText("")
        try {

            await updateDoc(doc(db, "chats", chatId), {
              messages: arrayUnion({
                senderId: userData.id,
                text:transcript?transcript:"",
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
      
                userChatData.chats[chatIdx].lastMessage = transcript;
                userChatData.chats[chatIdx].isSeen = id === userData.id ? true : false;
                userChatData.chats[chatIdx].updatedAt = Date.now();
      
                await updateDoc(userChatRef, {
                  chats: userChatData.chats
                })
      
                
            }
        })

    

          } catch (error) {
            console.log(error)
            setText("")
      
          }
    }

    useEffect(()=>{
        if(listening){
            setText(transcript)
        }
        else{
            resetTranscript()
        }
    },[listening,transcript])


  return (
    <>
    <IconButton onClick={!listening ? startListening:stopListening}
    title={!listening ? 'Speech To Text':'Stop speaking'}>
       {listening ? <i class="fa-solid fa-ear-listen fa-fade icn" style={{bottom:"4px"}} ></i> : <SpeakerNotesIcon/>}
    </IconButton>
    </>
  )
}

export default SpeechToText