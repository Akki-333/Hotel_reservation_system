import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/js/bootstrap.bundle.min"; 
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from '../components/Foods/StoreContext'



ReactDOM.createRoot(document.getElementById('root')).render(
   
   <StoreContextProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </StoreContextProvider>
  
)