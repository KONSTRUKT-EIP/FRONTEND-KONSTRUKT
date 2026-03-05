import { Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './Pages/Login/Login';
import SignUp from './Pages/Signup/Signup';
import Home from './Pages/HomePage/HomePage';
import Orders from './Pages/Orders/Orders';
import Weather from './Pages/Weather/Weather';
import Worksites from './Pages/Worksites/Worksites';
import Planning from './Pages/Planning/Planning';
import Settings from './Pages/Settings/Settings';
import About from './Pages/About/About';
import Pricing from './Pages/Pricing/Pricing';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signin" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    {/* <Route path="/dashboard" element={<Home />} /> */}
    <Route path="/orders" element={<Orders />} />
    <Route path="/weather" element={<Weather />} />
    <Route path="/worksites" element={<Worksites />} />
    <Route path="/planning" element={<Planning />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/about" element={<About />} />
    <Route path="/pricing" element={<Pricing />} />
  </Routes>
);

export default App;
