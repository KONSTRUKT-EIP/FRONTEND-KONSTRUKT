import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  const login = (token) => {
    setAuthToken(token); 
    console.log("Token:", token); 
  };

  const logout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
