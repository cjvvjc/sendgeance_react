import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Form, Image, Dropdown} from 'react-bootstrap';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import logo from "../images/logo-black.jpeg"
import TryHardTracker from "../components/TryHardTracker";


//stop when get to here
const moment = require("moment");

const CurrentWorkoutPage = ({ updateDates, patheticCount, setPatheticCount, mediumCount, setMediumCount, hardCount, setHardCount }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [sessionTimes, setSessionTimes] = useState({ startTime: null, endTime: null });
  const [showSessionTimes, setShowSessionTimes] = useState(false);
  const [totalProblems, setTotalProblems] = useState(null);
  const [totalBoulderingProblems, setTotalBoulderingProblems] = useState(null);
  const [vPointSum, setVPointSum] = useState(null);
  const [vPointAverage, setVPointAverage] = useState(null);
  const [sessionDensity, setSessionDensity] = useState(null);
  const [boulderingSessionDensity, setBoulderingSessionDensity] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [sentCardsCount, setSentCardsCount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showSessionDensity, setShowSessionDensity] = useState(false);
  const [vPointBoulderingSum, setVPointBoulderingSum] = useState(null);
  const [boulderingSessionTime, setBoulderingSessionTime] = useState(null);

  const [rateOfPerceivedExertion, setRateOfPerceivedExertion] = useState(() => {
    const storedRpeValue = localStorage.getItem('rateOfPerceivedExertion');
    return storedRpeValue !== null ? parseInt(storedRpeValue, 10) : 0;
  });

  const navigate = useNavigate();

  // Calculate total session time in minutes
  const totalSessionTimeInMinutes = useCallback(() => {
    const sessionTimes = currentWorkout.map(workout => new Date(workout.createdAt));
  
    if (sessionTimes.length > 0) {
      const startTime = new Date(Math.min(...sessionTimes));
      const endTime = new Date(Math.max(...sessionTimes));
      const diffInMilliseconds = endTime - startTime;
      return Math.round(diffInMilliseconds / (60 * 1000)); // Convert milliseconds to minutes
    }
    return null;
  }, [currentWorkout]);

  // Calculate total amount of time spent Bouldering as exerciseGroup
  const totalBoulderingSessionTimeInMinutes = useCallback(() => {
    const boulderingSessionTimes = currentWorkout
      .filter(workout => workout.exerciseGroup === "Bouldering")
      .map(workout => new Date(workout.createdAt))
      .sort((a, b) => a - b);
  
    let totalBoulderingSessionTime = 0;
  
    for (let i = 1; i < boulderingSessionTimes.length; i++) {
      const startTime = boulderingSessionTimes[i - 1];
      const endTime = boulderingSessionTimes[i];
      const diffInMilliseconds = endTime - startTime;
      totalBoulderingSessionTime += Math.round(diffInMilliseconds / (60 * 1000));
    }
  
    return totalBoulderingSessionTime;
  }, [currentWorkout]);

  useEffect(() => {
    const calculateTotalAttempts = () => {
      const totalAttempts = currentWorkout.reduce((sum, workout) => {
        const attemptsValue = workout.attempts === "Flash" ? 1 : parseInt(workout.attempts, 10) || 0;
        return sum + attemptsValue;
      }, 0);
      setTotalAttempts(totalAttempts);
    };

    const calculateSentCardsCount = () => {
      const sentCards = currentWorkout.filter((workout) => workout.send === true);
      setSentCardsCount(sentCards.length);
    };

    if (Array.isArray(currentWorkout) && currentWorkout.length > 0) {
      calculateTotalAttempts();
      calculateSentCardsCount();
    }
  }, [currentWorkout]);

  useEffect(() => {
    const fetchInitialRpe = async () => {
      // Replace with your actual API endpoint to fetch RPE
      const res = await axios.get('http://localhost:5000/session/latest-rpe');
      if (res.data) {
        setRateOfPerceivedExertion(res.data.rateOfPerceivedExertion);
      }
    };
  
    fetchInitialRpe();
  }, []);  

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const selectedMoment = moment(selectedDate);

        const startDate = selectedMoment.startOf('day').toDate();
        const endDate = selectedMoment.endOf('day').toDate();

        const params = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };

        const res = await axios.get(`http://localhost:5000/workout/current`, { params });
        const newCurrentWorkout = res.data

        if (JSON.stringify(currentWorkout) !== JSON.stringify(newCurrentWorkout)) {
          setCurrentWorkout(newCurrentWorkout);
        }

        // Calculate session start and end times
        const sessionTimes = currentWorkout.map(workout => new Date(workout.createdAt));
        if (sessionTimes.length > 0) {
          const startTime = new Date(Math.min(...sessionTimes));
          const endTime = new Date(Math.max(...sessionTimes));
          setSessionTimes({ startTime, endTime });
        } else {
          setSessionTimes({ startTime: null, endTime: null });
        }

        const totalProblems = res.data.length;
        setTotalProblems(totalProblems);

        const vPointSum = res.data.reduce((sum, workout) => {
          return sum + parseInt(workout.grade.substring(1), 10);
        }, 0);

        setVPointSum(vPointSum);

        const vPointAvg = totalProblems > 0 ? Math.round((vPointSum / totalProblems) * 10) / 10 : 0;
        setVPointAverage(vPointAvg);

        const sessionTimeInMinutes = totalSessionTimeInMinutes();
        const sessionDensityValue = sessionTimeInMinutes > 0 ? (vPointSum / sessionTimeInMinutes).toFixed(2) : 0;
        setSessionDensity(sessionDensityValue);

        //Calculate session start and end times for bouldering problems
        const boulderingSessionTimes = currentWorkout
        .filter(workout => workout.exerciseGroup === "Bouldering")
        .map(workout => new Date(workout.createdAt));

        if (boulderingSessionTimes.length > 0) {
          const boulderingStartTime = new Date(Math.min(...boulderingSessionTimes));
          const boulderingEndTime = new Date(Math.max(...boulderingSessionTimes));
          setSessionTimes({ startTime: boulderingStartTime, endTime: boulderingEndTime });
        } else {
          setSessionTimes({ startTime: null, endTime: null });
        }

        // Calculate session Density 
        const boulderingProblems = currentWorkout.filter(workout => workout.exerciseGroup === "Bouldering");
        setTotalBoulderingProblems(boulderingProblems.length);

        const vPointBoulderingSum = boulderingProblems.reduce((sum, workout) => {
          return sum + parseInt(workout.grade.substring(1), 10);
        }, 0);
        setVPointBoulderingSum(vPointBoulderingSum);

        const boulderingSessionTimeInMinutes = totalBoulderingSessionTimeInMinutes();
        setBoulderingSessionTime(boulderingSessionTimeInMinutes);

        const boulderingProblemSessionDensity = boulderingSessionTimeInMinutes > 0 ? (vPointBoulderingSum / boulderingSessionTimeInMinutes).toFixed(2) : 0;
        setBoulderingSessionDensity(boulderingProblemSessionDensity);

        const sessionData = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          rateOfPerceivedExertion,
          totalProblems,
          vSum: vPointSum,
          vAvg: vPointAverage,
          sessionDensity,
          boulderingSessionDensity
        };

        setStartDate(startDate);
        setEndDate(endDate);

        updateDates(startDate, endDate)

        // Send a POST request to create or update the Session entry
        await axios.post('http://localhost:5000/session/update', sessionData);

        localStorage.setItem('rateOfPerceivedExertion', rateOfPerceivedExertion.toString());

      } catch (error) {
        console.error("Error fetching workout", error);
      }
    };
    fetchWorkout()
  },[selectedDate, totalSessionTimeInMinutes, rateOfPerceivedExertion, vPointSum, sessionDensity, vPointAverage, boulderingSessionDensity, totalBoulderingSessionTimeInMinutes]);

  const handleRpeSelect = async (value) => {
    setRateOfPerceivedExertion(value);
    // Replace with your actual API endpoint to update RPE
    await axios.post('http://localhost:5000/session/update-rpe', { rateOfPerceivedExertion: value });
  };
  
  useEffect(() => {
    const today = moment().startOf('day');
    const selectedMoment = moment(selectedDate).startOf('day');
  
    if (!selectedMoment.isSame(today)) {
      setRateOfPerceivedExertion(0);
      axios.post('http://localhost:5000/session/update-rpe', { rateOfPerceivedExertion: 0 });
    }
  }, [selectedDate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/workouts/${id}`);
      setCurrentWorkout(prevWorkouts => prevWorkouts.filter(workout => workout._id !== id));

    } catch (error) {
      console.error('Error deleting workout', error);
    };
  };

  const toggleSessionTimes = () => {
    setShowSessionTimes(!showSessionTimes);
  };

  const handleEndSession = async () => {
    try {
      // Add any additional logic you need before submitting data
  
      // Example: Save additional data or perform any final calculations
      const sessionData = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        rateOfPerceivedExertion,
        totalProblems,
        vSum: vPointSum,
        vAvg: vPointAverage,
        sessionDensity,
        boulderingSessionDensity
      };
  
      // Submit data to the database
      await axios.post('http://localhost:5000/session/update', sessionData);

      // Optionally, you can reset or perform any cleanup after ending the session
      // Reset the state, clear local storage, etc.

      // Reset RPE to 0
      setRateOfPerceivedExertion(0);
      await axios.post('http://localhost:5000/session/update-rpe', { rateOfPerceivedExertion: 0 });

      console.log('Session ended and data submitted successfully!');

      navigate('/');
    } catch (error) {
      console.error('Error ending session and submitting data:', error);
    }
  };

  useEffect(() => {
    const today = moment().startOf('day');
    const selectedMoment = moment(selectedDate).startOf('day');
  
    if (!selectedMoment.isSame(today)) {
      setRateOfPerceivedExertion(0);
      localStorage.setItem('rateOfPerceivedExertion', '0');
    }
  }, [selectedDate]);

  useEffect(() => {
    const sessionTime = totalSessionTimeInMinutes();
    const boulderingSessionTime = totalBoulderingSessionTimeInMinutes();
  
    console.log("Total Session Time (in minutes):", sessionTime);
    console.log("Total Bouldering Session Time (in minutes):", boulderingSessionTime);
  
  }, [totalSessionTimeInMinutes, totalBoulderingSessionTimeInMinutes]);

  return (
    <Container style={{ marginBottom: '100px' }}>
      <Image className="img-fluid" src={logo} alt=""/>
      <Row className="mt-4">
        <Col>
        <Form.Group controlId="datePicker">
          <Form.Label>Select Date:</Form.Label>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)}/>
        </Form.Group>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <p>How Hard Was Your Session? {rateOfPerceivedExertion !== null ? rateOfPerceivedExertion : 'Select an RPE'}</p>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Select RPE
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {[...Array(10)].map((_, index) => (
                <Dropdown.Item key={index + 1} onClick={() => handleRpeSelect(index + 1)}>
                  {index + 1}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="mt-2 mb-2">
        <Col xs={12}>
        <p style={{ cursor: "pointer", marginBottom: "0" }} onClick={toggleSessionTimes}>
        {showSessionTimes ? "▲" : "▼"} Total Session Time: {totalSessionTimeInMinutes()} minutes
          </p>
          {showSessionTimes && (
            <div>
              <p style={{ marginLeft: "2em", marginBottom: "0" }}>
                Session Start Time: {sessionTimes.startTime ? sessionTimes.startTime.toLocaleString() : 'N/A'}
              </p>
              <p style={{ marginLeft: "2em", marginBottom: "0" }}>
                Session End Time: {sessionTimes.endTime ? sessionTimes.endTime.toLocaleString() : 'N/A'}
              </p>
            </div>
          )}
          
          <p style={{ marginBottom: "0" }}>Total Problems: {totalProblems}</p>
          <p style={{ marginBottom: "0" }}>V Sum: {vPointSum}</p>
          <p style={{ marginBottom: "0" }}>V Avg: {vPointAverage}</p>
          <p
            style={{ cursor: "pointer", marginBottom: "0" }}
            onClick={() => setShowSessionDensity(!showSessionDensity)}
          >
            {showSessionDensity ? "▲" : "▼"} Session Density: {boulderingSessionDensity}
          </p>
          {showSessionDensity && (
            <div>
              <p style={{ marginLeft: "2em", marginBottom: "0" }}>
                V Point Sum: {vPointBoulderingSum}
              </p>
              <p style={{ marginLeft: "2em", marginBottom: "0" }}>
                Bouldering Session Time: {boulderingSessionTime} minutes
              </p>
              <p style={{ marginLeft: "2em", marginBottom: "0" }}>
                Total Boulder Problems: {totalBoulderingProblems}
              </p>
            </div>
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <p style={{ marginBottom: "0" }}>Total Attempts: {totalAttempts}</p>
          <p style={{ marginBottom: "0" }}>Sends: {sentCardsCount}</p>
        </Col>
      </Row>
      <Row className="mt-4">
        {currentWorkout && Array.isArray(currentWorkout) && currentWorkout.length > 0 ? (
          currentWorkout.map((workout) => (
            <Col md={3} className='mb-4' key={workout._id}>
              <Card style={{width: '18rem'}}>
                <Card.Body>
                  <Card.Title>{workout.exerciseGroup}</Card.Title>
                  <Card.Text style={{ marginBottom: "0" }}>Exercise: {workout.exercise}</Card.Text>
                  <Card.Text style={{ marginBottom: "0" }}>Grade: {workout.grade}</Card.Text>
                  <Card.Text style={{ marginBottom: "0" }}>Attempts: {workout.attempts}</Card.Text>
                  <Card.Text style={{ marginBottom: "0" }}>{workout.angle}</Card.Text>
                  <Card.Text style={{ marginBottom: "0" }}>
                    {workout.send ? "Sent" : "Project"}
                  </Card.Text>
                  <Link to={`/workouts/${workout._id}`}>
                    <Button variant='primary' className='mr-2'>Read More</Button>
                  </Link>
                  <Link to={`/workout/edit/${workout._id}`}>
                    <Button variant='secondary'>Edit</Button>
                  </Link>
                  <Button variant='danger' onClick={() => handleDelete(workout._id)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
        ))
      ) : (
        <Col>
          <p>Loading...</p>
        </Col>
      )}
      </Row>
      <Button variant="primary" onClick={handleEndSession}>
        End Session and Submit Data
      </Button>
      <TryHardTracker
        startDate={startDate} 
        endDate={endDate}
        patheticCount={patheticCount} 
        setPatheticCount={setPatheticCount}
        mediumCount={mediumCount} 
        setMediumCount={setMediumCount}
        hardCount={hardCount} 
        setHardCount={setHardCount}
      />
    </Container>
  );
};

export default CurrentWorkoutPage;