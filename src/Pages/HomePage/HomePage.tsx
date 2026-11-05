import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import HomeDashboard from './HomeDashboard';
import LandingPage from './LandingPage';

// Tableau de bord pour un utilisateur connecté, page de présentation sinon
const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <HomeDashboard /> : <LandingPage />;
};

export default HomePage;
