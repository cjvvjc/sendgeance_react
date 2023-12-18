import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import logo from "../images/logo-black.jpeg"
import TryHardTracker from '../components/TryHardTracker';

const NewWorkoutPage = ({ updateDates }) => {
  
  //initialize state variable. create elements to store all info typed into form
  const [workout, setWorkout] = useState({
    exerciseGroup: "",
    exercise: "",
    attempts: "",
    grade: "",
    angle: "",
    send: ""
  });

  const [selectedExerciseType, setSelectedExerciseType] = useState("Select an Exercise");
  const [lastWorkoutDetails, setLastWorkoutDetails] = useState(null);
  // const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleExerciseChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedExerciseType(selectedValue);
    
    setWorkout(prevWorkout => ({
      ...prevWorkout,
      exerciseGroup: selectedValue,
    }));
  };

  const handleSendToggle = () => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      send: !prevWorkout.send, // Toggle the value
    }));
  };

  const fetchLastWorkout = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/workouts/last');
      const lastWorkout = res.data;

      if (lastWorkout) {
        setLastWorkoutDetails({
          exerciseGroup: lastWorkout.exerciseGroup,
          exercise: lastWorkout.exercise,
          grade: lastWorkout.grade,
          attempts: lastWorkout.attempts,
          angle: lastWorkout.angle,
          createdAt: lastWorkout.createdAt
          // Add more details as needed
         });

        const currentDate = new Date();
        setStartDate(currentDate);
        setEndDate(currentDate);

        updateDates(currentDate, currentDate);

        //  const storedSubmissionTime = localStorage.getItem('lastSubmissionTime');
        //  if (!storedSubmissionTime) {
        //     const currentSubmissionTime = new Date();
        //     var options = { timeZone: 'America/Denver', weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        //     setLastSubmissionTime(currentSubmissionTime.toLocaleString('en-US', options));

        //     localStorage.setItem('lastSubmissionTime', currentSubmissionTime.getTime());

            

        //  } else {
        //    setLastSubmissionTime(new Date(storedSubmissionTime));
        //  }
      }
    } catch (error) {
      console.error("Error fetching last workout:", error);
    }
      }, [setLastWorkoutDetails, setStartDate, setEndDate, updateDates]);
  
  const handleChange = e => {
    setWorkout({...workout, [e.target.name]: e.target.value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/workouts', workout);

    // setLastSubmissionTime(new Date());

    const currentDate = new Date();
    setStartDate(currentDate);
    setEndDate(currentDate);

    fetchLastWorkout();
  };

  useEffect(() => {
    // const storedSubmissionTime = localStorage.getItem('lastSubmissionTime');
    // if (storedSubmissionTime) {
    //   setLastSubmissionTime(new Date(storedSubmissionTime));
    // }
    // console.log(storedSubmissionTime)

    fetchLastWorkout();
  }, [fetchLastWorkout]);

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const currentDate = new Date();

  const exercises = [{
    type: "Warmup Exercises",
    choices: ["Contrast Warmup", "One Touch", "Hovers - Before", "Hovers - After", "Rooting Feet", "Rooting Hands", "Rooting Both", "Perfect Repeat", "Match Hand/Foot", "One Leg", "Deadpoint Practice", "Matching Techniques", "Free Climb"],
  }, {
    type: "Bouldering",
    choices: ["Limit", "Strength"],
  // }, {
  //   type: "Routes",
  //   choices: ["Redpoint", "Free Climb"],
  // }, {
  //   type: "Hangboard",
  //   choices: ["Max Hangs", "Repeaters"],
  // }, {
  //   type: "Power Endurance",
  //   choices: ["On The Minute", "4x4", "Linked Boulders"],
  // }, {
  //   type: "Endurance",
  //   choices: ["Doubles", "Volume"],
  }
  // , {
  //   type: "Weight Room",
  //   choices: ["Pull Ups", "Push Ups", "Front Lever", "Superman"]
  // }
];

  const exerciseSelector = exercises.map((exerciseGroup, index) => (
    <option key={index} value={exerciseGroup.type}>
      {exerciseGroup.type}
    </option>
  ));

  return(
    <Container className='mt-4' style={{ marginBottom: '100px' }}>
      <Image className="img-fluid" src={logo} alt="" />
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Select name="exerciseGroup" onChange={handleExerciseChange}>
              <option>{selectedExerciseType}</option>
              {exerciseSelector}
            </Form.Select>
          </ Form.Group>
          
          <Form.Group>
            <Form.Select name="exercise" onChange={handleChange}>
              <option value="">Exercise</option>
              {
                exercises
                  .find((exercise) => exercise.type === selectedExerciseType)
                  ?.choices.map((choice) => (
                    <option key={choice} value={choice}>
                      {choice}
                    </option>
                  ))
              }
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Select name="attempts" onChange={handleChange}>
              <option value="">Attempts</option>
              <option value="Flash">Flash</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="30">30</option>
              <option value="31">31</option>
              <option value="32">32</option>
              <option value="33">33</option>
              <option value="34">34</option>
              <option value="35">35</option>
              <option value="36">36</option>
              <option value="37">37</option>
              <option value="38">38</option>
              <option value="39">39</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
              <option value="43">43</option>
              <option value="44">44</option>
              <option value="45">45</option>
              <option value="46">46</option>
              <option value="47">47</option>
              <option value="48">48</option>
              <option value="49">49</option>
              <option value="50">50</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Select name="grade" onChange={handleChange}>
              <option value="">Grade</option>
              <option value="V0">V0</option>
              <option value="V1">V1</option>
              <option value="V2">V2</option>
              <option value="V3">V3</option>
              <option value="V4">V4</option>
              <option value="V5">V5</option>
              <option value="V6">V6</option>
              <option value="V7">V7</option>
              <option value="V8">V8</option>
              <option value="V9">V9</option>
              <option value="V10">V10</option>
              <option value="V11">V11</option>
              <option value="V12">V12</option>
              <option value="V13">V13</option>
              <option value="V14">V14</option>
              <option value="V15">V15</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Select name="angle" onChange={handleChange}>
              <option value="">Angle</option>
              <option value="slab">slab</option>
              <option value={"0\u00b0"}>{'0\u00b0'}</option>
              <option value={"5\u00b0"}>{'5\u00b0'}</option>
              <option value={"10\u00b0"}>{'10\u00b0'}</option>
              <option value={"15\u00b0"}>{'15\u00b0'}</option>
              <option value={"20\u00b0"}>{'20\u00b0'}</option>
              <option value={"25\u00b0"}>{'25\u00b0'}</option>
              <option value={"30\u00b0"}>{'30\u00b0'}</option>
              <option value={"35\u00b0"}>{'35\u00b0'}</option>
              <option value={"40\u00b0"}>{'40\u00b0'}</option>
              <option value={"45\u00b0"}>{'45\u00b0'}</option>
              <option value={"50\u00b0"}>{'50\u00b0'}</option>
              <option value={"55\u00b0"}>{'55\u00b0'}</option>
              <option value={"60\u00b0"}>{'60\u00b0'}</option>
              <option value={"65\u00b0"}>{'65\u00b0'}</option>
              <option value={"70\u00b0"}>{'70\u00b0'}</option>
              <option value={"75\u00b0"}>{'75\u00b0'}</option>
              <option value={"80\u00b0"}>{'80\u00b0'}</option>
              <option value={"85\u00b0"}>{'85\u00b0'}</option>
              <option value={"90\u00b0"}>{'90\u00b0'}</option>
            </Form.Select>
            
            <Button
              variant={workout.send ? "success" : "outline-success"} // Use primary color if selected, outline otherwise
              onClick={handleSendToggle}
            >
              {workout.send ? "Sent!" : "Send?"}
        </Button>
          </Form.Group>

          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
        {lastWorkoutDetails && isSameDay(new Date(lastWorkoutDetails.createdAt), currentDate) && (
  <Container className='mt-4'>
    <Row>
      <Col>
        <p className='mb-1'>Last Submission:</p>
        {lastWorkoutDetails.createdAt && (
          <p className='mb-1'>
            {`${new Date(lastWorkoutDetails.createdAt).toLocaleString('en-US', {
              timeZone: 'America/Denver',
              month: 'numeric',
              day: 'numeric',
              year: '2-digit',
            })} ${new Date(lastWorkoutDetails.createdAt).toLocaleTimeString('en-US', {
              timeZone: 'America/Denver',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            })}`}
          </p>
        )}
        {/* <p className='mb-1'>{lastSubmissionTime && lastSubmissionTime.toLocaleString('en-US', { timeZone: 'America/Denver' })}</p> */}
      </Col>
    </Row>
    <Row>
      <Col>
        <p className='mb-1'>{lastWorkoutDetails.exerciseGroup}</p>
        <p className='mb-1'>{lastWorkoutDetails.exercise}</p>
        <p className='mb-1'>{lastWorkoutDetails.grade}</p>
        {lastWorkoutDetails.attempts === "Flash" && (
          <p className='mb-1'>{lastWorkoutDetails.attempts}</p>
        )}
        {typeof (Number(lastWorkoutDetails.attempts)) === "number" && (
          <p className='mb-1'>{lastWorkoutDetails.attempts} attempts</p>
        )}
        <p className='mb-1'>{lastWorkoutDetails.angle}</p>
        {/* Add more details as needed */}
      </Col>
    </Row>
  </Container>
)}
  <TryHardTracker startDate={startDate} endDate={endDate} />  
      </Container>
  );
};

export default NewWorkoutPage;