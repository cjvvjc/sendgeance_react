import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import WorkoutPage from './pages/WorkoutPage';
import EditWorkoutPage from './pages/EditWorkoutPage';
import NavBar from './components/NavBar';
import CurrentWorkoutPage from './pages/CurrentWorkoutPage';
import AllWorkoutsPage from './pages/AllWorkoutsPage';
import TryHardTracker from './components/TryHardTracker';

function App() {
  const [dates, setDates] = useState({ startDate: null, endDate: null })
  const updateDates = (startDate, endDate) => {
    setDates({ startDate, endDate });
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workouts/new" element={<NewWorkoutPage updateDates={updateDates} />} />
        <Route path="/workouts/:id" element={<WorkoutPage />} />
        <Route path="/workout/edit/:id" element={<EditWorkoutPage />} />
        <Route path="/workout/current" element={<CurrentWorkoutPage updateDates={updateDates} />} />
        <Route path="/workouts/all" element={<AllWorkoutsPage />} />
      </Routes>
      <TryHardTracker startDate={dates.startDate} endDate={dates.endDate} />
    </Router>
  );
};

export default App;