import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './AuthContext';
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
import ProtectedRoute from './ProtectedRoute';

axios.defaults.withCredentials = true;

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
        if (response.status === 200) {
          const data = response.data;
          setPatheticCount(data.patheticCount || 0);
          setMediumCount(data.mediumCount || 0);
          setHardCount(data.hardCount || 0);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
        // Reset counts if no session data found
        if (error.response && error.response.status === 404) {
          setPatheticCount(0);
          setMediumCount(0);
          setHardCount(0);
        }
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
    <AuthProvider>
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
                patheticCount={patheticCount} 
                setPatheticCount={setPatheticCount}
                mediumCount={mediumCount} 
                setMediumCount={setMediumCount}
                hardCount={hardCount} 
                setHardCount={setHardCount}
              />
            </ProtectedRoute>
          } />
          <Route path="/workouts/:id" element={
            <ProtectedRoute>
              <WorkoutPage 
                updateDates={updateDates} 
                patheticCount={patheticCount} 
                setPatheticCount={setPatheticCount}
                mediumCount={mediumCount} 
                setMediumCount={setMediumCount}
                hardCount={hardCount} 
                setHardCount={setHardCount}
              />
            </ProtectedRoute>
          } />
          <Route path="/workout/edit/:id" element={
            <ProtectedRoute>
              <EditWorkoutPage
                updateDates={updateDates} 
                patheticCount={patheticCount} 
                setPatheticCount={setPatheticCount}
                mediumCount={mediumCount} 
                setMediumCount={setMediumCount}
                hardCount={hardCount} 
                setHardCount={setHardCount}
              /> 
            </ProtectedRoute>
          } />
          <Route path="/workout/current" element={
            <ProtectedRoute>
              <CurrentWorkoutPage
                updateDates={updateDates}
                patheticCount={patheticCount} 
                setPatheticCount={setPatheticCount}
                mediumCount={mediumCount} 
                setMediumCount={setMediumCount}
                hardCount={hardCount} 
                setHardCount={setHardCount}
              />
            </ProtectedRoute>
          } />
          <Route path="/workouts/all" element={
            <ProtectedRoute>
              <AllWorkoutsPage 
                updateDates={updateDates} 
                patheticCount={patheticCount} 
                setPatheticCount={setPatheticCount}
                mediumCount={mediumCount} 
                setMediumCount={setMediumCount}
                hardCount={hardCount} 
                setHardCount={setHardCount}
              />
            </ProtectedRoute>
          } />
        </Routes>
        <TryHardTrackerWrapper />
      </Router>
    </AuthProvider>
  );
};

export default App;