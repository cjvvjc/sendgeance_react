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
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [username, setUsername] = useState("");

  const updateDates = (startDate, endDate) => {
    setDates({ startDate, endDate });
  };

  
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
                <NewWorkoutPage
                  updateDates={updateDates} 
                />
              </ProtectedRoute>
            } />
            <Route path="/workouts/:id" element={
              <ProtectedRoute>
                <WorkoutPage 
                  updateDates={updateDates} 
                />
              </ProtectedRoute>
            } />
            <Route path="/workout/edit/:id" element={
              <ProtectedRoute>
                <EditWorkoutPage
                  updateDates={updateDates} 
                /> 
              </ProtectedRoute>
            } />
            <Route path="/workout/current" element={
              <ProtectedRoute>
                <CurrentWorkoutPage
                  updateDates={updateDates}
                />
              </ProtectedRoute>
            } />
            <Route path="/workouts/all" element={
              <ProtectedRoute>
                <AllWorkoutsPage 
                  updateDates={updateDates} 
                />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </SessionProvider>
      
    </AuthProvider>
  );
};

export default App;