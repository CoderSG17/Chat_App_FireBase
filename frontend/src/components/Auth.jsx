import { createContext, useContext ,useState,useEffect} from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
export const AuthContext = createContext();
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const AuthProvider = ({ children }) => {

    const [user,setUser] = useState()
    const[userData , setUserData] = useState()
    const [allUser, setAllUser] =useState()

    const[chatId , setChatId] = useState()
    const[isCurrUserBlocked , setIsCurrUserBlocked] = useState()
    const[isReceiverBlocked , setIsReceiverBlocked] = useState()
    const [funUser,setfunUser] = useState("")

    console.log(chatId)
    console.log(funUser)

    
    const changeChat =async(chatId , user)=>{
      console.log(chatId)
      console.log(user)
      try {
        setfunUser(user)
        // Checking if current user is blocked
        if(funUser?.blocked?.includes(userData?.id)){
            setChatId(chatId),
            setfunUser(null),
            setIsCurrUserBlocked(true),
            setIsReceiverBlocked(false)
        }
        
        // Checking if receiver is blocked
        else if(userData?.blocked?.includes(funUser?.id)){
          setChatId(chatId),
          setfunUser(user),
          setIsCurrUserBlocked(false),
          setIsReceiverBlocked(true)
      }

      else{
        setChatId(chatId),
        setfunUser(user),
        setIsCurrUserBlocked(false),
        setIsReceiverBlocked(false)
      }

      } catch (error) {
        console.log(error)
      }
    }


    const changeBlockStatus =()=>{
      setIsReceiverBlocked(!isReceiverBlocked)
    }



    console.log(user)
    
    
      const getUserData=async()=>{
        try {

          if (!user || !user.uid) {
            console.error("User or User UID is not available.");
            return;
          }
      
          const docRef = doc(db, "users", user?.uid);
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            setUserData(docSnap.data());
          } else {
            console.log("No such document found!");
          }
        } catch (error) {
            console.log(error)
        }
      }

      const getAllUser =async()=>{
        try {
          const usersCollectionRef = collection(db, 'users');
    
          const querySnapshot = await getDocs(usersCollectionRef);
    
          const allData = querySnapshot.docs
          .map(doc => doc.data()).filter(userData => userData?.id !== user?.uid);

          setAllUser(allData)

        } catch (error) {
          console.log(error)
        }
      }

    
    useEffect(()=>{
      getUserData()
      getAllUser()
    },[user])
    
    
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) setUser(user);
        else setUser(null);
      });
    }, []);
    
    return (
        <AuthContext.Provider value={{ user,userData , changeChat , chatId,changeBlockStatus , funUser,allUser}}>
          {children}
        </AuthContext.Provider>
      );
    };




    

export const  useAuth = () => {
        const authContextValue = useContext(AuthContext);
        if (!authContextValue) {
          throw new Error("useAuth used outside of the Provider");
        }
        return authContextValue;
      };