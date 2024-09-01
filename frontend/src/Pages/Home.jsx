// import React from 'react'
// import { useAuth } from '../components/Auth'
// import Navbar from '../components/Navbar'

// const Home = () => {
//     const {user} = useAuth()
//     console.log(user)
    
//   return (
//     <>
//     <Navbar></Navbar>
    
//     </>
//   )
// }

// export default Home



import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from '../ChatComponents/Sidebar';
import Header from '../ChatComponents/Header';
import MyMessages from '../ChatComponents/MyMessages';
import Navbar from '../components/Navbar';
import { useAuth } from '../Context/Auth';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const {isLoggedIn} = useAuth()  
  const navigate = useNavigate()
  return (
    <>
   {isLoggedIn ?<>  <Navbar ></Navbar>
    <br /><br /><br />
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Sidebar />
        <Header />
        <Box component="main" className="MainContent" sx={{ flex: 1,minHeight: '100dvh'}}>
          <MyMessages/>
        </Box>
      </Box>
    </CssVarsProvider></>:navigate('/login')}
    </>
  );
}
