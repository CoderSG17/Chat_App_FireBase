import React from 'react'
import '../css/Entry.css'

const Entry = () => {
  return (
    <>
        <div className="container">
      <div className="video-container">
        <video 
          src="https://videos.pexels.com/video-files/7227545/7227545-hd_1920_1080_25fps.mp4" 
          className="video" 
          loop 
          autoPlay 
          muted 
        ></video>
      </div>
      <div className="content">
        <h2 className="welcome-text">Welcome to Baat Cheet</h2>
        <h3 className="explore-text">Explore the world using our app</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At nisi, rerum ea corporis eos voluptate error recusandae ullam itaque minus accusantium iure velit nihil, neque quam temporibus ut. Cupiditate, nobis!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At nisi, rerum ea corporis eos voluptate error recusandae ullam itaque minus accusantium iure velit nihil, neque quam temporibus ut. Cupiditate, nobis!</p>
      </div>
    </div>
    </>
  )
}

export default Entry