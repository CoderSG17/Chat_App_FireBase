import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/Auth';
import { db } from './firebase';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';

function MediaDrawer({ onClose }) {
    const {chatId} = useAuth()
  const [isOpen, setIsOpen] = useState(true);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [filter, setFilter] = useState([]);
  const openRef = React.useRef(null);


  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300); // Delay hiding until the transition ends
  };

  const handleClickOutside = (e) => {
    if (openRef.current && !openRef.current.contains(e.target)) {
        setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  React.useEffect(() => {
    if (!chatId) return;

    const chatRef = doc(db, "chats", chatId);

    const unSub = onSnapshot(chatRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setChatMessages(docSnapshot.data().messages);
      } else {
        console.log('No such document!');
      }
    }, (error) => {
      console.log('Error fetching document:', error);
    });

    return () => {
      unSub();
    };
  }, [chatId]);



  const filteredMessages = chatMessages?.filter(message => {
    if (filter === 'audio') return message.audioUrl;
    if (filter === 'video') return message.videoUrl;
    if (filter === 'image') return message.img ;
    return false;
  });


  return (
    <>
      <div className={`media-drawer ${isOpen ? 'open' : 'closed'} `} ref={openRef}>
        <div className="drawer-header">
          <h1>Media</h1>
          <button onClick={handleClose} className="drawer-close">
            ✖
          </button>
        </div>
        <div className="drawer-content">
          <button className="btn4" onClick={() => setFilter('image')}>Images</button>
          <button className="btn4" onClick={() => setFilter('audio')}>Audio Files</button>
          <button className="btn4" onClick={() => setFilter('video')}>Video Files</button>
        </div>
        <div className="media-list">
        {filteredMessages.length === 0 ? (
          filter === 'image' ? <h3 className='heading'>No images found</h3> :
          filter === 'audio' ? <h3 className='heading'>No audio files found</h3> :
          filter === 'video' ? <h3 className='heading'>No video files found</h3> :
          null
        ) : (
          filteredMessages.map(elem => (
            <div key={elem.id} className="media-item">
              {filter === 'image' && elem.img && <img onClick={()=>window.open(elem.img)} className='img1' src={elem.img} alt="media" />}
              {filter === 'audio' && elem.audioUrl && <audio controls src={elem.audioUrl} />}
              {filter === 'video' && elem.videoUrl && <video controls src={elem.videoUrl} />}
            </div>
          ))
        )}
      </div>
      </div>
    </>
  );
}

export default MediaDrawer;
