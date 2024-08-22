import React from 'react'

const Hello = () => {
  return (
    <>
        <div style={{
      border: "1px solid red", 
      width: "60vw",
      height: "25%", 
      position: "relative", // Ensures the video can be positioned absolutely within this container
      overflow: "hidden" // Hides any overflow from the video
    }}>
      <video
        src="https://videos.pexels.com/video-files/5897834/5897834-uhd_2560_1440_25fps.mp4"
        loop
        // controls 
        autoPlay
        style={{
          display: 'flex',
          justifyContent:"flex-start",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width:"100%",
          height: "100%",
          objectFit: "cover" // Ensures the video covers the container
        }}
        className='video'
      />
    </div>
    </>
  )
}

export default Hello