import React from 'react'
import {ZegoUIKitPrebuilt} from "@zegocloud/zego-uikit-prebuilt"
import { useAuth } from '../Context/Auth'
import { NavLink, useParams } from 'react-router-dom'
import Navbar from './Navbar'
import Loader from './Loader'
const VideoCall = () => {
    const {userData,user,isLoading , setIsloading} = useAuth()
    const {userName} = useParams()

    const myVideoCall=(element)=>{
        try {
            setIsloading(true)
            const appID =Number( import.meta.env.VITE_ZEGO_AppId) ;
            const serverSecret = import.meta.env.VITE_ZEGO_Server_Secret;
            const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, userName,user?.uid, userData?.name);
            
            const zc = ZegoUIKitPrebuilt.create(kitToken)
    
            zc?.joinRoom({
                container:element,
                sharedLinks: [{
                    name:"Copy Link",
                    url:`http://localhost:5150/room/video/${userName}`
                }],
                scenario:{
                    mode:ZegoUIKitPrebuilt.OneONoneCall,
                },
                turnOnMicrophoneWhenJoining: false, 
                turnOnCameraWhenJoining: false ,
                showRoomTimer: true     ,
                showPinButton: true 
             })
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsloading(false)
          }
      
        
    }
  return (
    <>
    <div >
    <div ref={myVideoCall}/>
    </div>
    <div className='return'>
       <NavLink to='/'>
       <button className='btn4'>Return To Home Page</button>
       </NavLink>
    </div>
    {
      isLoading?<Loader></Loader>:""
    }
    </>
  )
}

export default VideoCall