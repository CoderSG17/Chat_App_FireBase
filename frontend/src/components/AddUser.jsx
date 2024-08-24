import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { GiCrossMark } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useAuth } from '../Context/Auth';
import { toast } from 'react-toastify';




export default function AddUser({ setShowAddUser }) {
  const { user, allUser } = useAuth()
  const [userDet, setUserDet] = React.useState(allUser)
  const handleClose = () => setShowAddUser(false);




  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name')
    const lowerName =name.toLowerCase();
  
    if (!name) {
      toast.error("Please enter a name to search.");
      return;
    }
  
    try {
      const userRef = collection(db, "users");
      const querySnapshot = await getDocs(userRef);

      const filterData = querySnapshot.docs
        .map(doc => doc.data())
        .filter(data => 
          data?.name?.toLowerCase().includes(lowerName) &&
          data.id !== user.uid
        );
  
        setUserDet(filterData);
     
    } catch (error) {
      console.error("Error fetching users: ", error);
      setUserDet([]);
    }
  };
  
  
  
const handleAdd = async (idx) => {
  const chatRef = collection(db, "chats")
  const userChatsRef = collection(db, "userchats")
  try {
    const newChatRef = doc(chatRef)
    await setDoc(newChatRef, {
      id: newChatRef.id,
      createdAt: serverTimestamp(),
      messages: []
    })

    await updateDoc(doc(userChatsRef, userDet[idx].id), {
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "",
        recieverId: user.uid,
        updatedAt: Date.now()
      })
    })

    await updateDoc(doc(userChatsRef, user.uid), {
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: "",
        recieverId: userDet[idx].id,
        updatedAt: Date.now()
      })
    })

  } catch (error) {
    console.log(error)
  }
}


React.useEffect(() => {
  setUserDet(allUser);
}, [allUser]);


return (
  <>
    <CssBaseline />
    <div className="background-overlay">
      <Container maxWidth="sm" className='ctn'>
        <div className='addUser'>
          <div className='divIcon'>

            <GiCrossMark className='icon' onClick={handleClose} />
          </div>
          <div className='inpBtn'>
            <form onSubmit={handleSearch} className='form'>
              <input type="text" className='inp' placeholder='Username' name='name' />
              <button className='btn1'>Search</button>
            </form>
          </div>
          <div className='headBtn'>
            {userDet.length>0 ? userDet?.map((elem, idx) => (
              <div key={idx} className='inpBtn'>
                <img src={elem?.avatar} alt="Avatar" className='img' />
                <div className='info'>
                  <h4 className='name'>{elem?.name}</h4>
                  <h5 className='email'>{elem?.email}</h5>
                </div>
                <button className='btn1' onClick={() => handleAdd(idx)}>Add</button>
              </div>
            )):<h4>No user Found</h4>}
          </div>
        </div>

      </Container>
    </div>
  </>
);
}
