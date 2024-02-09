import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './AuthContext';
import { SessionProvider } from './context/SessionContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import WorkoutPage from './pages/WorkoutPage';
import EditWorkoutPage from './pages/EditWorkoutPage';
import NavBar from './components/NavBar';
import CurrentWorkoutPage from './pages/CurrentWorkoutPage';
import AllWorkoutsPage from './pages/AllWorkoutsPage';
import ProtectedRoute from './ProtectedRoute';

axios.defaults.withCredentials = true;

function App() {
  const [username, setUsername] = useState("");
  
  return (
    <AuthProvider>
      <SessionProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage username={username} />
              </ProtectedRoute>
            } />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage setUsername={setUsername} />} />       
            <Route path="/workouts/new" element={
              <ProtectedRoute>
                <NewWorkoutPage />
              </ProtectedRoute>
            } />
            <Route path="/workouts/:id" element={
              <ProtectedRoute>
                <WorkoutPage />
              </ProtectedRoute>
            } />
            <Route path="/workout/edit/:id" element={
              <ProtectedRoute>
                <EditWorkoutPage /> 
              </ProtectedRoute>
            } />
            <Route path="/workout/current" element={
              <ProtectedRoute>
                <CurrentWorkoutPage />
              </ProtectedRoute>
            } />
            <Route path="/workouts/all" element={
              <ProtectedRoute>
                <AllWorkoutsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </SessionProvider>
      
    </AuthProvider>
  );
};

export default App;