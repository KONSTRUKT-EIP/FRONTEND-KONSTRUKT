import { Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './Components/Login/Login';
import SignUp from './Components//Login/Login';
// import HomePage from './Components/HomePage/HomePage';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    {/* <Route path="/home" element={<HomePage />} /> */}
  </Routes>
);

export default App;
