import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const NewWorkoutPage = () => {
  
  //initialize state variable. create elements to store all info typed into form
  const [workout, setWorkout] = useState({
    title: "", //! need to change to stuff for tracking workouts
    author: "",
    image: "",
    content: ""
  });

  // makes call to router to route to pages
  const navigate = useNavigate();

  // event handler for key press in form box
  const handleChange = e => {
    setWorkout({...workout, [e.target.name]: e.target.value}) //take all existing data (...workout) and add to it [name of box where tying]: what they are typing
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/workouts', workout);
    navigate('/');
  };

  return(
    <Container className='mt-4'>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Tilte</Form.Label>
          <Form.Control type="text" name="title" placeholder="Title" onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Author</Form.Label>
          <Form.Control  type="text" name="author" placeholder="Author" onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Image URL</Form.Label>
          <Form.Control  type="text" name="image" placeholder="Image URL" onChange={handleChange}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control  as="textarea" rows={3} name="content" placeholder="Content" onChange={handleChange}/>
        </Form.Group>
      
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  );
};

export default NewWorkoutPage;