import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './Context/Auth.jsx';
import { TextStyleProvider } from './Context/StylingContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
      <AuthProvider>
      <TextStyleProvider>
    <App />
     <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                draggable
                theme="light"
                bodyClassName="toastBody"

            />
            </TextStyleProvider>
      </AuthProvider>

            </>
)
