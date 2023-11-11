import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
  const [workoutsByDay, setWorkoutsByDay] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/workouts`);
        const groupedWorkouts = groupWorkoutsByDay(res.data)
        setWorkoutsByDay(groupedWorkouts);
      } catch (error) {
        console.error("Error fetching workouts", error)
      }
    }
    fetchWorkouts()
  },[]);

  const groupWorkoutsByDay = (workouts) => {
    const grouped = {};
    workouts.forEach((workout) => {
      const createdAt = new Date(workout.createdAt).toLocaleDateString();
      if (!grouped[createdAt]) {
        grouped[createdAt] = [workout];
      } else {
        grouped[createdAt].push(workout)
      }
    });
    return grouped;
  }
  
  const handleDelete = async (id) => {
    try {
      const updatedWorkoutsByDay = { ...workoutsByDay };
      Object.keys(updatedWorkoutsByDay).forEach((day) => {
        updatedWorkoutsByDay[day] = updatedWorkoutsByDay[day].filter(
          (workout) => workout._id !== id
        );
      });
      setWorkoutsByDay(updatedWorkoutsByDay);
    } catch (error) {
      console.error('Error deleting workout', error);
    };
  };

  return (
    <Container>
      {Object.keys(workoutsByDay).map((day) => (
        <div key={day}>
          <h2>{day}</h2>
          <Row className="mt-4">
            {workoutsByDay[day].map((workout) => (
              <Col md={4} className='mb-4' key={workout._id}>
                <Card style={{width: '18rem'}}>
                  {/* <Card.Img variant='top' src={workout.send} alt="" /> */}
                  <Card.Body>
                    <Card.Title>{workout.exerciseGroup}</Card.Title>
                    <Card.Text>Exercise: {workout.exercise}</Card.Text>
                    <Card.Text>Grade: {workout.grade}</Card.Text>
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
        </div>
      ))}
    </Container>
  );
};

export default HomePage;