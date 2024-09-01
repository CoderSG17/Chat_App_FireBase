import { createContext, useContext ,useState,useEffect} from "react";
import { auth, db } from "../components/firebase";
import { onAuthStateChanged } from "firebase/auth";
export const AuthContext = createContext();
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

export const AuthProvider = ({ children }) => {
    const [isLoading , setIsloading ] = useState(false)
    const [user,setUser] = useState()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const[userData , setUserData] = useState()
    const [allUser, setAllUser] =useState()

    const[chatId , setChatId] = useState()
    const[isCurrUserBlocked , setIsCurrUserBlocked] = useState()
    const[isReceiverBlocked , setIsReceiverBlocked] = useState()
    const [funUser,setfunUser] = useState("")


    
    const changeChat =async(chatId , fnuser)=>{

      try {
        setfunUser(fnuser)
        // Checking if current user is blocked
        if(fnuser?.blocked?.includes(userData?.id)){
            setChatId(chatId),
            setfunUser(null),
            setIsCurrUserBlocked(true),
            setIsReceiverBlocked(false)
        }
        
        // Checking if receiver is blocked
        else if(userData?.blocked?.includes(fnuser?.id)){
          setChatId(chatId),
          setfunUser(fnuser),
          setIsCurrUserBlocked(false),
          setIsReceiverBlocked(true)
      }

      else{
        setChatId(chatId),
        setfunUser(fnuser),
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

            await updateDoc(docRef,{
              lastSeen:Date.now(),
            })
            setInterval(async()=>{
              if(auth.currentUser){
                await updateDoc(docRef,{
                  lastSeen:Date.now(),
                })
              }
            },10000)
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
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setIsLoggedIn(true); 
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      });
  
      return () => unsubscribe();
    }, []);
    
    return (
        <AuthContext.Provider value={{ user,userData , changeChat , chatId,changeBlockStatus , funUser,allUser,isCurrUserBlocked,isReceiverBlocked , isLoggedIn ,isLoading , setIsloading}}>
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