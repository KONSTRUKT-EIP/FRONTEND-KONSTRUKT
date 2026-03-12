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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-6 focus:py-3 focus:bg-orange-500 focus:text-white focus:font-semibold focus:rounded-br-lg"
        >
          Aller au contenu principal
        </a>
        <Navbar />
        <main id="main-content">
          <App />
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
