import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await axios.get(`http://localhost:5000/workouts`);
      setWorkouts(res.data);
    }
    fetchWorkouts()
  },[]);
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/workouts/${id}`);
      setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout._id !== id));
      
    } catch (error) {
      console.error('Error deleting workout', error);
    };
  };

  return (
    <Container>
      <Row className="mt-4">
        {workouts.map((workout) => (
          <Col md={4} className='mb-4' key={workout._id}>
            <Card style={{width: '18rem'}}>
              {/* <Card.Img variant='top' src={workout.send} alt="" /> */}
              <Card.Body>
                <Card.Title>{workout.exerciseGroup}</Card.Title>
                <Card.Text>Exercise: {workout.exercise}</Card.Text>
                <Card.Text>Attempts: {workout.attempts}</Card.Text>
                <Card.Text>{workout.angle}</Card.Text>
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
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;