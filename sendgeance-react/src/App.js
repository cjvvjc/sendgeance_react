import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import WorkoutPage from './pages/WorkoutPage';
import EditWorkoutPage from './pages/EditWorkoutPage';
import NavBar from './components/NavBar';
import CurrentWorkoutPage from './pages/CurrentWorkoutPage';
import AllWorkoutsPage from './pages/AllWorkoutsPage';
import TryHardTracker from './components/TryHardTracker';

function App() {
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [username, setUsername] = useState("");

  const updateDates = (startDate, endDate) => {
    setDates({ startDate, endDate });
  };

  function TryHardTrackerWrapper() {
    const location = useLocation();
    const trackerPaths = ['/workouts/new', '/workouts/:id', '/workout/edit/:id', '/workout/current', '/workouts/all'];
    const shouldDisplayTracker = trackerPaths.some((path) => location.pathname.startsWith(path));
  
    return shouldDisplayTracker ? <TryHardTracker startDate={dates.startDate} endDate={dates.endDate} /> : null;
  }
  
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage username={username} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage setUsername={setUsername} />} />       
        <Route path="/workouts/new" element={<NewWorkoutPage updateDates={updateDates} />} />
        <Route path="/workouts/:id" element={<WorkoutPage />} />
        <Route path="/workout/edit/:id" element={<EditWorkoutPage />} />
        <Route path="/workout/current" element={<CurrentWorkoutPage updateDates={updateDates} />} />
        <Route path="/workouts/all" element={<AllWorkoutsPage />} />
      </Routes>
      <TryHardTrackerWrapper />
    </Router>
  );
};

export default App;