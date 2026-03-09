import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import { AuthProvider } from './Context/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <App />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
