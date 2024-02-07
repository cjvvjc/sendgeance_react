import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Image, ListGroup } from 'react-bootstrap';
import logo from "../images/logo-black.jpeg"

const AllWorkoutsPage = ({ updateDates }) => {
  const [workoutsByDay, setWorkoutsByDay] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/workouts/all`);
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
      await axios.delete(`http://localhost:5000/workouts/${id}`);
      
      // Update state after successful deletion
      setWorkoutsByDay(prevWorkoutsByDay => {
        const updatedWorkoutsByDay = { ...prevWorkoutsByDay };
        Object.keys(updatedWorkoutsByDay).forEach((day) => {
          updatedWorkoutsByDay[day] = updatedWorkoutsByDay[day].filter(
            (workout) => workout._id !== id
          );
        });
        return updatedWorkoutsByDay;
      });
    } catch (error) {
      console.error('Error deleting workout', error);
    }
  };
  

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleReset = () => {
    setSelectedDate(null);
  };

  const getDayOfWeek = (dateString) => {
    const options = { weekday: 'short' };
    const dayOfWeek = new Date(dateString).toLocaleDateString('en-US', options);
    return dayOfWeek;
  };

  return (
    <Container style={{ marginBottom: '100px' }}>
      <Image className="img-fluid" src={logo} alt="" />
      {selectedDate ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2>{selectedDate}</h2>
            <p style={{ marginLeft: '10px' }}> {getDayOfWeek(selectedDate)}</p>
          </div>
          <Button variant="secondary" onClick={handleReset}>
            Back to All Dates
          </Button>
          {selectedDate && workoutsByDay[selectedDate] ? (
            workoutsByDay[selectedDate].map((workout) => (
            <Row className="mt-4">
              <Col md={4} className='mb-4' key={workout._id}>
                <ListGroup horizontal className="text-center" style={{ marginBottom: '-40px' }}>
                  <ListGroup.Item>Type: {workout.exerciseGroup}</ListGroup.Item>
                  <ListGroup.Item>Exercise: {workout.exercise}</ListGroup.Item>
                  <ListGroup.Item>Grade: {workout.grade}</ListGroup.Item>
                  <ListGroup.Item>Attempts: {workout.attempts}</ListGroup.Item>
                  <ListGroup.Item>Angle: {workout.angle}</ListGroup.Item>
                  <ListGroup.Item>
                    <Link to={`/workouts/${workout._id}`}>
                      <Button variant='primary' className='mr-2'>Details</Button>
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Link to={`/workout/edit/${workout._id}`}>
                      <Button variant='secondary'>Edit</Button>
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button variant='danger' onClick={() => handleDelete(workout._id)}>Delete</Button>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          ))
          ) : null}
        </div>
      ) : (
        Object.keys(workoutsByDay)
          .filter(day => workoutsByDay[day].length > 0)
          .map((day) => (
            <div key={day} style={{ display: 'flex', alignItems: 'center' }}>
              <h2 onClick={() => handleDateClick(day)} style={{ cursor: 'pointer' }}>
                {day}
              </h2>
              <p style={{ marginLeft: '10px' }}> {getDayOfWeek(day)}</p>
            </div>
        ))
      )}
    </Container>
  );
};
//     <Container>
//       <Image className="img-fluid" src={logo} alt=""/>
//       {Object.keys(workoutsByDay).map((day) => (
//         <div key={day}>
//           <h2>{day}</h2>
//           <Row className="mt-4">
//             {workoutsByDay[day].map((workout) => (
//               <Col md={4} className='mb-4' key={workout._id}>
                // <Card style={{width: '18rem'}}>
                //   {/* <Card.Img variant='top' src={workout.send} alt="" /> */}
                //   <Card.Body>
                //     <Card.Title>{workout.exerciseGroup}</Card.Title>
                //     <Card.Text>Exercise: {workout.exercise}</Card.Text>
                //     <Card.Text>Grade: {workout.grade}</Card.Text>
                //     <Card.Text>Attempts: {workout.attempts}</Card.Text>
                //     <Card.Text>{workout.angle}</Card.Text>
                //     <Link to={`/workouts/${workout._id}`}>
                //       <Button variant='primary' className='mr-2'>Read More</Button>
                //     </Link>
                //     <Link to={`/workout/edit/${workout._id}`}>
                //       <Button variant='secondary'>Edit</Button>
                //     </Link>
                //     <Button variant='danger' onClick={() => handleDelete(workout._id)}>Delete</Button>
                //   </Card.Body>
                // </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       ))}
//     </Container>
//   );
// };

export default AllWorkoutsPage