import React from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import WorkoutPage from './pages/WorkoutPage';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/workouts/new" element={<NewWorkoutPage/>} />
        <Route path="/workouts/:id" element={<WorkoutPage/>} />
      </Routes>
    </Router>
  );
};

export default App;