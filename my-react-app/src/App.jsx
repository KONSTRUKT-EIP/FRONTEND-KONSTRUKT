import React from 'react';
import { AuthProvider, useAuth } from './Context/AuthContext';
import Login from './Components/Login';
import HomePage from './Components/HomePage';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ProtectedRoute />
      </div>
    </AuthProvider>
  );
}

function ProtectedRoute() {
  const { authToken } = useAuth();
  return authToken ? <HomePage /> : <Login />;
}

export default App;
