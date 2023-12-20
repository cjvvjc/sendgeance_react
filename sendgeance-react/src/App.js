import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
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
  const [patheticCount, setPatheticCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);

  const updateDates = (startDate, endDate) => {
    setDates({ startDate, endDate });
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/session/latest');
        const data = response.data;
        setPatheticCount(data.patheticCount);
        setMediumCount(data.mediumCount);
        setHardCount(data.hardCount);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
  
    fetchCounts();
  }, []);

  function TryHardTrackerWrapper() {
    const location = useLocation();
    const trackerPaths = ['/workouts/new', '/workouts/:id', '/workout/edit/:id', '/workout/current', '/workouts/all'];
    const shouldDisplayTracker = trackerPaths.some((path) => location.pathname.startsWith(path));
  
    return shouldDisplayTracker ? <TryHardTracker 
        startDate={dates.startDate}
        endDate={dates.endDate}
        patheticCount={patheticCount} 
        setPatheticCount={setPatheticCount} 
        mediumCount={mediumCount} 
        setMediumCount={setMediumCount} 
        hardCount={hardCount} 
        setHardCount={setHardCount}
      /> : null;
  }
  
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage username={username} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage setUsername={setUsername} />} />       
        <Route path="/workouts/new" element={
          <NewWorkoutPage
            updateDates={updateDates} 
            patheticCount={patheticCount} 
            setPatheticCount={setPatheticCount}
            mediumCount={mediumCount} 
            setMediumCount={setMediumCount}
            hardCount={hardCount} 
            setHardCount={setHardCount}
          />
        } />
        <Route path="/workouts/:id" element={
          <WorkoutPage 
            updateDates={updateDates} 
            patheticCount={patheticCount} 
            setPatheticCount={setPatheticCount}
            mediumCount={mediumCount} 
            setMediumCount={setMediumCount}
            hardCount={hardCount} 
            setHardCount={setHardCount}
          />
        } />
        <Route path="/workout/edit/:id" element={
          <EditWorkoutPage
            updateDates={updateDates} 
            patheticCount={patheticCount} 
            setPatheticCount={setPatheticCount}
            mediumCount={mediumCount} 
            setMediumCount={setMediumCount}
            hardCount={hardCount} 
            setHardCount={setHardCount}
          />
        } />
        <Route path="/workout/current" element={
          <CurrentWorkoutPage
            updateDates={updateDates}
            patheticCount={patheticCount} 
            setPatheticCount={setPatheticCount}
            mediumCount={mediumCount} 
            setMediumCount={setMediumCount}
            hardCount={hardCount} 
            setHardCount={setHardCount}
          />
        } />
        <Route path="/workouts/all" element={
          <AllWorkoutsPage 
            updateDates={updateDates} 
            patheticCount={patheticCount} 
            setPatheticCount={setPatheticCount}
            mediumCount={mediumCount} 
            setMediumCount={setMediumCount}
            hardCount={hardCount} 
            setHardCount={setHardCount}
          />
        } />
      </Routes>
      <TryHardTrackerWrapper />
    </Router>
  );
};

export default App;