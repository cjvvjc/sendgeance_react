import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await axios.get(`http://localhost:5500/posts`);
      setWorkouts(res.data);
    };
    fetchWorkouts();
  },[]);
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/posts/${id}`); // remove from database
      setWorkouts(workouts.filter(() => workouts._id !== id)); // update state, filter it, remove item from state
    } catch (error) {
      console.error('Error deleting post', error);
    };
  };

  return (
    <Container>
      <Row>
        {workouts.map((workout) => (
          <Col md={4} className='mb-4' key={workout._id}>
            <Card style={{width: '18rem'}}>
            <Card.Img variant='top' src={workout.image} alt={workout.title} />
            <Card.Body>
              <Card.Title>{workout.title}</Card.Title>
              <Card.Text>{workout.author}</Card.Text>
              <Link to={`/posts/${post._id}`}>
                <Button variant='primary' className='mr-2'>Read More</Button>
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