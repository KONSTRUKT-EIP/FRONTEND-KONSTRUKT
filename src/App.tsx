import { Routes, Route, Navigate } from "react-router-dom";
import React, { lazy, Suspense } from 'react';
import ProtectedRoute from './Components/ProtectedRoute';

const Login = lazy(() => import('./Pages/Login/Login'));
const SignUp = lazy(() => import('./Pages/Signup/Signup'));
const Home = lazy(() => import('./Pages/HomePage/HomePage'));
const Orders = lazy(() => import('./Pages/Orders/Orders'));
const Weather = lazy(() => import('./Pages/Weather/Weather'));
const Worksites = lazy(() => import('./Pages/Worksites/Worksites'));
const Planning = lazy(() => import('./Pages/Planning/Planning'));
const Settings = lazy(() => import('./Pages/Settings/Settings'));
const DashboardArmature = lazy(() => import('./Pages/Dashbord/Dashbord'));
const DashboardDetail = lazy(() => import('./Pages/Dashbord/DashboardDetail'));
const JobsitList = lazy(() => import("./Pages/Dashbord/JobsitList"));
const JobsitHub = lazy(() => import("./Pages/Dashbord/Dashbordhub"));
const About = lazy(() => import('./Pages/About/About'));
const Pricing = lazy(() => import('./Pages/Pricing/Pricing'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

const App: React.FC = () => (
  <Suspense fallback={<LoadingFallback />}>
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Routes protégées */}
      <Route path="/dashboard" element={<ProtectedRoute><JobsitList /></ProtectedRoute>} />
      <Route path="/dashboard/:id" element={<ProtectedRoute><JobsitHub /></ProtectedRoute>} />
      <Route path="/dashboard/:id/armature" element={<ProtectedRoute><DashboardArmature /></ProtectedRoute>} />
      <Route path="/dashboard/:id/:dbId" element={<ProtectedRoute><DashboardDetail /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
      <Route path="/worksites" element={<ProtectedRoute><Worksites /></ProtectedRoute>} />
      <Route path="/planning" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default App;
