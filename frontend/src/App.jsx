import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import ProfileUpdate from './Pages/ProfileUpdate'
const App = () => {

  // // const socket = io('http://localhost:5000')
  // // const socket = io('')

  // const URL = "http://localhost:5000";
  // const socket = io(URL, { autoConnect: true });
  // socket.connect();
  // // console.log(socket)
  
  // socket.on("connect_error", (err) => {
  //     console.log(`connect_error due to ${err.message}`);
  // });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home></Home>}>
          </Route>
          {/* <Route path='/home' element={<Home></Home>}>
          </Route> */}
          <Route path='/login' element={<Login></Login>}>
          </Route>
          <Route path='/register' element={<Register></Register>}>
          </Route>
          <Route path='/updateProfile' element={<ProfileUpdate></ProfileUpdate>}>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App