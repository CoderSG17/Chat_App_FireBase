import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useAuth } from '../Context/Auth';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const TextOptions = ({ setShowOptions, txt, senderId, idx, elem }) => {
  const { userData, chatId, funUser } = useAuth()
  const [textToCopy, setTextToCopy] = useState(txt);

  const hasMedia = elem?.audioUrl || elem?.videoUrl || elem?.img;
  const optionsRef = useRef(null);

  const handleClickOutside = (e) => {
    if (
      optionsRef.current &&
      !optionsRef.current.contains(e.target)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast.success('Text copied to clipboard!');
        setShowOptions(false);
      })
      .catch((err) => {
        console.log(err)
        toast.error('Failed to copy text: ');
      });
  }




  const handleDelete = async () => {
    const chatRef = doc(db, 'chats', chatId);
    try {

      const userChatSnapshot = await getDoc(chatRef);

      if (userChatSnapshot.exists()) {
        const messages = userChatSnapshot.data().messages || [];

        messages.splice(idx, 1); // Remove the message at the specified index

        await updateDoc(chatRef, { messages });
        setShowOptions(false);

        const allMessages = userChatSnapshot.data().messages;
      const length = allMessages.length-1;
  
      let prevMessageText = '';

      if (length > 0) {
        if (allMessages[length - 1].text) {
          prevMessageText = allMessages[length - 1].text;
        } else if (allMessages[length - 1].audioUrl) {
          prevMessageText = '🎤 ' + 'Audio';
        } else if (allMessages[length - 1].videoUrl) {
          prevMessageText = '🎥 ' + 'Video';
        }
        else if (allMessages[length - 1].img && allMessages[length - 1].caption == "") {
          prevMessageText = '📷 ' + 'Image';
        }
        else if (allMessages[length - 1].img && allMessages[length - 1].caption) {
          prevMessageText = '📷 ' + allMessages[length - 1].caption;
        }
      } else {
        prevMessageText = '';
      }


        const userIds = [userData.id, funUser.id]

        userIds.forEach(async (id) => {
          console.log(id)
          const userChatRef = doc(db, "userchats", id)
          const userChatSnapshot = await getDoc(userChatRef)

            const userChatData = userChatSnapshot.data();
            console.log(userChatData)

            const chatIdx = userChatData.chats.findIndex(c => c.chatId === chatId)

            userChatData.chats[chatIdx].lastMessage = prevMessageText;
            userChatData.chats[chatIdx].isSeen = id === userData.id ? true : false;
            userChatData.chats[chatIdx].updatedAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatData.chats
            })
          
        })

        toast.success('Message deleted successfully');
      } else {
        toast.error('Document does not exist');
      }

    } catch (error) {
      console.error('Error deleting message: ', error);
      toast.error('Failed to delete message');
    }
  };

  const handleUpdate =async()=>{
    const chatRef = doc(db, 'chats', chatId);

    const userChatSnapshot = await getDoc(chatRef);
      const allMessages = userChatSnapshot.data().messages;
      const msg = allMessages[idx].text
      console.log(msg)

  }



  return (
    <>
       <div className="dropdown-content" ref={optionsRef}>
      {hasMedia ? (
        // If message has media, only show the Delete button
        userData.id === senderId ? (
          <a>
            <button className='btn3' onClick={handleDelete}>Delete</button>
          </a>
        ) : <a>
            <button className='btn3' onClick={handleCopy}>Copy</button>
          </a>
      ) : (
        // If message does not have media, show all buttons
        <>
          <a>
            <button className='btn3' onClick={handleCopy}>Copy</button>
          </a>
          {userData.id === senderId && (
            <>
              <a>
                <button className='btn3' onClick={handleDelete}>Delete</button>
              </a>
              <a>
                <button className='btn3' onClick={handleUpdate}>Update</button>
              </a>
            </>
          )}
        </>
      )}
    </div>
    </>
  )
}

export default TextOptions