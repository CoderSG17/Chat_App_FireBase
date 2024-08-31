import React from 'react'
import { Hourglass } from 'react-loader-spinner'
const Loader = () => {
  return (
    <>
    <div class="overlay1"></div>
    <div className='loader'>
        <Hourglass
  visible={true}
  height="50"
  width="50"
  ariaLabel="hourglass-loading"
//   wrapperStyle={{}}
//   wrapperClass="loader"
  colors={['#306cce', '#72a1ed']}
  />
    </div>
    </>
  )
}

export default Loader