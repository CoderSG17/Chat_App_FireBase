import React from 'react'
import { useAuth } from '../components/Auth'
import Navbar from '../components/Navbar'

const Home = () => {
    const {user} = useAuth()
    console.log(user)
    
  return (
    <>
    <Navbar></Navbar>
    
    </>
  )
}

export default Home