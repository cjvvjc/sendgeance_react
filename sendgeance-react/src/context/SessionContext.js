import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

const initialStartDate = new Date().toISOString(); // Current date in ISO format
const initialEndDate = new Date().toISOString(); // Adjust as needed

const initialRateOfPerceivedExertion = 0; // Example initial value
const initialTotalProblems = 0; // Example initial value
const initialVSum = 0; // Example initial value
const initialVAvg = 0; // Example initial value
const initialSessionDensity = 0; // Example initial value
const initialBoulderingSessionDensity = 0; // Example initial value

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState({ 
    startDate: initialStartDate, 
    endDate: initialEndDate, 
    rateOfPerceivedExertion: initialRateOfPerceivedExertion,
    totalProblems: initialTotalProblems,
    vSum: initialVSum,
    vAvg: initialVAvg,
    sessionDensity: initialSessionDensity,
    boulderingSessionDensity: initialBoulderingSessionDensity,
  });
  
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    let isComponentMounted = true;
  
    const fetchInitialSessionData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/session/latest');
        if (response.data && isComponentMounted) {
          setSessionData(response.data);
          setIsDataFetched(true);
        }
      } catch (error) {
        console.error('Error fetching initial session data:', error);
      }
    };
  
    if (!isDataFetched) {
      fetchInitialSessionData();
    }
  
    return () => {
      isComponentMounted = false; // Cleanup function to avoid setting state on unmounted component
    };
  }, [isDataFetched]); // Only run on mount and when `isDataFetched` change  

  // API call to send session data update immediately
  useEffect(() => {
    const sendUpdate = async () => {
      try {
        await axios.post('http://localhost:5000/session/update', sessionData);
        setShouldUpdate(false); // Reset the flag after sending update
        console.log('Session data updated');
      } catch (error) {
        console.error('Error updating session data:', error);
      }
    };
  
    if (shouldUpdate && Object.keys(sessionData).length > 0) {
      sendUpdate();
    }
  }, [sessionData, shouldUpdate]);

  // Function to update session data
  const updateSession = (newData) => {
    setSessionData(prev => ({ ...prev, ...newData }));
    setShouldUpdate(true); // Only set to true if user initiated the change
  };

  return (
    <SessionContext.Provider value={{ sessionData, updateSession }}>
      {isDataFetched ? children : <div>Loading...</div>}
    </SessionContext.Provider>
  );
};
