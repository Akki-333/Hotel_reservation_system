import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/js/bootstrap.bundle.min"; 
import StoreContextProvider from '../components/Foods/StoreContext'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
axios.defaults.withCredentials = true


ReactDOM.createRoot(document.getElementById('root')).render(
   
   <StoreContextProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </StoreContextProvider>
  
)
