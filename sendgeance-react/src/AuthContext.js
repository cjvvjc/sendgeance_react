import React, { createContext, useState } from 'react';export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ apiUrl, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};