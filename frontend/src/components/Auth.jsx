import { createContext, useContext ,useState,useEffect} from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user,setUser] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

    return (
        <>
        <AuthContext.Provider value={{ user}}>
          {children}
        </AuthContext.Provider>
        </>
      );
    };
    

export const  useAuth = () => {
        const authContextValue = useContext(AuthContext);
        if (!authContextValue) {
          throw new Error("useAuth used outside of the Provider");
        }
        return authContextValue;
      };