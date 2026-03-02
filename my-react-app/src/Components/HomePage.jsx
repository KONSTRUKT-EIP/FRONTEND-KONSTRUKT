import React from 'react';
import { useAuth } from '../Context/AuthContext';

function HomePage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Page d'accueil</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}

export default HomePage;
