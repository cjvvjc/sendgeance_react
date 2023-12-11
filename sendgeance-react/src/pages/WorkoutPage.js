import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Container, Image } from 'react-bootstrap';
import logo from "../images/logo-black.jpeg"

const WorkoutPage = () => {
  const [workout, setWorkout] = useState({
    exercise: "",
    attempts: "",
    grade: "",
    angle: "",
    send: "",
    createdAt: ""
  });

  const {id} = useParams() // 

  // hook to perform an operation once and then perform it again if certain conditions are met
  useEffect(() => {
    const fetchWorkout = async () => {
      const res = await axios.get(`http://localhost:5000/workouts/${id}`);
      setWorkout(res.data);
    };
    fetchWorkout();
  },[id]);

  const formattedCreatedAt = new Date(workout.createdAt).toLocaleString('en-US', {
    timeZone: 'America/Denver', // Mountain Time Zone
  });

  return(
    <Container className='mt-4' style={{ marginBottom: '100px' }}>
      <Image className="img-fluid" src={logo} alt="" />
      <Card>
        <div style={{maxHeight: '500px', overflow:'hidden'}}>
          <Card.Img className='img-fluid' variant='top' src={workout.send} alt={workout.exercise} />
        </div>
        <Card.Body>
          <Card.Title>Exercise: {workout.exercise}</Card.Title>
          <Card.Subtitle className='mb-2 text-muted'>Attempts: {workout.attempts}</Card.Subtitle>
          <Card.Text>Grade: {workout.grade}</Card.Text>
          <Card.Text>Created At: {formattedCreatedAt}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WorkoutPage;