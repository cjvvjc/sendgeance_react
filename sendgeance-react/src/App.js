import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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

  console.log("app username", username);


  const updateDates = (startDate, endDate) => {
    setDates({ startDate, endDate });
  };

  // Define an array of paths where TryHardTracker should be displayed
  const trackerPaths = ['/workouts/new', '/workouts/:id', '/workout/edit/:id', '/workout/current', '/workouts/all'];

  // Check if the current path is in the trackerPaths array
  const currentPath = window.location.pathname;
  const shouldDisplayTracker = trackerPaths.some((path) => currentPath.startsWith(path));
  
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
      {shouldDisplayTracker && <TryHardTracker startDate={dates.startDate} endDate={dates.endDate} />}
    </Router>
  );
};

export default App;