import { Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './Pages/Login/Login';
import SignUp from './Pages/Signup/Signup';
// import HomePage from './Pages/HomePage/HomePage';
import Commandes from './Pages/Commandes/Commandes';
import Meteo from './Pages/Meteo/Meteo';
import Chantiers from './Pages/Chantiers/Chantiers';
import Planning from './Pages/Planning/Planning';
import Parametres from './Pages/Parametres/Parametres';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    {/* <Route path="/dashboard" element={<HomePage />} /> */}
    <Route path="/commandes" element={<Commandes />} />
    <Route path="/meteo" element={<Meteo />} />
    <Route path="/chantiers" element={<Chantiers />} />
    <Route path="/planning" element={<Planning />} />
    <Route path="/parametres" element={<Parametres />} />
  </Routes>
);

export default App;
