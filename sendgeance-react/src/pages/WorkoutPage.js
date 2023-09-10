import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';

const WorkoutPage = () => {
  const [workout, setWorkout] = useState({
    title: "", //! need to change to stuff for tracking workouts
    author: "",
    image: "",
    content: ""
  });

  const {id} = useParams() // 

  // hook to perform an operation once and then perform it again if certain conditions are met
  useEffect(() => {
    const fetchWorkout = async () => {
      const res = await axios.get(`http://localhost:5500/posts/${id}`);
      setWorkout(res.data);
    };
    fetchWorkout();
  },[id]);

  return(
    <Container className='mt-4'>
      <Card>
        <div style={{maxHeight: '500px', overflow:'hidden'}}>
          <Card.Img className='img-fluid' variant='top' src={workout.image} alt={workout.title} />
        </div>
        <Card.Body>
          <Card.Title>{workout.title}</Card.Title>
          <Card.Subtitle className='mb-2 text-muted'>By: {workout.author}</Card.Subtitle>
          <Card.Text>{workout.content}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WorkoutPage;