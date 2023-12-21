import React, { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';


const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const { apiUrl } = useContext(AuthContext);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/check`);
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
