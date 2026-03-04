import { Routes, Route, Navigate } from "react-router-dom";
import React from 'react';
import Login from './Pages/Login/Login';
import SignUp from './Pages/Signup/Signup';
import Home from './Pages/HomePage/HomePage';
import Orders from './Pages/Orders/Orders';
import Weather from './Pages/Weather/Weather';
import Worksites from './Pages/Worksites/Worksites';
import Planning from './Pages/Planning/Planning';
import Settings from './Pages/Settings/Settings';
import DashboardArmature from './Pages/Dashbord/Dashbord'
import JobsitList from "./Pages/Dashbord/JobsitList";
import JobsitHub from "./Pages/Dashbord/Dashbordhub";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signin" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<JobsitList />} />
    <Route path="/dashboard/:id" element={<JobsitHub />} />
    <Route path="/dashboard/:id/armature" element={<DashboardArmature />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/weather" element={<Weather />} />
    <Route path="/worksites" element={<Worksites />} />
    <Route path="/planning" element={<Planning />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
);

export default App;
